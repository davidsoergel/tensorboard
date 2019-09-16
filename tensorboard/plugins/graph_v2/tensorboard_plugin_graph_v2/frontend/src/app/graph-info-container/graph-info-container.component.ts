import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import {
  loadGraphRequest,
  selectGraphName,
  selectLegacyGraphAndHierarchy,
  loadTestGraphRequest,
  selectGraph,
  selectVisibleGraph,
} from 'src/store/graph';
import { GraphV2PluginState } from 'src/store/types';
import { GraphAndHierarchy } from 'src/store/graph/legacy/loader';
import { Hierarchy } from 'src/store/graph/legacy/hierarchy';
import { SlimGraph } from 'src/store/graph/legacy/graph';

@Component({
  selector: 'app-graph-info-container',
  templateUrl: './graph-info-container.component.html',
  styleUrls: ['./graph-info-container.component.scss'],
})
export class GraphInfoContainerComponent implements OnInit, OnChanges {
  graphName$ = this.store.pipe(select(selectGraphName));
  /*
  legacyGraph$ = this.store.pipe(
    select(selectLegacyGraphAndHierarchy),
    switchMap(gh => {
      if (gh == null) {
        return of(null);
      }
      console.log('LOADED GRAPH');
      console.log(gh.graph);
      return of(gh.graph);
    })
  );
  legacyHierarchy$ = this.store.pipe(
    select(selectLegacyGraphAndHierarchy),
    switchMap(gh => {
      if (gh == null) {
        return of(null);
      }
      console.log('LOADED HIERARCHY');
      console.log(gh.graphHierarchy);
      return of(gh.graphHierarchy);
    })
  );
  */

  graph$ = this.store.pipe(select(selectGraph));
  visibleGraph$ = this.store.pipe(select(selectVisibleGraph));

  onClick() {
    // const action = SetGraphName('Hello world');
    /*const action = loadGraphRequest(
      'http://localhost:6006/data/plugin/graphs/graph?run=1-learning_rate%3D5e-05&conceptual=false'
    );*/
    const action = loadTestGraphRequest();
    //      this._graphUrl('1-learning_rate', 100, 'aoeu')
    //    );
    console.log(`Dispatching:`);
    console.log(action);
    this.store.dispatch(action);
  }

  _graphUrl(run: string, limitAttrSize: number, largeAttrsKey: string) {
    const params = new URLSearchParams({
      run,
      limit_attr_size: `${limitAttrSize}`,
      large_attrs_key: largeAttrsKey,
    });
    /*
    return tf_backend.getRouter().pluginRoute(
      'graphs',
      '/graph',
      params
    );
    */
    return '../graphs/graph/' + String(params);
  }

  constructor(private store: Store<GraphV2PluginState>) {}

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
  }
}
