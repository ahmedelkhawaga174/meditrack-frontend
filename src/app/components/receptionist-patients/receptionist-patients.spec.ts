import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceptionistPatients } from './receptionist-patients';

describe('ReceptionistPatients', () => {
  let component: ReceptionistPatients;
  let fixture: ComponentFixture<ReceptionistPatients>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReceptionistPatients],
    }).compileComponents();

    fixture = TestBed.createComponent(ReceptionistPatients);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
