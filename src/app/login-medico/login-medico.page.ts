  import { Component, OnInit } from '@angular/core';
  import { CommonModule } from '@angular/common';
  import { FormsModule } from '@angular/forms';
  import { IonContent, IonLabel, IonButton, IonItem, IonInput, IonIcon } from '@ionic/angular/standalone';
  import { Router } from '@angular/router';
  import { ToastController } from '@ionic/angular';
  import { ApiService } from 'src/app/services/api.service';
  import { Doctor } from 'src/app/interfaces/interfaceDoctor';

  @Component({
    selector: 'app-login-medico',
    templateUrl: './login-medico.page.html',
    styleUrls: ['./login-medico.page.scss'],
    standalone: true,
    imports: [IonContent, IonLabel, IonButton, IonInput, IonItem, IonIcon, CommonModule, FormsModule],
    providers: [ApiService]
  })
  export class LoginMedicoPage implements OnInit {

    credenciales = {
      correo: '',
      contrasena: ''
    };

    verContrasena: boolean = false;

    constructor(private router: Router, private toastController: ToastController, private apiService: ApiService) { }

    ngOnInit() {
    }

    async login() {
      if (!this.credenciales.correo || !this.credenciales.contrasena) {
        this.mostrarToast('⚠️ Ingresa correo y contraseña', 'warning');
        return;
      }

      this.apiService.login(this.credenciales.correo, this.credenciales.contrasena).subscribe({
        next: (doctor: Doctor) => {
          // Guardar sesión en localStorage
          localStorage.setItem('medicoActivo', JSON.stringify(doctor));

          this.mostrarToast(`👋 Bienvenido, Dr(a). ${doctor.doc_nombre}`, 'success');
          this.router.navigate(['/historial-diagnostico']);
        },
        error: () => {
          this.mostrarToast('❌ Credenciales incorrectas.', 'danger');
        }
      });
    }

    toggleVerContrasena() {
      this.verContrasena = !this.verContrasena;
    }
    
    private async mostrarToast(mensaje: string, color: string) {
      const toast = await this.toastController.create({
        message: mensaje,
        duration: 2000,
        color: color
      });
      await toast.present();
    }
  }