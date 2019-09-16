/**
 * @license
 * Copyright 2019 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */

import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { from, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import {
  loadGraphFailure,
  loadGraphRequest,
  loadGraphSuccess,
  setLegacyGraphAndHierarchy,
  setGraphName,
  setGraph,
  loadTestGraphRequest,
} from './actions';
import {
  fetchAndConstructHierarchicalGraph,
  GraphAndHierarchy,
} from './legacy/loader';
import { GraphUIState } from './types';
import { Tracker } from './legacy/util';
import { HdagNode } from './hdag';
import { testHdag } from './hdag_test';

@Injectable()
export class GraphV2Effects {
  constructor(private action$: Actions) {}

  @Effect()
  loadGraphFromUrl$ = this.action$.pipe(
    ofType(loadGraphRequest),
    switchMap(action => {
      console.log(`Going to fetch ${action.graphUrl}`);
      return from(
        fetchAndConstructHierarchicalGraph(getTracker(), action.graphUrl, null)
      );
    }),
    /*
    switchMap((x) => {
      console.log(`Fetched`);
      console.log(x);
      return of({graphName: 'loaded', graphAndHierarchy: x});
    }),
    */
    switchMap((graph: GraphAndHierarchy) => [
      setGraphName('loaded'),
      setLegacyGraphAndHierarchy(graph),
      loadGraphSuccess(),
    ]),
    catchError(error => {
      console.log(error);
      return of(loadGraphFailure(error));
    })
  );

  @Effect()
  loadTestGraph$ = this.action$.pipe(
    ofType(loadTestGraphRequest),
    switchMap(action => {
      console.log(`Going to load test graph`);
      return of(testHdag);
    }),
    switchMap((graph: HdagNode) => [
      setGraphName('loaded'),
      setGraph(graph),
      loadGraphSuccess(),
    ]),
    catchError(error => {
      console.log(error);
      return of(loadGraphFailure(error));
    })
  );
}

export function getTracker(): Tracker {
  return {
    setMessage: (msg: string) => {
      console.log(msg);
    },
    updateProgress: (value: number) => {
      console.log(value);
    },
    reportError: (msg: string, err: Error) => {
      console.log(msg);
      console.log(err);
    },
  };
}
