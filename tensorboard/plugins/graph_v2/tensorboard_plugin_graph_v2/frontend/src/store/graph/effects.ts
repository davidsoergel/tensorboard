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
  setGraphAndHierarchy,
  setGraphName,
} from './actions';
import {
  fetchAndConstructHierarchicalGraph,
  GraphAndHierarchy,
} from './legacy/loader';
import { GraphUIState } from './types';

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
      setGraphAndHierarchy(graph),
      loadGraphSuccess(),
    ]),
    catchError(error => {
      console.log(error);
      return of(loadGraphFailure(error));
    })
  );
}

export function getTracker() {
  return {
    setMessage: msg => {
      console.log(msg);
    },
    updateProgress: value => {
      console.log(value);
    },
    reportError: (msg: string, err) => {
      console.log(msg);
      console.log(err);
    },
  };
}
