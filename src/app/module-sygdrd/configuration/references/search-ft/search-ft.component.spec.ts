import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchFtComponent } from './search-ft.component';

describe('SearchFtComponent', () => {
  let component: SearchFtComponent;
  let fixture: ComponentFixture<SearchFtComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SearchFtComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchFtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});








