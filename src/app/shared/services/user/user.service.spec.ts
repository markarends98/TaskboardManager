import { TestBed } from '@angular/core/testing';

import { UserService } from './user.service';
import { of } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';

const firestoreMock = {
  collection: () => {
    return {
      valueChanges: () => {
        return of({})
      }
    }
  }
}

describe('UserService', () => {
  let service: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: AngularFirestore, useValue: firestoreMock}
      ]
    });
    service = TestBed.inject(UserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
