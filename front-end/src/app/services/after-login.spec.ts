import { TestBed } from '@angular/core/testing';

import { AfterLogin } from './after-login';

describe('AfterLogin', () => {
  let service: AfterLogin;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AfterLogin);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
