import { Routes } from '@angular/router';
import { DoctorDetails } from './components/doctor-details/doctor-details';
import { DoctorSearch } from './components/doctor-search/doctor-search';
import { PendingReferrals } from './components/pending-referrals/pending-referrals';

export const routes: Routes = [

  {
    path: 'doctors/referrals/pending',
    component: PendingReferrals
  },

  {
    path: 'doctors/:doctorId',
    component: DoctorDetails
  },
  {
    path: '**',
    component: DoctorSearch
  },
];
