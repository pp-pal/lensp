import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddProfilePopupComponent } from './add-profile-popup.component';

describe('AddProfilePopupComponent', () => {
  let component: AddProfilePopupComponent;
  let fixture: ComponentFixture<AddProfilePopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddProfilePopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddProfilePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
