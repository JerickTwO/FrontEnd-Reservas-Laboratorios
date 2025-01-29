import { Component, Input, OnInit } from '@angular/core';

import { RouterLinkActive, RouterLink } from '@angular/router';

@Component({
  selector: 'app-menu-profile',
  templateUrl: './menu-profile.component.html',
  styleUrls: ['./menu-profile.component.scss'],
  standalone: true,
  imports: [RouterLinkActive, RouterLink]
})
export class MenuProfileComponent implements OnInit {

  @Input() title: string = '';
  @Input() activeLink: string = '';
  @Input() sidebarHidden: boolean = false;
  @Input() routes: string[] = [];

  constructor(
  ) {

  }

  ngOnInit(): void {

  }

  logout() {

  }
}
