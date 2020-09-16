import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GpViewMilestoneComponent } from './gp-view-milestone.component';

describe('GpViewMilestoneComponent', () => {
  let component: GpViewMilestoneComponent;
  let fixture: ComponentFixture<GpViewMilestoneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GpViewMilestoneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GpViewMilestoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
