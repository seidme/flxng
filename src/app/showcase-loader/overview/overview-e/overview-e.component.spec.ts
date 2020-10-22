import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OverviewEComponent } from './overview-e.component';

describe('OverviewEComponent', () => {
  let component: OverviewEComponent;
  let fixture: ComponentFixture<OverviewEComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OverviewEComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OverviewEComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
