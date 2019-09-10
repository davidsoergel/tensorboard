import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnChanges,
} from '@angular/core';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-graph-info',
  templateUrl: './graph-info.component.html',
  styleUrls: ['./graph-info.component.scss'],
})
export class GraphInfoComponent implements OnInit {
  @Input() public graphName$: Observable<string>;
  @Output() public clickHandler = new EventEmitter<void>();

  constructor() {}

  public handleClick(component) {
    console.log('click', component);
    this.clickHandler.emit();
  }

  ngOnInit() {}
}
