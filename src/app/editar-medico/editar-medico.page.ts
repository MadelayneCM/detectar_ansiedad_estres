import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  IonContent, IonHeader, IonTitle, IonToolbar,
  IonLabel, IonItem, IonButton, IonInput, IonButtons, IonIcon
} from '@ionic/angular/standalone';

import { ToastController } from '@ionic/angular';
import { ApiService } from '../services/api.service';
import { firstValueFrom } from 'rxjs';


@Component({
  selector: 'app-editar-medico',
  templateUrl: './editar-medico.page.html',
  styleUrls: ['./editar-medico.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, IonLabel, IonItem, IonButton,
    IonInput, IonButtons, IonIcon, CommonModule, FormsModule]
})
export class EditarMedicoPage implements OnInit {

  medico: any = {
    nombre: '',
    especialidad: '',
    correo: '',
    telefono: '',
    activo: true
  };

  medicoActivo: any = null;
  verContrasena: boolean = false;

  constructor(private router: Router, private route: ActivatedRoute, private toastController: ToastController, private apiService: ApiService) { }

  ngOnInit() {
    const idStr = this.route.snapshot.queryParamMap.get('id');
    if (!idStr) return;
    const id = Number(idStr);
    this.apiService.getDoctorId(id).subscribe({
      next: (doc) => {
        this.medico = { ...doc }; // llena el formulario
      },
      error: (err) => {
        console.error('Error al cargar médico', err);
      }
    });

    // Verificar si hay médico logueado
    const sesion = localStorage.getItem('medicoActivo');
    if (sesion) {
      this.medicoActivo = JSON.parse(sesion);
    }
  }

  async guardarCambios() {
    try {
      const doctorActualizado = await firstValueFrom(
        this.apiService.actualizarDoctor(this.medico.id_doctor, this.medico)
      );

      // Actualizar tu objeto local con lo que vino del backend
      this.medico = { ...doctorActualizado };

      const toast = await this.toastController.create({
        message: '✅ Cambios guardados correctamente.',
        duration: 2000,
        color: 'success',
        position: 'bottom'
      });
      await toast.present();

      this.router.navigate(['/historial-medicos']);
    } catch (error) {
      console.error(error);
      const toast = await this.toastController.create({
        message: '❌ Error al guardar los cambios.',
        duration: 2000,
        color: 'danger',
        position: 'bottom'
      });
      await toast.present();
    }
  }

  cerrarSesion() {
    localStorage.removeItem('medicoActivo');
    this.router.navigate(['/login-medico']);
  }

  private verificarSesion() {
    const sesion = localStorage.getItem('medicoActivo');
    this.medicoActivo = sesion ? JSON.parse(sesion) : null;
  }

  toggleVerContrasena() {
    this.verContrasena = !this.verContrasena;
  }

  regresar() {
    this.router.navigate(['/historial-medicos'])
  }

}
