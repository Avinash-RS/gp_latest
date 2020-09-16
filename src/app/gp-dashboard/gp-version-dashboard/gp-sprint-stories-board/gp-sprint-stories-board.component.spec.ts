import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GpSprintStoriesBoardComponent } from './gp-sprint-stories-board.component';

describe('GpSprintStoriesBoardComponent', () => {
  let component: GpSprintStoriesBoardComponent;
  let fixture: ComponentFixture<GpSprintStoriesBoardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GpSprintStoriesBoardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GpSprintStoriesBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
