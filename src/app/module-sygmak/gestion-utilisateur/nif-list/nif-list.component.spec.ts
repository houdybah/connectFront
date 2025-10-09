import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NifListComponent } from './nif-list.component';

describe('NifListComponent', () => {
  let component: NifListComponent;
  let fixture: ComponentFixture<NifListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NifListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NifListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});





