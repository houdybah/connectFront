import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JournalisationListComponent } from './journalisation-list.component';

describe('JournalisationListComponent', () => {
  let component: JournalisationListComponent;
  let fixture: ComponentFixture<JournalisationListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [JournalisationListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JournalisationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});








