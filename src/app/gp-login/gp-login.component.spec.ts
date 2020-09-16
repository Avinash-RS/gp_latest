import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GpLoginComponent } from './gp-login.component';

describe('GpLoginComponent', () => {
  let component: GpLoginComponent;
  let fixture: ComponentFixture<GpLoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GpLoginComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GpLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
