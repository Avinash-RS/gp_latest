import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GpErrorDialogComponent } from './gp-error-dialog.component';

describe('GpErrorDialogComponent', () => {
  let component: GpErrorDialogComponent;
  let fixture: ComponentFixture<GpErrorDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GpErrorDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GpErrorDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
