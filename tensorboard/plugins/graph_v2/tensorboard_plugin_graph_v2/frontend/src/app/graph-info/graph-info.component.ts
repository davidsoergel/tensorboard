import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
} from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-graph-info',
  templateUrl: './graph-info.component.html',
  styleUrls: ['./graph-info.component.scss'],
})
export class GraphInfoComponent implements OnInit {
  @Input() graphName$: Observable<string>;
  @Output() clickHandler = new EventEmitter<void>();

  constructor() {}

  handleClick(component) {
    console.log('click', component);
    this.clickHandler.emit();
  }

  ngOnInit() {}
}
