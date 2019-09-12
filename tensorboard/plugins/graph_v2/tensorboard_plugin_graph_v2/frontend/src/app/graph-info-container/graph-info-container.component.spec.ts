import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphInfoContainerComponent } from './graph-info-container.component';

describe('GraphInfoContainerComponent', () => {
  let component: GraphInfoContainerComponent;
  let fixture: ComponentFixture<GraphInfoContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GraphInfoContainerComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GraphInfoContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
