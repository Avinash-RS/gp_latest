import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GpSprintLaunchdateComponent } from './gp-sprint-launchdate.component';

describe('GpSprintLaunchdateComponent', () => {
  let component: GpSprintLaunchdateComponent;
  let fixture: ComponentFixture<GpSprintLaunchdateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GpSprintLaunchdateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GpSprintLaunchdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
