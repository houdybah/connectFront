import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchProvisoireComponent } from './search-provisoire.component';

describe('SearchProvisoireComponent', () => {
  let component: SearchProvisoireComponent;
  let fixture: ComponentFixture<SearchProvisoireComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchProvisoireComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchProvisoireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});








