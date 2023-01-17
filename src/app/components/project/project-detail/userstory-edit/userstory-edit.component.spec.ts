import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserstoryEditComponent } from './userstory-edit.component';

describe('UserstoryEditComponent', () => {
  let component: UserstoryEditComponent;
  let fixture: ComponentFixture<UserstoryEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserstoryEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserstoryEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
});
