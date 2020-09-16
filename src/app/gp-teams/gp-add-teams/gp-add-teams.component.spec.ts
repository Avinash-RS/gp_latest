import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GpAddTeamsComponent } from './gp-add-teams.component';

describe('GpAddTeamsComponent', () => {
  let component: GpAddTeamsComponent;
  let fixture: ComponentFixture<GpAddTeamsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GpAddTeamsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GpAddTeamsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
