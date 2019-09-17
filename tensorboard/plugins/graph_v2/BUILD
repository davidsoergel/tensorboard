# Graph V2 plugin.

package(default_visibility = ["//tensorboard:internal"])

licenses(["notice"])  # Apache 2.0

exports_files(["LICENSE"])

py_library(
    name = "graph_v2_plugin",
    srcs = ["graph_v2_plugin.py"],
    srcs_version = "PY2AND3",
    visibility = ["//visibility:public"],
    deps = [
        "//tensorboard/plugins:base_plugin",
        "//tensorboard/util:tb_logging",
        "@org_pocoo_werkzeug",
    ],
    data = [
        "//tensorboard/plugins/graph_v2/tf_graph_v2_plugin:graph_v2_assets",
    ],
)

py_library(
    name = "graph_v2",
    srcs = ["__init__.py"],
    srcs_version = "PY2AND3",
    visibility = ["//visibility:public"],
    deps = [
        ":graph_v2_plugin",
    ],
)
