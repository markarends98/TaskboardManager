import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SprintFinishComponent } from './sprint-finish.component';

describe('SprintFinishComponent', () => {
  let component: SprintFinishComponent;
  let fixture: ComponentFixture<SprintFinishComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SprintFinishComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SprintFinishComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
});
