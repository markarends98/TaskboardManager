import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SprintStartComponent } from './sprint-start.component';

describe('SprintStartComponent', () => {
  let component: SprintStartComponent;
  let fixture: ComponentFixture<SprintStartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SprintStartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SprintStartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
});
