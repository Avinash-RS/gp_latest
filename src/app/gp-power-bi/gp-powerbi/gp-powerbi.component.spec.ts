import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GpPowerbiComponent } from './gp-powerbi.component';

describe('GpPowerbiComponent', () => {
  let component: GpPowerbiComponent;
  let fixture: ComponentFixture<GpPowerbiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GpPowerbiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GpPowerbiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
