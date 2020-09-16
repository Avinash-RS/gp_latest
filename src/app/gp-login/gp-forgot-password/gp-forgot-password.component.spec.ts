import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GpForgotPasswordComponent } from './gp-forgot-password.component';

describe('GpForgotPasswordComponent', () => {
  let component: GpForgotPasswordComponent;
  let fixture: ComponentFixture<GpForgotPasswordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GpForgotPasswordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GpForgotPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
