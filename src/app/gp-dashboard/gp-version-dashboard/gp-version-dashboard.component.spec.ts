import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GpVersionDashboardComponent } from './gp-version-dashboard.component';

describe('GpVersionDashboardComponent', () => {
  let component: GpVersionDashboardComponent;
  let fixture: ComponentFixture<GpVersionDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GpVersionDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GpVersionDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
