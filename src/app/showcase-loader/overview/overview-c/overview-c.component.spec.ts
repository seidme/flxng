import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OverviewCComponent } from './overview-c.component';

describe('OverviewCComponent', () => {
  let component: OverviewCComponent;
  let fixture: ComponentFixture<OverviewCComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OverviewCComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OverviewCComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
