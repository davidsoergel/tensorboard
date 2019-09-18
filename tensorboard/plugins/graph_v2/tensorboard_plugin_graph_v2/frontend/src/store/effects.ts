import {Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {of, from} from 'rxjs';
import {catchError, switchMap, map} from 'rxjs/operators';

import {
  LoadGraphFailure,
  LoadGraphRequest,
  LoadGraphSuccess,
  SetGraph,
  SetGraphName,
} from './actions';
import {GraphWithLayout} from './types';

@Injectable()
export class GraphV2Effects {
  constructor(private action$: Actions) {}

  @Effect()
  loadGraphFromUrl$ = this.action$.pipe(
    ofType(LoadGraphRequest),
    switchMap((action) => {
      return of(new GraphWithLayout({modelName: 'loaded'}));
    }), // stub
    switchMap((graph: GraphWithLayout) => [
      SetGraph(graph),
      LoadGraphSuccess(),
    ]),
    catchError((error) => of(LoadGraphFailure(error)))
  );
}
