import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SituationDeclarationComponent } from './situation-declaration.component';

describe('SituationDeclarationComponent', () => {
  let component: SituationDeclarationComponent;
  let fixture: ComponentFixture<SituationDeclarationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SituationDeclarationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SituationDeclarationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});





