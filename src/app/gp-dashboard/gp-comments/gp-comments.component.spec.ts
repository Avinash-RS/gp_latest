import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GpCommentsComponent } from './gp-comments.component';

describe('GpCommentsComponent', () => {
  let component: GpCommentsComponent;
  let fixture: ComponentFixture<GpCommentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GpCommentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GpCommentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
