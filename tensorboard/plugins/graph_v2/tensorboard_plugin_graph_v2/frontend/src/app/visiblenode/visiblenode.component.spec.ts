import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisibleNodeComponent } from './visiblenode.component';

describe('VisiblenodeComponent', () => {
  let component: VisibleNodeComponent;
  let fixture: ComponentFixture<VisibleNodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [VisibleNodeComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisibleNodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
