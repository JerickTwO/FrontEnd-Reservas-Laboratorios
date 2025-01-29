import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { AlertService } from 'src/app/core/services/alerts.service';


@Component({
  selector: 'app-labs',
  templateUrl: './labs.component.html',
  standalone: true,
  imports: []
})
export class LabsComponent implements OnInit {

  constructor(
    private alertService: AlertService,
  ) {

  }

  ngOnInit(): void {

  }


}
