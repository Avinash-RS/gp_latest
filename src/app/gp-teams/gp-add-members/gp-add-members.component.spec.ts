import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GpAddMembersComponent } from './gp-add-members.component';

describe('GpAddMembersComponent', () => {
  let component: GpAddMembersComponent;
  let fixture: ComponentFixture<GpAddMembersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GpAddMembersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GpAddMembersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
