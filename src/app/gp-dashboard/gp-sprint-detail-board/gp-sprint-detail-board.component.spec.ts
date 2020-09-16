import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GpSprintDetailBoardComponent } from './gp-sprint-detail-board.component';

describe('GpSprintDetailBoardComponent', () => {
  let component: GpSprintDetailBoardComponent;
  let fixture: ComponentFixture<GpSprintDetailBoardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GpSprintDetailBoardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GpSprintDetailBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
