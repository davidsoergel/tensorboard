import {
  Component,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges,
  Output,
  EventEmitter,
} from '@angular/core';
import { HdagVisibleNode, HdagPath } from 'src/store/graph/hdag';

@Component({
  selector: 'app-visiblenode',
  templateUrl: './visiblenode.component.html',
  styleUrls: ['./visiblenode.component.scss'],
})
export class VisibleNodeComponent implements OnInit, OnChanges {
  @Input() path: HdagPath;
  @Input() visibleNode: HdagVisibleNode;
  childPaths: HdagPath[];

  @Output() clickHandler = new EventEmitter<void>();

  constructor() {}

  ngOnInit() {}

  handleClick() {
    console.log('click');
    this.clickHandler.emit();
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);

    if (this.visibleNode == null) {
      console.log('visiblenode is null');
      this.childPaths = [];
    } else {
      this.childPaths = Object.values(this.visibleNode.children).map(
        child => child.hdagNode.path
      );
    }
  }
}
