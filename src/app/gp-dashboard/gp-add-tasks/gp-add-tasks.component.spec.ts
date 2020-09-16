import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GpAddTasksComponent } from './gp-add-tasks.component';

describe('GpAddTasksComponent', () => {
  let component: GpAddTasksComponent;
  let fixture: ComponentFixture<GpAddTasksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GpAddTasksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GpAddTasksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
