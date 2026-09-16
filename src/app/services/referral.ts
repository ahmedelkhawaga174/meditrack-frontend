import { HttpClient, HttpParams } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";

import {
  DoctorOption,
  ReferralRequest,
  ReferralResponse,
} from "../models/referral";

import { Observable } from "rxjs";


@Injectable({
  providedIn: "root",
})
export class ReferralService {

  private http = inject(HttpClient);

  private baseUrl = "http://localhost:8080/api";


  // =====================================================
  // CREATE REFERRAL
  // =====================================================

  createReferral(
    request: ReferralRequest
  ): Observable<ReferralResponse> {

    return this.http.post<ReferralResponse>(
      `${this.baseUrl}/referrals`,
      request,
      {
        withCredentials: true,
      },
    );
  }


  // =====================================================
  // GET DOCTORS
  // =====================================================

  getDoctors(): Observable<DoctorOption[]> {

    return this.http.get<DoctorOption[]>(
      `${this.baseUrl}/doctors`,
      {
        withCredentials: true,
      },
    );
  }


  // =====================================================
  // GET REFERRAL BY ID
  // =====================================================

  getReferralById(
    id: number
  ): Observable<ReferralResponse> {

    return this.http.get<ReferralResponse>(
      `${this.baseUrl}/referrals/${id}`,
      {
        withCredentials: true,
      },
    );
  }


  // =====================================================
  // GET PENDING INCOMING REFERRALS
  // =====================================================

  getPendingReferrals(
    doctorId: number
  ): Observable<ReferralResponse[]> {

    const params =
      new HttpParams()
        .set(
          "doctorId",
          doctorId.toString()
        );


    return this.http.get<ReferralResponse[]>(
      `${this.baseUrl}/referrals/pending`,
      {
        params,
        withCredentials: true,
      },
    );
  }


  // =====================================================
  // GET SENT REFERRALS
  // =====================================================

  getSentReferrals(
    doctorId: number
  ): Observable<ReferralResponse[]> {

    const params =
      new HttpParams()
        .set(
          "doctorId",
          doctorId.toString()
        );


    return this.http.get<ReferralResponse[]>(
      `${this.baseUrl}/referrals/sent`,
      {
        params,
        withCredentials: true,
      },
    );
  }


  // =====================================================
  // GET REFERRAL HISTORY
  // =====================================================

  getReferralHistory(
    doctorId: number
  ): Observable<ReferralResponse[]> {

    const params =
      new HttpParams()
        .set(
          "doctorId",
          doctorId.toString()
        );


    return this.http.get<ReferralResponse[]>(
      `${this.baseUrl}/referrals/history`,
      {
        params,
        withCredentials: true,
      },
    );
  }


  // =====================================================
  // UPDATE REFERRAL STATUS
  // =====================================================

  updateReferralStatus(
    id: number,
    status: "ACCEPTED" | "REJECTED"
  ): Observable<ReferralResponse> {

    return this.http.put<ReferralResponse>(
      `${this.baseUrl}/referrals/${id}/status`,
      {
        status,
      },
      {
        withCredentials: true,
      },
    );
  }
}