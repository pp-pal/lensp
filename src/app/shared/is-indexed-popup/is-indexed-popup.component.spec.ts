import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IsIndexedPopupComponent } from './is-indexed-popup.component';

describe('IsIndexedPopupComponent', () => {
  let component: IsIndexedPopupComponent;
  let fixture: ComponentFixture<IsIndexedPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IsIndexedPopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IsIndexedPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
