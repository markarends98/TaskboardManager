import { TestBed } from '@angular/core/testing';

import { SprintService } from './sprint.service';
import { of } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { Sprint } from '../../interface/sprint';

const sprint1: Sprint = {
  id: "1",
  project: "project 1",
  name: "sprint 1",
  description: "description 1",
  startDate: new Date(),
  endDate: new Date(),
  creator: "abc",
  created_at: "abc",
  status: "abc",
}

const sprint2: Sprint = {
  id: "2",
  project: "project 2",
  name: "sprint 2",
  description: "description 2",
  startDate: new Date(),
  endDate: new Date(),
  creator: "abc",
  created_at: "abc",
  status: "abc",
}

const firestoreMock = {
  collection: () => {
    return {
      valueChanges: () => {
        return of({})
      }
    }
  }
}

const sprintServiceMock = {
  getSprints: () => {
    return of([sprint1, sprint2]);
  },
  getSprint: () => {
    return of(sprint1);
  }
}

describe('SprintServiceService', () => {
  let service: SprintService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: AngularFirestore, useValue: firestoreMock},
        { provide: SprintService, useValue: sprintServiceMock}
      ]
    });
    service = TestBed.inject(SprintService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return all(2) sprints', () => {
    service.getSprints(null).subscribe(data => {
      expect(data.length).toEqual(2);
    })
  });

  it('should return specific sprint (sprint1)', () => {
    service.getSprint(null).subscribe(data => {
      expect(data.id).toEqual("1");
    })
  });
});
