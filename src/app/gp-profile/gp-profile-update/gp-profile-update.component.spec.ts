import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GpProfileUpdateComponent } from './gp-profile-update.component';

describe('GpProfileUpdateComponent', () => {
  let component: GpProfileUpdateComponent;
  let fixture: ComponentFixture<GpProfileUpdateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GpProfileUpdateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GpProfileUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
