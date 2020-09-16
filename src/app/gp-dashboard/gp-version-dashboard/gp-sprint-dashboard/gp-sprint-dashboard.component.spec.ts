import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GpSprintDashboardComponent } from './gp-sprint-dashboard.component';

describe('GpSprintDashboardComponent', () => {
  let component: GpSprintDashboardComponent;
  let fixture: ComponentFixture<GpSprintDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GpSprintDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GpSprintDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
