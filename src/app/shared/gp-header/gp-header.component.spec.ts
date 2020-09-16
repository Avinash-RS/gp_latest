import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GpHeaderComponent } from './gp-header.component';

describe('GpHeaderComponent', () => {
  let component: GpHeaderComponent;
  let fixture: ComponentFixture<GpHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GpHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GpHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
