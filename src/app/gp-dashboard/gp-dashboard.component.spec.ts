import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GpDashboardComponent } from './gp-dashboard.component';

describe('GpDashboardComponent', () => {
  let component: GpDashboardComponent;
  let fixture: ComponentFixture<GpDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GpDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GpDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
