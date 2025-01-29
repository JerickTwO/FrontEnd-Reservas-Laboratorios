import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { AlertService } from 'src/app/core/services/alerts.service';


@Component({
  selector: 'app-reservas',
  templateUrl: './reservas.component.html',
  standalone: true,
  imports: []
})
export class ReservasComponent implements OnInit {

  constructor(
    private alertService: AlertService,
  ) {

  }

  ngOnInit(): void {

  }

}
