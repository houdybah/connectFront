import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailContainerAppureComponent } from './detail-Container-appure.component';

describe('DetailContainerAppureComponent', () => {
  let component: DetailContainerAppureComponent;
  let fixture: ComponentFixture<DetailContainerAppureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DetailContainerAppureComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailContainerAppureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});


