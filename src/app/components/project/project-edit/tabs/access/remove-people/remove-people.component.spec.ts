import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RemovePeopleComponent } from './remove-people.component';

describe('RemovePeopleComponent', () => {
  let component: RemovePeopleComponent;
  let fixture: ComponentFixture<RemovePeopleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RemovePeopleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RemovePeopleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
});
