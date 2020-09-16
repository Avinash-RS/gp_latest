import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GpMainDashboardComponent } from './gp-main-dashboard.component';

describe('GpMainDashboardComponent', () => {
  let component: GpMainDashboardComponent;
  let fixture: ComponentFixture<GpMainDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GpMainDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GpMainDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
