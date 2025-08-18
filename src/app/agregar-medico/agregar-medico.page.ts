import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent, IonHeader, IonTitle, IonToolbar, IonItem,
  IonLabel, IonButton, IonInput, IonIcon, IonButtons
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { ApiService } from '../services/api.service';
import { Doctor } from '../interfaces/interfaceDoctor'; // Asegúrate de tener esta interfaz definida
@Component({
  selector: 'app-agregar-medico',
  templateUrl: './agregar-medico.page.html',
  styleUrls: ['./agregar-medico.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle,
    IonToolbar, IonItem, IonLabel, IonButton, IonIcon, IonButtons, IonInput, CommonModule, FormsModule]
})
export class AgregarMedicoPage implements OnInit {

  nuevoMedico: Doctor = {} as Doctor;
  medicos: Doctor[] = [];
  medicoActivo: any = null;
  verContrasena: boolean = false;

  constructor(private router: Router, private toastController: ToastController, private apiService: ApiService) { }

  // Se ejecuta cada vez que entras a esta página
  ionViewWillEnter() {
    this.cargarMedicos();
    this.verificarSesion();
  }

  ngOnInit() {
    this.cargarMedicos();
    this.verificarSesion();
  }

  private verificarSesion() {
    const sesion = localStorage.getItem('medicoActivo');
    this.medicoActivo = sesion ? JSON.parse(sesion) : null;
  }

  cargarMedicos() {
    this.apiService.getDoctores().subscribe({
      next: (doctores) => {
        this.medicos = doctores;
      },
      error: (err) => {
        console.error('Error al cargar médicos', err);
      }
    });
  }


  async agregarMedico() {
    try {
      const doctorCreado = await this.apiService.crearDoctor(this.nuevoMedico).toPromise();
      if (doctorCreado) {
        this.medicos.push(doctorCreado);

        const toast = await this.toastController.create({
          message: 'Médico agregado exitosamente.',
          duration: 2000,
          color: 'success'
        });
        await toast.present();

        this.router.navigate(['/historial-medicos']);

        this.nuevoMedico = {} as Doctor;

      }
    } catch (error) {
      console.error('Error al agregar médico:', error);
      const toast = await this.toastController.create({
        message: 'Error al agregar médico.',
        duration: 2000,
        color: 'danger'
      });
      await toast.present();
    }
  }


  cerrarSesion() {
    localStorage.removeItem('medicoActivo');
    this.router.navigate(['/login-medico']);
  }

  regresar() {
    this.router.navigate(['/historial-medicos'])
  }

  toggleVerContrasena() {
    this.verContrasena = !this.verContrasena;
  }

}
