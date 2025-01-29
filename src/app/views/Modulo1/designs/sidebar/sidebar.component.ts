import {
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TooltipModule } from 'primeng/tooltip';
import { CommonModule, NgClass } from '@angular/common';
import { UsuarioService } from 'src/app/core/services/usuario.service';
import { Usuario } from 'src/app/models/usuario.model';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  standalone: true,
  imports: [NgClass, RouterLink, RouterLinkActive, TooltipModule, CommonModule],
})
export class SidebarComponent implements OnInit {
  @Input() title!: string;
  @Input() sidebarHidden!: boolean;
  @Input() routes!: string[];
  activeLink: string = '';
  usuario: Usuario = this.usuarioService.usuario;
  submenuOpen = false;

  toggleSubmenu() {
    this.submenuOpen = !this.submenuOpen;
  }
  constructor(private usuarioService: UsuarioService) {}

  ngOnInit(): void {}
}
