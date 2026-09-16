import { Component, inject, OnInit, signal } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { DatePipe } from "@angular/common";
import { MedicalHistoryResponse } from "../../models/medical-history";
import { Patient } from "../../services/patient";
import { ConsultationService } from "../../services/consultation";

@Component({
  selector: "app-patient-medical-history",
  standalone: true,
  imports: [DatePipe],
  templateUrl: "./patient-medical-history.html",
  styleUrl: "./patient-medical-history.css",
})
export class PatientMedicalHistory implements OnInit {

  private patientService = inject(Patient);
  private consultationService = inject(ConsultationService);

  private route = inject(ActivatedRoute);
  private router = inject(Router);


  medicalHistory =
    signal<MedicalHistoryResponse | null>(null);

  isLoading =
    signal<boolean>(true);

  errorMessage =
    signal<string | null>(null);

  doctorId =
    signal<number | null>(null);

  patientId =
    signal<number | null>(null);


  // =========================
  // Edit State
  // =========================

  editingDiagnosisId =
    signal<number | null>(null);

  editingNotesId =
    signal<number | null>(null);


  editedDiagnosis =
    signal<string>("");

  editedNotes =
    signal<string>("");


  isSavingDiagnosis =
    signal<boolean>(false);

  isSavingNotes =
    signal<boolean>(false);


  editSuccessMessage =
    signal<string | null>(null);

  editErrorMessage =
    signal<string | null>(null);


  ngOnInit(): void {

    const patientIdParam =
      this.route.snapshot.paramMap.get("patientId");

    const doctorIdParam =
      this.route.parent?.snapshot.paramMap.get("doctorId");


    if (!patientIdParam) {

      this.errorMessage.set(
        "Patient ID is missing."
      );

      this.isLoading.set(false);

      return;
    }


    const parsedPatientId =
      Number(patientIdParam);


    if (parsedPatientId <= 0) {

      this.errorMessage.set(
        "Invalid patient ID."
      );

      this.isLoading.set(false);

      return;
    }


    this.patientId.set(parsedPatientId);


    if (doctorIdParam) {

      const parsedDoctorId =
        Number(doctorIdParam);


      if (parsedDoctorId <= 0) {

        this.errorMessage.set(
          "Invalid doctor ID."
        );

        this.isLoading.set(false);

        return;
      }


      this.doctorId.set(parsedDoctorId);

      this.fetchMedicalHistory(
        parsedPatientId,
        parsedDoctorId
      );

      return;
    }


    this.fetchMedicalHistory(
      parsedPatientId
    );
  }


  fetchMedicalHistory(
    patientId: number,
    doctorId?: number
  ): void {

    this.isLoading.set(true);

    this.errorMessage.set(null);

    this.patientService
      .getMedicalHistory(
        patientId,
        doctorId
      )
      .subscribe({

        next: (data) => {

          this.medicalHistory.set(data);

          this.isLoading.set(false);
        },

        error: (err) => {

          console.error(
            "Error fetching medical history:",
            err
          );

          this.errorMessage.set(
            "Failed to load patient medical history."
          );

          this.isLoading.set(false);
        },

      });
  }


  // =========================
  // Diagnosis Editing
  // =========================

  startEditDiagnosis(
    appointmentId: number,
    diagnosis: string
  ): void {

    this.editingDiagnosisId.set(
      appointmentId
    );

    this.editedDiagnosis.set(
      diagnosis === "No formal diagnosis recorded"
        ? ""
        : diagnosis
    );

    this.editSuccessMessage.set(null);
    this.editErrorMessage.set(null);
  }


  cancelEditDiagnosis(): void {

    this.editingDiagnosisId.set(null);

    this.editedDiagnosis.set("");

    this.isSavingDiagnosis.set(false);
  }


  saveDiagnosis(
    appointmentId: number
  ): void {

    const diagnosis =
      this.editedDiagnosis().trim();


    if (!diagnosis) {

      this.editErrorMessage.set(
        "Diagnosis cannot be empty."
      );

      return;
    }


    this.isSavingDiagnosis.set(true);

    this.editErrorMessage.set(null);
    this.editSuccessMessage.set(null);


    this.consultationService
      .updateDiagnosis(
        appointmentId,
        {
          diagnosis
        }
      )
      .subscribe({

        next: () => {

          this.isSavingDiagnosis.set(false);

          this.editingDiagnosisId.set(null);

          this.editedDiagnosis.set("");

          this.editSuccessMessage.set(
            "Diagnosis updated successfully."
          );

          this.refreshMedicalHistory();
        },

        error: (err) => {

          console.error(
            "Error updating diagnosis:",
            err
          );

          this.isSavingDiagnosis.set(false);

          this.editErrorMessage.set(
            err.error?.message ||
            "Failed to update diagnosis."
          );
        },

      });
  }


  // =========================
  // Consultation Notes Editing
  // =========================

  startEditNotes(
    appointmentId: number,
    notes: string | null
  ): void {

    this.editingNotesId.set(
      appointmentId
    );

    this.editedNotes.set(
      notes || ""
    );

    this.editSuccessMessage.set(null);
    this.editErrorMessage.set(null);
  }


  cancelEditNotes(): void {

    this.editingNotesId.set(null);

    this.editedNotes.set("");

    this.isSavingNotes.set(false);
  }


  saveNotes(
    appointmentId: number
  ): void {

    const notes =
      this.editedNotes().trim();


    if (!notes) {

      this.editErrorMessage.set(
        "Consultation notes cannot be empty."
      );

      return;
    }


    this.isSavingNotes.set(true);

    this.editErrorMessage.set(null);
    this.editSuccessMessage.set(null);


    this.consultationService
      .updateNote(
        appointmentId,
        {
          content: notes
        }
      )
      .subscribe({

        next: () => {

          this.isSavingNotes.set(false);

          this.editingNotesId.set(null);

          this.editedNotes.set("");

          this.editSuccessMessage.set(
            "Consultation notes updated successfully."
          );

          this.refreshMedicalHistory();
        },

        error: (err) => {

          console.error(
            "Error updating consultation notes:",
            err
          );

          this.isSavingNotes.set(false);

          this.editErrorMessage.set(
            err.error?.message ||
            "Failed to update consultation notes."
          );
        },

      });
  }


  // =========================
  // Refresh
  // =========================

  private refreshMedicalHistory(): void {

    const currentPatientId =
      this.patientId();

    const currentDoctorId =
      this.doctorId();


    if (!currentPatientId) {
      return;
    }


    this.patientService
      .getMedicalHistory(
        currentPatientId,
        currentDoctorId ?? undefined
      )
      .subscribe({

        next: (data) => {

          this.medicalHistory.set(data);
        },

        error: (err) => {

          console.error(
            "Error refreshing medical history:",
            err
          );
        },

      });
  }


  goBack(): void {

    const doctorIdValue =
      this.doctorId();


    if (doctorIdValue) {

      this.router.navigate([
        "/doctor",
        doctorIdValue,
        "referrals",
      ]);

      return;
    }


    this.router.navigate([
      "/patients",
      this.patientId(),
      "appointments",
    ]);
  }
}