import {Component, OnInit, OnChanges, SimpleChanges} from '@angular/core';
import {Observable, of} from 'rxjs';
import {SetGraphName, selectGraphName} from 'src/store/graph';
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
    const action = SetGraphName('Hello world');
    console.log(`Dispatching ${action}`);
    this.store.dispatch(action);
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
