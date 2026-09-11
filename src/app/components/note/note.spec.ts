import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Note } from './note';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';

describe('Note', () => {
  let component: Note;
  let fixture: ComponentFixture<Note>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Note],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Note);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
