import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoDeclarationComponent } from './info-Declaration.component';

describe('InfoDeclarationComponent', () => {
  let component: InfoDeclarationComponent;
  let fixture: ComponentFixture<InfoDeclarationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InfoDeclarationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InfoDeclarationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});


