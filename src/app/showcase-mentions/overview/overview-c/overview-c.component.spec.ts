import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OverviewAComponent } from './overview-a.component';

describe('OverviewAComponent', () => {
  let component: OverviewAComponent;
  let fixture: ComponentFixture<OverviewAComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OverviewAComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OverviewAComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
