import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailContainerDeclarationComponent } from './detail-Container-Declaration.component';

describe('DetailContainerDeclarationComponent', () => {
  let component: DetailContainerDeclarationComponent;
  let fixture: ComponentFixture<DetailContainerDeclarationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DetailContainerDeclarationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailContainerDeclarationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});


