import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OverviewBComponent } from './overview-b.component';

describe('OverviewBComponent', () => {
  let component: OverviewBComponent;
  let fixture: ComponentFixture<OverviewBComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OverviewBComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OverviewBComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
