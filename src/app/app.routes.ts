import { Routes } from "@angular/router";

import { DoctorDetails } from "./components/doctor-details/doctor-details";
import { DoctorSearch } from "./components/doctor-search/doctor-search";
import { MakeAppointment } from "./components/make-appointment/make-appointment";

import { PatientAppointments } from "./components/patient-appointments/patient-appointments";
import { ReceptionistDashboard } from "./components/receptionist-dashboard/receptionist-dashboard";
import { PatientMedicalHistory } from "./components/patient-medical-history/patient-medical-history";
import { Consultation } from "./components/consultation/consultation";
import { VerifyOtp } from "./components/verify-otp/verify-otp";
import { Login } from "./components/login/login";
import { UpcomingAppointments } from "./components/upcoming-appointments/upcoming-appointments";
import { Diagnosis } from "./components/diagnosis/diagnosis";
import { Register } from "./components/register/register";
import { Note } from "./components/note/note";
import { Referral } from "./components/referral/referral";
import { DoctorPatientComponent } from "./components/doctor-patient/doctor-patient";
import { ReferralDetails } from "./components/referral-details/referral-details";
import { PendingReferral } from "./components/pending-referral/pending-referral";
import { PatientPrescriptions } from "./components/patient-prescriptions/patient-prescriptions";
import { Unauthorized } from "./components/unauthorized/unauthorized";

import { roleGuard } from "./guards/role-guard";

import { ReceptionistLayout } from "./layouts/receptionist-layout/receptionist-layout";
import { ReceptionistPatients } from "./components/receptionist-patients/receptionist-patients";

import { PatientLayout } from "./layouts/patient-layout/patient-layout";
import { DoctorLayout } from "./layouts/doctor-layout/doctor-layout";
import { AppointmentDetails } from "./components/appointment-details/appointment-details";
import { PatientProfile } from "./components/patient-profile/patient-profile";
import { TodaySchedule } from "./components/today-schedule/today-schedule";
import { Referrals } from "./components/referrals/referrals";
import { DoctorAvailability } from "./components/doctor-availability/doctor-availability";

export const routes: Routes = [
  // =====================================================
  // PUBLIC
  // =====================================================

  {
    path: "",
    redirectTo: "login",
    pathMatch: "full",
  },

  {
    path: "login",
    component: Login,
  },

  {
    path: "register",
    component: Register,
  },

  {
    path: "verify-otp",
    component: VerifyOtp,
  },

  {
    path: "unauthorized",
    component: Unauthorized,
  },

  // =====================================================
  // PATIENT
  // =====================================================

  {
    path: "",
    component: PatientLayout,

    canActivate: [roleGuard],

    data: {
      roles: ["PATIENT"],
    },

    children: [
      // /doctors
      {
        path: "doctors",
        component: DoctorSearch,
      },

      // /doctors/:doctorId
      {
        path: "doctors/:doctorId",
        component: DoctorDetails,
      },

      // /doctors/:doctorId/appointments
      {
        path: "doctors/:doctorId/appointments",
        component: MakeAppointment,
      },

      // /patients/:patientId/appointments
      {
        path: "patients/:patientId/appointments",
        component: PatientAppointments,
      },

      // /patients/:patientId/medical-history
      {
        path: "patients/:patientId/medical-history",
        component: PatientMedicalHistory,
      },

      // /patients/:patientId/prescriptions
      {
        path: "patients/:patientId/prescriptions",
        component: PatientPrescriptions,
      },
      {
        path: "patients/:patientId/appointments/:appointmentId",
        component: AppointmentDetails,
      },
      {
        path: "patients/:patientId/profile",
        component: PatientProfile,
      },
    ],
  },

  // =====================================================
  // DOCTOR
  // =====================================================

  {
    path: "doctor/:doctorId",
    component: DoctorLayout,

    canActivate: [roleGuard],

    data: {
      roles: ["DOCTOR"],
    },

    children: [
      {
        path: "",
        redirectTo: "appointments/upcoming",
        pathMatch: "full",
      },

      {
        path: "appointments/upcoming",
        component: UpcomingAppointments,
      },
      {
        path: "availability",
        component: DoctorAvailability,
      },

      {
        path: "appointments/today",
        component: TodaySchedule,
      },

      {
        path: "patients",
        component: DoctorPatientComponent,
      },

      // صفحة الـ Referrals الرئيسية
      {
        path: "referrals",
        component: Referrals,
      },

      // إنشاء Referral
      {
        path: "referrals/create/:appointmentId",
        component: Referral,
      },

      // تفاصيل Referral
      {
        path: "referrals/:id",
        component: ReferralDetails,
      },

      {
        path: "consultations/:id",
        component: Consultation,
      },

      {
        path: "consultations/:id/notes",
        component: Note,
      },

      {
        path: "appointments/:id/diagnosis",
        component: Diagnosis,
      },

      {
        path: "patients/:patientId/medical-history",
        component: PatientMedicalHistory,
      },
    ],
  },

  // =====================================================
  // RECEPTIONIST
  // =====================================================

  {
    path: "receptionist",
    component: ReceptionistLayout,

    canActivate: [roleGuard],

    data: {
      roles: ["RECEPTIONIST"],
    },

    children: [
      // /receptionist
      {
        path: "",
        component: ReceptionistDashboard,
      },

      // /receptionist/patients
      {
        path: "patients",
        component: ReceptionistPatients,
      },

      // /receptionist/patients/:patientId/appointments
      {
        path: "patients/:patientId/appointments",
        component: PatientAppointments,
      },
    ],
  },

  // =====================================================
  // FALLBACK
  // =====================================================

  {
    path: "**",
    redirectTo: "login",
  },
];
