import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduleBrowserComponent } from './schedule-browser.component';

describe('ScheduleBrowserComponent', () => {
  let component: ScheduleBrowserComponent;
  let fixture: ComponentFixture<ScheduleBrowserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScheduleBrowserComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScheduleBrowserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
