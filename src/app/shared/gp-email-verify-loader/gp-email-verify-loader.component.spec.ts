import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GpEmailVerifyLoaderComponent } from './gp-email-verify-loader.component';

describe('GpEmailVerifyLoaderComponent', () => {
  let component: GpEmailVerifyLoaderComponent;
  let fixture: ComponentFixture<GpEmailVerifyLoaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GpEmailVerifyLoaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GpEmailVerifyLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
