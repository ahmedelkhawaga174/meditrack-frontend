import { Component, inject, OnInit } from '@angular/core';
import { ConsultationService } from '../../services/consultation';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-note',
  imports: [],
  templateUrl: './note.html',
  styleUrl: './note.css',
})
export class Note implements OnInit{

  private consultationService = inject(ConsultationService);
  private route = inject(ActivatedRoute)

  ngOnInit(): void {
     const consultationId: number = Number(this.route.snapshot.paramMap.get('id'));

    
    console.log(consultationId)
  }

}
