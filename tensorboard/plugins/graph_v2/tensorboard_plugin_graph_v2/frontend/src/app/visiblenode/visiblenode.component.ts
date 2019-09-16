import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
} from '@angular/core';
import { Observable, of } from 'rxjs';
import { SlimGraph, GroupNode, OpNode } from 'src/store/graph/legacy/graph';
import { Hierarchy } from 'src/store/graph/legacy/hierarchy';
import { switchMap, filter } from 'rxjs/operators';
import { HdagVisibleNode } from 'src/store/graph/hdag';

@Component({
  selector: 'app-visiblenode',
  templateUrl: './visiblenode.component.html',
  styleUrls: ['./visiblenode.component.scss'],
})
export class VisibleNodeComponent implements OnInit {
  @Input() visiblenode$: Observable<HdagVisibleNode>;
  name$: Observable<string>;
  childNames$: Observable<string[]>;

  children$: Observable<Array<GroupNode | OpNode>>;

  constructor() {}

  ngOnInit() {
    this.name$ = this.visiblenode$.pipe(
      filter(m => m !== null),
      switchMap(m => of(m.hdagNode.path[m.hdagNode.path.length - 1]))
    );
    this.childNames$ = this.visiblenode$.pipe(
      filter(m => m !== null),
      switchMap(m => of(Object.keys(m.children)))
    );
  }
}
