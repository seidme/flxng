import { TestBed } from '@angular/core/testing';

import { TreetableService } from './treetable.service';

describe('TreetableService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TreetableService = TestBed.get(TreetableService);
    expect(service).toBeTruthy();
  });
});
