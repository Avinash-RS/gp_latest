import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GpSprintProgressBarComponent } from './gp-sprint-progress-bar.component';

describe('GpSprintProgressBarComponent', () => {
  let component: GpSprintProgressBarComponent;
  let fixture: ComponentFixture<GpSprintProgressBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GpSprintProgressBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GpSprintProgressBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
