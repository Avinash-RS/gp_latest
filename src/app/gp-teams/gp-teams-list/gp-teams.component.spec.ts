import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GpTeamsComponent } from './gp-teams.component';

describe('GpTeamsComponent', () => {
  let component: GpTeamsComponent;
  let fixture: ComponentFixture<GpTeamsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GpTeamsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GpTeamsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
