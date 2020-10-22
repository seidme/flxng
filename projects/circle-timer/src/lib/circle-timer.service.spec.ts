import { TestBed } from '@angular/core/testing';

import { CircleTimerService } from './circle-timer.service';

describe('CircleTimerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CircleTimerService = TestBed.get(CircleTimerService);
    expect(service).toBeTruthy();
  });
});
