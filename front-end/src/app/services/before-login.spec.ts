import { TestBed } from '@angular/core/testing';

import { BeforeLogin } from './before-login';

describe('BeforeLogin', () => {
  let service: BeforeLogin;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BeforeLogin);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
