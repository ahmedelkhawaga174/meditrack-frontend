import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Consultation } from './consultation';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('Consultation', () => {
  let component: Consultation;
  let fixture: ComponentFixture<Consultation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Consultation],
      providers: [
        provideRouter([]),           
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Consultation);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
