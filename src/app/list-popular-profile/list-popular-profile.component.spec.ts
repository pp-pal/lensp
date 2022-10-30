import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListPopularProfileComponent } from './list-popular-profile.component';

describe('ListPopularProfileComponent', () => {
  let component: ListPopularProfileComponent;
  let fixture: ComponentFixture<ListPopularProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListPopularProfileComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListPopularProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
