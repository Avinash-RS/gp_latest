import { TestBed, async, inject } from '@angular/core/testing';

import { IfauthGuard } from './ifauth.guard';

describe('IfauthGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [IfauthGuard]
    });
  });

  it('should ...', inject([IfauthGuard], (guard: IfauthGuard) => {
    expect(guard).toBeTruthy();
  }));
});
