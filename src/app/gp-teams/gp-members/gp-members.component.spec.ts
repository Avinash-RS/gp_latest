import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GpMembersComponent } from './gp-members.component';

describe('GpMembersComponent', () => {
  let component: GpMembersComponent;
  let fixture: ComponentFixture<GpMembersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GpMembersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GpMembersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
