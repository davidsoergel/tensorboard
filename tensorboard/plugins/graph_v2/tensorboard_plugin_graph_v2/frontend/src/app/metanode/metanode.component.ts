import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
} from '@angular/core';
import { Observable, of } from 'rxjs';
import {
  SlimGraph,
  Metanode,
  GroupNode,
  OpNode,
} from 'src/store/graph/legacy/graph';
import { Hierarchy } from 'src/store/graph/legacy/hierarchy';
import { switchMap, filter } from 'rxjs/operators';

@Component({
  selector: 'app-metanode',
  templateUrl: './metanode.component.html',
  styleUrls: ['./metanode.component.scss'],
})
export class MetanodeComponent implements OnInit {
  @Input() metanode$: Observable<Metanode>;
  name$: Observable<string>;
  childNames$: Observable<string[]>;

  children$: Observable<Array<GroupNode | OpNode>>;

  constructor() {}

  ngOnInit() {
    this.name$ = this.metanode$.pipe(
      filter(m => m !== null),
      switchMap(m => of(m.name))
    );
    this.childNames$ = this.metanode$.pipe(
      filter(m => m !== null),
      switchMap(m => of(m.metagraph.nodes()))
    );
  }
}
