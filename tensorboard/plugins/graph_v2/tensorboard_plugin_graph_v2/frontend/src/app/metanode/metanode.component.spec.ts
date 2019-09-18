import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MetanodeComponent } from './metanode.component';

describe('MetanodeComponent', () => {
  let component: MetanodeComponent;
  let fixture: ComponentFixture<MetanodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MetanodeComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MetanodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
