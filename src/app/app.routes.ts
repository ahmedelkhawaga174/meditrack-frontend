import { Routes } from '@angular/router';
import { DoctorDetails } from './components/doctor-details/doctor-details';
import { DoctorSearch } from './components/doctor-search/doctor-search';
import { PendingReferrals } from './components/pending-referrals/pending-referrals';
import { PatientAppointments } from './components/patient-appointments/patient-appointments';
import { ReceptionistDashboard } from './components/receptionist-dashboard/receptionist-dashboard';
import { PatientMedicalHistory } from './components/patient-medical-history/patient-medical-history';

export const routes: Routes = [
  {
    path: 'doctors/referrals/pending',
    component: PendingReferrals,
  },
  {
    path: 'patients/:patientId/medical-history',
    component: PatientMedicalHistory
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
    path: '**',
    component: DoctorSearch,
  },
];
