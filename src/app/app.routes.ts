import { Routes } from '@angular/router';
import { DoctorDetails } from './components/doctor-details/doctor-details';
import { DoctorSearch } from './components/doctor-search/doctor-search';

export const routes: Routes = [

  {
    path: 'doctors/:doctorId',
    component: DoctorDetails
  }, 
  {
    path: '**',
    component: DoctorSearch
  },
];
