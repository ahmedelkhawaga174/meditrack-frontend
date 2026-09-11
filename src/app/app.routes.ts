import { Routes } from '@angular/router';

import { DoctorDetails } from './components/doctor-details/doctor-details';
import { DoctorSearch } from './components/doctor-search/doctor-search';
import { PendingReferrals } from './components/pending-referrals/pending-referrals';
import { PatientAppointments } from './components/patient-appointments/patient-appointments';
import { ReceptionistDashboard } from './components/receptionist-dashboard/receptionist-dashboard';
import { PatientMedicalHistory } from './components/patient-medical-history/patient-medical-history';
import { Consultation } from './components/consultation/consultation';
import { VerifyOtp } from './components/verify-otp/verify-otp';
import { Login } from './components/login/login';
import { UpcomingAppointments } from './components/upcoming-appointments/upcoming-appointments';
import { Diagnosis } from './components/diagnosis/diagnosis';
import { Register } from './components/register/register';

export const routes: Routes = [

  {
    path: '',
    redirectTo: 'register',
    pathMatch: 'full'
  },

  {
    path: 'login',
    component: Login,
  },

  {
    path: 'register',
    component: Register,
  },

  {
    path: 'verify-otp',
    component: VerifyOtp,
  },

  {
    path: 'doctors',
    component: DoctorSearch,
  },

  {
    path: 'doctors/referrals/pending',
    component: PendingReferrals,
  },

  {
    path: 'patients/:patientId/medical-history',
    component: PatientMedicalHistory
  },

  {
    path: 'consultations/:id',
    component: Consultation,
  },

  {
    path: 'doctors/:doctorId',
    component: DoctorDetails,
  },

  {
    path: 'patients/:patientId/appointments',
    component: PatientAppointments,
  },

  {
    path: 'receptionist',
    component: ReceptionistDashboard,
  },

  {
    path: 'doctors/:doctorId/appointments/upcoming',
    component: UpcomingAppointments
  },

  {
    path: 'appointments/:id/diagnosis',
    component: Diagnosis,
  },

  {
    path: '**',
    redirectTo: 'register'
  },

];