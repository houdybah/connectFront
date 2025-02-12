import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RestesARecouvrerListComponent } from './restes-arecouvrer-list.component';

describe('RestesARecouvrerListComponent', () => {
  let component: RestesARecouvrerListComponent;
  let fixture: ComponentFixture<RestesARecouvrerListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RestesARecouvrerListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RestesARecouvrerListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
