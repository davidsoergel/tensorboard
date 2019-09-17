import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
} from '@angular/core';
import { Observable, of } from 'rxjs';
import { SlimGraph, Metanode } from 'src/store/graph/legacy/graph';
import { Hierarchy } from 'src/store/graph/legacy/hierarchy';
import { switchMap } from 'rxjs/operators';
import { HdagNode, HdagVisibleNode } from 'src/store/graph/hdag';

@Component({
  selector: 'app-graph-info',
  templateUrl: './graph-info.component.html',
  styleUrls: ['./graph-info.component.scss'],
})
export class GraphInfoComponent implements OnInit {
  @Input() graphName$: Observable<string>;
  // @Input() graph$: Observable<HdagNode>;
  // @Input() visibleGraph$: Observable<HdagVisibleNode>;
  // @Input() graph$: Observable<SlimGraph>;
  // @Input() hierarchy$: Observable<Hierarchy>;
  // metanode$: Observable<Metanode>;
  // nodes$: Observable<number>;

  @Output() clickHandler = new EventEmitter<void>();

  constructor() {}

  handleClick() {
    console.log('click');
    this.clickHandler.emit();
  }

  ngOnInit() {
    /*
    this.metanode$ = this.hierarchy$.pipe(
      switchMap(h => {
        if (h == null) {
          return of(null);
        }
        return of(h.root);
      })
    );
    this.nodes$ = this.graph$.pipe(
      switchMap(g => {
        if (g == null) {
          return of(0);
        }
        return of(Object.keys(g.nodes).length);
      })
    );*/
  }
}
