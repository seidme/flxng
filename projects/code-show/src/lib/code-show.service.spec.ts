import { TestBed } from '@angular/core/testing';

import { CodeShowService } from './code-show.service';

describe('CodeShowService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CodeShowService = TestBed.get(CodeShowService);
    expect(service).toBeTruthy();
  });
});
