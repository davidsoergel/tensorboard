import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisiblenodeContainerComponent } from './visiblenode-container.component';

describe('VisiblenodeContainerComponent', () => {
  let component: VisiblenodeContainerComponent;
  let fixture: ComponentFixture<VisiblenodeContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [VisiblenodeContainerComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisiblenodeContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
