import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GpLoaderComponent } from './gp-loader.component';

describe('GpLoaderComponent', () => {
  let component: GpLoaderComponent;
  let fixture: ComponentFixture<GpLoaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GpLoaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GpLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
