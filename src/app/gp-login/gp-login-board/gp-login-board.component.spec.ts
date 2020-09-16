import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GpLoginBoardComponent } from './gp-login-board.component';

describe('GpLoginBoardComponent', () => {
  let component: GpLoginBoardComponent;
  let fixture: ComponentFixture<GpLoginBoardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GpLoginBoardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GpLoginBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
