import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OverviewDComponent } from './overview-d.component';

describe('OverviewDComponent', () => {
  let component: OverviewDComponent;
  let fixture: ComponentFixture<OverviewDComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OverviewDComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OverviewDComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
