import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PackageSetupDocsComponent } from './package-setup-docs.component';

describe('PackageSetupDocsComponent', () => {
  let component: PackageSetupDocsComponent;
  let fixture: ComponentFixture<PackageSetupDocsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PackageSetupDocsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PackageSetupDocsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
