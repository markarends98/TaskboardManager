import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SprintEditComponent } from './sprint-edit.component';

describe('SprintEditComponent', () => {
  let component: SprintEditComponent;
  let fixture: ComponentFixture<SprintEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SprintEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SprintEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
});
