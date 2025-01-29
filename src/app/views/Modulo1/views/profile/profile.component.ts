import { Component, OnDestroy, OnInit } from '@angular/core';
import { SidebarService } from '../../services/sidebar.service';
import { Subscription } from 'rxjs';
import { AbstractControl, FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AlertService } from 'src/app/core/services/alerts.service';
import { NgClass } from '@angular/common';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  providers: [],
  standalone: true,
  imports: [
    NgClass,
    FormsModule,
    ReactiveFormsModule,
    NgxMaskDirective,
    NgxMaskPipe
  ],
})
export class ProfileComponent implements OnInit {


  constructor(
    private alertService: AlertService,
    private sidebarService: SidebarService,
    private formBuilder: FormBuilder,

  ) { }

  ngOnInit(): void { }


}
