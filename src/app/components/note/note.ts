import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ConsultationService } from '../../services/consultation';

@Component({
  selector: 'app-note',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './note.html',
  styleUrl: './note.css',
})
export class Note implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private consultationService = inject(ConsultationService);

  noteForm!: FormGroup;
  consultationId = signal<number | null>(null);

  isSubmitting = signal<boolean>(false);
  isEditMode = signal<boolean>(false);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);
  currentNote = signal<string | null>(null);

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.consultationId.set(id);
    }

    this.noteForm = this.fb.group({
      content: ['', [Validators.required, Validators.minLength(3)]],
    });
  }

  setEditMode(noteText: string): void {
    this.isEditMode.set(true);
    this.noteForm.patchValue({ content: noteText });
  }

  cancelEdit(): void {
    this.isEditMode.set(false);
    this.noteForm.reset();
  }

  onSubmit(): void {
    if (this.noteForm.invalid || !this.consultationId()) {
      this.noteForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set(null);
    this.successMessage.set(null);

    const id = this.consultationId()!;
    const requestPayload = { content: this.noteForm.value.content };

    if (this.isEditMode()) {
      this.consultationService.updateNote(id, requestPayload).subscribe({
        next: (res) => {
          this.isSubmitting.set(false);
          this.currentNote.set(res.notes);
          this.successMessage.set('Note updated successfully.');
          this.cancelEdit();
        },
        error: (err) => {
          this.isSubmitting.set(false);
          this.errorMessage.set(err.error?.message || 'Failed to update note.');
        },
      });
    } else {
      this.consultationService.addNoteToConsultation(id, requestPayload).subscribe({
        next: (res) => {
          this.isSubmitting.set(false);
          this.currentNote.set(res.notes);
          this.successMessage.set('Note added successfully.');
          this.noteForm.reset();
        },
        error: (err) => {
          this.isSubmitting.set(false);
          this.errorMessage.set(err.error?.message || 'Failed to add note.');
        },
      });
    }
  }
}
