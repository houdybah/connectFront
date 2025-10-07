import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoBonSortieComponent } from './info-bon-sortie.component';

describe('InfoBonSortieComponent', () => {
  let component: InfoBonSortieComponent;
  let fixture: ComponentFixture<InfoBonSortieComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InfoBonSortieComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InfoBonSortieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
