# Copyright 2017 The TensorFlow Authors. All Rights Reserved.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
# ==============================================================================
"""Library supporting tests for various debugger plugin modules."""

from __future__ import absolute_import
from __future__ import division
from __future__ import print_function

# pylint: disable=ungrouped-imports, wrong-import-order
import os
import json
import threading

import portpicker  # pylint: disable=import-error
import tensorflow as tf
from tensorflow.python import pywrap_tensorflow
from werkzeug import wrappers
from werkzeug import test as werkzeug_test

from google.protobuf import json_format
from tensorboard.backend import application
from tensorboard.backend.event_processing import plugin_event_multiplexer as event_multiplexer  # pylint: disable=line-too-long
from tensorboard.plugins import base_plugin
from tensorboard.plugins.debugger import constants
from tensorflow.core.debug import debugger_event_metadata_pb2
# pylint: enable=ungrouped-imports, wrong-import-order


class DebuggerPluginTestBase(tf.test.TestCase):

  def __init__(self, *args, **kwargs):
    super(DebuggerPluginTestBase, self).__init__(*args, **kwargs)
    self.debugger_plugin_module = None

  def setUp(self):
    super(DebuggerPluginTestBase, self).setUp()
    # Importing the debugger_plugin can sometimes unfortunately produce errors.
    try:
      # pylint: disable=g-import-not-at-top
      from tensorboard.plugins.debugger import debugger_plugin
      from tensorboard.plugins.debugger import debugger_server_lib
      # pylint: enable=g-import-not-at-top
    except Exception as e:  # pylint: disable=broad-except
      raise self.skipTest(
          'Skipping test because importing some modules failed: %r' % e)
    self.debugger_plugin_module = debugger_plugin

    # Populate the log directory with debugger event for run '.'.
    self.log_dir = self.get_temp_dir()
    file_prefix = tf.compat.as_bytes(
        os.path.join(self.log_dir, 'events.debugger'))
    writer = pywrap_tensorflow.EventsWriter(file_prefix)
    device_name = '/job:localhost/replica:0/task:0/cpu:0'
    writer.WriteEvent(
        self._CreateEventWithDebugNumericSummary(
            device_name=device_name,
            op_name='layers/Matmul',
            output_slot=0,
            wall_time=42,
            step=2,
            list_of_values=(list(range(12)) +
                            [float(tf.float32.as_datatype_enum), 1.0, 3.0])))
    writer.WriteEvent(
        self._CreateEventWithDebugNumericSummary(
            device_name=device_name,
            op_name='layers/Matmul',
            output_slot=1,
            wall_time=43,
            step=7,
            list_of_values=(
                list(range(12)) +
                [float(tf.float64.as_datatype_enum), 2.0, 3.0, 3.0])))
    writer.WriteEvent(
        self._CreateEventWithDebugNumericSummary(
            device_name=device_name,
            op_name='logits/Add',
            output_slot=0,
            wall_time=1337,
            step=7,
            list_of_values=(list(range(12)) +
                            [float(tf.int32.as_datatype_enum), 2.0, 3.0, 3.0])))
    writer.WriteEvent(
        self._CreateEventWithDebugNumericSummary(
            device_name=device_name,
            op_name='logits/Add',
            output_slot=0,
            wall_time=1338,
            step=8,
            list_of_values=(list(range(12)) +
                            [float(tf.int16.as_datatype_enum), 0.0])))
    writer.Close()

    # Populate the log directory with debugger event for run 'run_foo'.
    run_foo_directory = os.path.join(self.log_dir, 'run_foo')
    os.mkdir(run_foo_directory)
    file_prefix = tf.compat.as_bytes(
        os.path.join(run_foo_directory, 'events.debugger'))
    writer = pywrap_tensorflow.EventsWriter(file_prefix)
    writer.WriteEvent(
        self._CreateEventWithDebugNumericSummary(
            device_name=device_name,
            op_name='layers/Variable',
            output_slot=0,
            wall_time=4242,
            step=42,
            list_of_values=(list(range(12)) +
                            [float(tf.int16.as_datatype_enum), 1.0, 8.0])))
    writer.Close()

    # Start a server that will receive requests and respond with health pills.
    multiplexer = event_multiplexer.EventMultiplexer({
        '.': self.log_dir,
        'run_foo': run_foo_directory,
    })
    multiplexer.Reload()
    self.debugger_data_server_grpc_port = portpicker.pick_unused_port()

    # Fake threading behavior so that threads are synchronous.
    tf.compat.v1.test.mock.patch('threading.Thread.start', threading.Thread.run).start()

    self.mock_debugger_data_server = tf.compat.v1.test.mock.Mock(
        debugger_server_lib.DebuggerDataServer)
    self.mock_debugger_data_server_class = tf.compat.v1.test.mock.Mock(
        debugger_server_lib.DebuggerDataServer,
        return_value=self.mock_debugger_data_server)

    tf.compat.v1.test.mock.patch.object(
        debugger_server_lib,
        'DebuggerDataServer',
        self.mock_debugger_data_server_class).start()

    self.context = base_plugin.TBContext(
        logdir=self.log_dir, multiplexer=multiplexer)
    self.plugin = debugger_plugin.DebuggerPlugin(self.context)
    self.plugin.listen(self.debugger_data_server_grpc_port)
    wsgi_app = application.TensorBoardWSGI([self.plugin])
    self.server = werkzeug_test.Client(wsgi_app, wrappers.BaseResponse)

    # The debugger data server should be started at the correct port.
    self.mock_debugger_data_server_class.assert_called_once_with(
        self.debugger_data_server_grpc_port, self.log_dir)

    mock_debugger_data_server = self.mock_debugger_data_server
    start = mock_debugger_data_server.start_the_debugger_data_receiving_server
    self.assertEqual(1, start.call_count)

  def tearDown(self):
    # Remove the directory with debugger-related events files.
    tf.compat.v1.test.mock.patch.stopall()

  def _CreateEventWithDebugNumericSummary(
      self, device_name, op_name, output_slot, wall_time, step, list_of_values):
    """Creates event with a health pill summary.

    Note the debugger plugin only works with TensorFlow and, thus, uses TF
    protos and TF EventsWriter.

    Args:
      device_name: The name of the op's device.
      op_name: The name of the op to which a DebugNumericSummary was attached.
      output_slot: The numeric output slot for the tensor.
      wall_time: The numeric wall time of the event.
      step: The step of the event.
      list_of_values: A python list of values within the tensor.

    Returns:
      A `tf.Event` with a health pill summary.
    """
    event = tf.compat.v1.Event(step=step, wall_time=wall_time)
    tensor = tf.compat.v1.make_tensor_proto(
        list_of_values, dtype=tf.float64, shape=[len(list_of_values)])
    value = event.summary.value.add(
        tag=op_name,
        node_name='%s:%d:DebugNumericSummary' % (op_name, output_slot),
        tensor=tensor)
    content_proto = debugger_event_metadata_pb2.DebuggerEventMetadata(
        device=device_name, output_slot=output_slot)
    value.metadata.plugin_data.plugin_name = constants.DEBUGGER_PLUGIN_NAME
    value.metadata.plugin_data.content = tf.compat.as_bytes(
        json_format.MessageToJson(
            content_proto, including_default_value_fields=True))
    return event

  def _DeserializeResponse(self, byte_content):
    """Deserializes byte content that is a JSON encoding.

    Args:
      byte_content: The byte content of a JSON response.

    Returns:
      The deserialized python object decoded from JSON.
    """
    return json.loads(byte_content.decode('utf-8'))
