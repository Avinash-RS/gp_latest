import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GpSidebarComponent } from './gp-sidebar.component';

describe('GpSidebarComponent', () => {
  let component: GpSidebarComponent;
  let fixture: ComponentFixture<GpSidebarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GpSidebarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GpSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
