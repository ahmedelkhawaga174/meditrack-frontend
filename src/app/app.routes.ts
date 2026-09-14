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
import { Note } from './components/note/note';
import { Referral } from './components/referral/referral';
import { DoctorPatientComponent } from './components/doctor-patient/doctor-patient';
import { ReferralDetails } from './components/referral-details/referral-details';
import { PendingReferral } from './components/pending-referral/pending-referral';
import { PatientPrescriptions } from './components/patient-prescriptions/patient-prescriptions';
import { Unauthorized } from './components/unauthorized/unauthorized';

import { roleGuard } from './guards/role-guard';

import { ReceptionistLayout } from './layouts/receptionist-layout/receptionist-layout';
import { ReceptionistPatients } from './components/receptionist-patients/receptionist-patients';

import { PatientLayout } from './layouts/patient-layout/patient-layout';
import { DoctorLayout } from './layouts/doctor-layout/doctor-layout';


export const routes: Routes = [

  // =====================================================
  // PUBLIC
  // =====================================================

  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },

  {
    path: 'login',
    component: Login
  },

  {
    path: 'register',
    component: Register
  },

  {
    path: 'verify-otp',
    component: VerifyOtp
  },

  {
    path: 'unauthorized',
    component: Unauthorized
  },


  // =====================================================
  // PATIENT
  // =====================================================
{
  path: '',
  component: PatientLayout,
  canActivate: [roleGuard],
  data: {
    roles: ['PATIENT']
  },

  children: [

    {
      path: 'doctors',
      component: DoctorSearch
    },

    {
      path: 'doctors/:doctorId',
      component: DoctorDetails
    },

    {
      path: 'patients/:patientId/appointments',
      component: PatientAppointments
    },

    {
      path: 'patients/:patientId/medical-history',
      component: PatientMedicalHistory
    },

    {
      path: 'patients/:patientId/prescriptions',
      component: PatientPrescriptions
    }

  ]
},


  // =====================================================
  // DOCTOR
  // =====================================================

  // Upcoming appointments
 
  {
    path: 'doctor/:doctorId',
    component: DoctorLayout,

    canActivate: [roleGuard],

    data: {
      roles: ['DOCTOR']
    },

    children: [

      // /doctor/:doctorId
      {
        path: '',
        redirectTo: 'appointments/upcoming',
        pathMatch: 'full'
      },

      // /doctor/:doctorId/appointments/upcoming
      {
        path: 'appointments/upcoming',
        component: UpcomingAppointments
      },

      // /doctor/:doctorId/patients
      {
        path: 'patients',
        component: DoctorPatientComponent
      },

      // /doctor/:doctorId/referrals/pending
      {
        path: 'referrals/pending',
        component: PendingReferral
      },

      // /doctor/:doctorId/consultations/:id
      {
        path: 'consultations/:id',
        component: Consultation
      },

      // /doctor/:doctorId/consultations/:id/notes
      {
        path: 'consultations/:id/notes',
        component: Note
      },

      // /doctor/:doctorId/appointments/:id/diagnosis
      {
        path: 'appointments/:id/diagnosis',
        component: Diagnosis
      },

      // /doctor/:doctorId/referrals/create/:appointmentId
      {
        path: 'referrals/create/:appointmentId',
        component: Referral
      },

      // /doctor/:doctorId/referrals/:id
      {
        path: 'referrals/:id',
        component: ReferralDetails
      }

    ]
  },


  // =====================================================
  // RECEPTIONIST
  // =====================================================

  {
    path: 'receptionist',
    component: ReceptionistLayout,

    canActivate: [roleGuard],

    data: {
      roles: ['RECEPTIONIST']
    },

    children: [

      // /receptionist
      {
        path: '',
        component: ReceptionistDashboard
      },

      // /receptionist/patients
      {
        path: 'patients',
        component: ReceptionistPatients
      },

      // /receptionist/patients/:patientId/appointments
      {
        path: 'patients/:patientId/appointments',
        component: PatientAppointments
      }

    ]
  },


  // =====================================================
  // FALLBACK
  // =====================================================

  {
    path: '**',
    redirectTo: 'login'
  }

];