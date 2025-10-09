import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchQuittanceComponent } from './search-quittance.component';

describe('SearchQuittanceComponent', () => {
  let component: SearchQuittanceComponent;
  let fixture: ComponentFixture<SearchQuittanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchQuittanceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchQuittanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});








