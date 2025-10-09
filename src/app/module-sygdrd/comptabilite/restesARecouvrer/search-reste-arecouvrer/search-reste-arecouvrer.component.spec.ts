import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchResteArecouvrerComponent } from './search-reste-arecouvrer.component';

describe('SearchResteArecouvrerComponent', () => {
  let component: SearchResteArecouvrerComponent;
  let fixture: ComponentFixture<SearchResteArecouvrerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchResteArecouvrerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchResteArecouvrerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});








