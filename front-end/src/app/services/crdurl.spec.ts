import { TestBed } from '@angular/core/testing';

import { Crdurl } from './crdurl';

describe('Crdurl', () => {
  let service: Crdurl;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Crdurl);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
