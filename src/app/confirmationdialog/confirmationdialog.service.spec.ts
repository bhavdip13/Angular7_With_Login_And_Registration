import { TestBed } from '@angular/core/testing';

import { ConfirmationdialogService } from './confirmationdialog.service';

describe('ConfirmationdialogService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ConfirmationdialogService = TestBed.get(ConfirmationdialogService);
    expect(service).toBeTruthy();
  });
});
