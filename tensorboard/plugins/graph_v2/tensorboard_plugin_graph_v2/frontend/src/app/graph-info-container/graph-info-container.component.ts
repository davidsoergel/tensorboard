import {Component, OnInit, OnChanges, SimpleChanges} from '@angular/core';
import {Observable, of} from 'rxjs';
import {selectGraphName, LoadGraphRequest} from 'src/store/graph';
import {Store, select} from '@ngrx/store';
import {GraphV2PluginState} from 'src/store/types';
import {switchMap} from 'rxjs/operators';

@Component({
  selector: 'app-graph-info-container',
  templateUrl: './graph-info-container.component.html',
  styleUrls: ['./graph-info-container.component.scss'],
})
export class GraphInfoContainerComponent implements OnInit, OnChanges {
  public graphName$: Observable<string>;

  public onClick() {
    // const action = SetGraphName('Hello world');
    const action = LoadGraphRequest(
      'http://localhost:6006/data/plugin/graphs/graph?run=1-learning_rate%3D5e-05&conceptual=false'
    );
    //      this._graphUrl('1-learning_rate', 100, 'aoeu')
    //    );
    console.log(`Dispatching:`);
    console.log(action);
    this.store.dispatch(action);
  }

  _graphUrl(run, limitAttrSize, largeAttrsKey) {
    const params = new URLSearchParams({
      run,
      limit_attr_size: limitAttrSize,
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

  ngOnInit() {
    console.log(this.store);
    this.graphName$ = this.store.pipe(
      switchMap((a) => {
        console.log(a);
        return of(a);
      }),
      select(selectGraphName)
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
  }
}
