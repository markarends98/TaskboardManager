import { TestBed } from '@angular/core/testing';

import { UserStoryService } from './user-story.service';
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

describe('UserStoryService', () => {
  let service: UserStoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: AngularFirestore, useValue: firestoreMock}
      ]
    });
    service = TestBed.inject(UserStoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
