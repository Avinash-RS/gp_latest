import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GpPasswordResetComponent } from './gp-password-reset.component';

describe('GpPasswordResetComponent', () => {
  let component: GpPasswordResetComponent;
  let fixture: ComponentFixture<GpPasswordResetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GpPasswordResetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GpPasswordResetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
