import {
  Component,
  Input,
  OnInit,
  SimpleChanges,
  OnChanges,
} from '@angular/core';
import { Observable } from 'rxjs';
import { HdagVisibleNode, HdagPath } from 'src/store/graph/hdag';
import { Store, select } from '@ngrx/store';
import { GraphV2PluginState } from 'src/store/types';
import { expandNode, selectVisibleNode, toggleNode } from 'src/store/graph';

@Component({
  selector: 'app-visiblenode-container',
  templateUrl: './visiblenode-container.component.html',
  styleUrls: ['./visiblenode-container.component.scss'],
})
export class VisiblenodeContainerComponent implements OnInit, OnChanges {
  @Input() path: HdagPath;

  visibleNode$: Observable<HdagVisibleNode>;

  constructor(private store: Store<GraphV2PluginState>) {}

  ngOnInit() {
    this.visibleNode$ = this.store.pipe(select(selectVisibleNode(this.path)));
  }

  onClick() {
    const action = toggleNode(this.path);
    this.store.dispatch(action);
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
  }
}
