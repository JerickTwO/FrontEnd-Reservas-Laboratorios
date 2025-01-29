import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
import Swal from 'sweetalert2';


@Injectable({
  providedIn: 'root'
})
export class AlertService {

  timerInterval: any;


  constructor(private messageService: MessageService) { }

  // ================================================================
  // SweetAlert2
  // ================================================================

  // Alerta cuando hay alguna falla en el servidor
  alert_error_servidor() {
    Swal.fire({
      title: 'Algo anda mal!',
      text: 'Por favor, contactese con un administrador.',
      icon: 'error',
      confirmButtonText: 'Aceptar',
    });
  }

  // Alerta cuando hay campos vacíos
  alert_vacios() {
    Swal.fire({
      title: 'Campos vacios!',
      text: 'Por favor, llene todos los campos.',
      icon: 'info',
      confirmButtonText: 'Aceptar',
    });
  }

  /**
   * Alerta para respuestas de servidor
   * (response.data.json_data)
   * @param data
   */
  alert_response_server(data: any) {
    Swal.fire({
      title: data.title,
      text: data.message,
      icon: data.type,
      confirmButtonText: 'Aceptar'
    });
  }

  // Alerta de carga
  alert_carga(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      Swal.fire({
        title: 'Cargando...',
        html: 'Por favor espere.',
        timerProgressBar: true,
        allowOutsideClick: false, // Evita que la alerta se cierre al hacer clic fuera de ella
        didOpen: () => {
          Swal.showLoading(); // Muestra la animación de carga circular
          const timer = Swal.getPopup()?.querySelector('b');
          if (timer) {
            this.timerInterval = setInterval(() => {
              timer.textContent = `${Swal.getTimerLeft()}`;
            }, 100);
          }
        },
        willClose: () => {
          clearInterval(this.timerInterval);
          resolve(); // Resolver la promesa cuando la alerta se cierre
        }
      });
    });
  }

  // Alerta cuando se necesita confirmar una acción
  alert_confirmation(message: string): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      Swal.fire({
        title: 'Confirmar!',
        text: message,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Aceptar',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          // Si se hace clic en Aceptar, resuelve la promesa como true
          resolve(true);
        } else {
          // Si se hace clic en Cancelar o se cierra la alerta, resuelve la promesa como false
          resolve(false);
        }
      });
    });
  }

  // Alerta de valoracion
  alertRating(message: string): Promise<number | null> {
    return new Promise<number | null>((resolve) => {
      const htmlContent = `
        <style>
          .swal2-star {
            cursor: pointer;
            font-size: 2rem;
            color: #e4e5e9;
          }
          .swal2-star.selected {
            color: #FFD700;
          }
        </style>
        <p>${message}</p>
        <div id="rating-container">
          ${[1, 2, 3, 4, 5].map(index => `<span class="swal2-star" data-value="${index}">★</span>`).join('')}
        </div>
      `;

      Swal.fire({
        icon: 'question',
        title: 'Valorar!',
        html: htmlContent,
        showCancelButton: true,
        confirmButtonText: 'Enviar',
        cancelButtonText: 'Cancelar',
        didOpen: () => {
          const stars = document.querySelectorAll('.swal2-star');
          stars.forEach(star => {
            star.addEventListener('click', () => {
              const value = parseInt((star as HTMLElement).getAttribute('data-value') || '0', 10);
              stars.forEach((s, index) => {
                if (index < value) {
                  s.classList.add('selected');
                } else {
                  s.classList.remove('selected');
                }
              });
              // Guardar la valoración en un atributo del contenedor
              const ratingContainer = document.getElementById('rating-container');
              if (ratingContainer) {
                ratingContainer.setAttribute('data-rating', value.toString());
              }
            });
          });
        },
        preConfirm: () => {
          const ratingContainer = document.getElementById('rating-container');
          const selectedRating = ratingContainer ? parseInt(ratingContainer.getAttribute('data-rating') || '0', 10) : 0;
          return selectedRating > 0 ? selectedRating : null;
        }
      }).then((result) => {
        if (result.isConfirmed) {
          resolve(result.value as number);
        } else {
          resolve(null);
        }
      });
    });
  }

  // ================================================================
  // Primeng Alerts
  // ================================================================
  toastMessage(
    type: string = 'info',
    title: string = 'Info',
    message: string = 'Mensaje por defecto',
    temp: boolean = false
  ) {
    this.messageService.add({ severity: type, summary: title, detail: message, sticky: temp });
  }
}
