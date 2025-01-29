import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { AlertService } from 'src/app/core/services/alerts.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  imports: []
})
export class HomeComponent implements OnInit {

  constructor(
    private alertService: AlertService,
  ) {

  }

  ngOnInit(): void {

  }


}
