import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GpStoriesTabComponent } from './gp-stories-tab.component';

describe('GpStoriesTabComponent', () => {
  let component: GpStoriesTabComponent;
  let fixture: ComponentFixture<GpStoriesTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GpStoriesTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GpStoriesTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
