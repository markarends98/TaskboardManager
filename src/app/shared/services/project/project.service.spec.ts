import { TestBed } from '@angular/core/testing';

import { ProjectService } from './project.service';
import { of } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { Project } from '../../interface/project';

const project1: Project = {
  id: "1",
  name: "project 1",
  description: "description 1",
  owner: "abc",
  image: "abc",
  archived: false,
  members: null,
}

const project2: Project = {
  id: "2",
  name: "project 2",
  description: "description 2",
  owner: "abc",
  image: "abc",
  archived: false,
  members: null,
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

const projectServiceMock = {
  getProjects: () => {
    return of([project1, project2]);
  },
  getProject: () => {
    return of(project1);
  },
  archiveProject: () => {
    project1.archived = true;
    return of(project1);
  }
}

describe('ProjectService', () => {
  let service: ProjectService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: AngularFirestore, useValue: firestoreMock},
        { provide: ProjectService, useValue: projectServiceMock}
      ]
    });
    service = TestBed.inject(ProjectService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return all(2) projects', () => {
    let result = service.getProjects(null);
    result.subscribe(data => {
      expect(data.length).toEqual(2);
    })
  });

  it('should return specific project (project1)', () => {
    let result = service.getProject(null);
    result.subscribe(data => {
      expect(data.id).toEqual("1");
    })
  });

  it('should archive project', () => {
    service.archiveProject(null);
    expect(project1.archived).toEqual(true);
  });
});
