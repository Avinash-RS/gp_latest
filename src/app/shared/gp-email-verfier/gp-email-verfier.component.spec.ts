import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GpEmailVerfierComponent } from './gp-email-verfier.component';

describe('GpEmailVerfierComponent', () => {
  let component: GpEmailVerfierComponent;
  let fixture: ComponentFixture<GpEmailVerfierComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GpEmailVerfierComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GpEmailVerfierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
