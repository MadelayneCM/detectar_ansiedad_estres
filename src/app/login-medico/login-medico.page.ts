import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonLabel,IonButton, IonItem, IonInput, IonIcon} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';


@Component({
  selector: 'app-login-medico',
  templateUrl: './login-medico.page.html',
  styleUrls: ['./login-medico.page.scss'],
  standalone: true,
  imports: [IonContent,IonLabel, IonButton,IonInput,IonItem,IonIcon,CommonModule, FormsModule]
})
export class LoginMedicoPage implements OnInit {

    credenciales = {
    correo: '',
    contrasena: ''
     };

           verContrasena: boolean = false;

  constructor(private router: Router, private toastController: ToastController) { }

  ngOnInit() {
  }

  async login() {
    const data = localStorage.getItem('medicosHistorial');
    const medicos = data ? JSON.parse(data) : [];

    const medico = medicos.find((m: any) =>
      m.correo === this.credenciales.correo && m.contrasena === this.credenciales.contrasena
    );

    if (!medico) {
      const toast = await this.toastController.create({
        message: '❌ Credenciales incorrectas.',
        duration: 2000,
        color: 'danger'
      });
      await toast.present();
      return;
    }

    // Guardar sesión
    localStorage.setItem('medicoActivo', JSON.stringify(medico));

    const toast = await this.toastController.create({
      message: `👋 Bienvenido, Dr(a). ${medico.nombre}`,
      duration: 2000,
      color: 'success'
    });
    await toast.present();

    this.router.navigate(['/historial-medicos']);
  }

    toggleVerContrasena() {
  this.verContrasena = !this.verContrasena;
}

}
