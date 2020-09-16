import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalInfoWithbuttonComponent } from './modal-info-withbutton.component';

describe('ModalInfoWithbuttonComponent', () => {
  let component: ModalInfoWithbuttonComponent;
  let fixture: ComponentFixture<ModalInfoWithbuttonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalInfoWithbuttonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalInfoWithbuttonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
