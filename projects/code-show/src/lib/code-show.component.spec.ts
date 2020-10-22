import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CodeShowComponent } from './code-show.component';

describe('CodeShowComponent', () => {
  let component: CodeShowComponent;
  let fixture: ComponentFixture<CodeShowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CodeShowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CodeShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
