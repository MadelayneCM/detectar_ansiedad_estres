import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonItem,
  IonLabel, IonButton, IonInput, IonIcon, IonButtons
 } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-agregar-medico',
  templateUrl: './agregar-medico.page.html',
  styleUrls: ['./agregar-medico.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, 
    IonToolbar, IonItem,IonLabel,IonButton,IonIcon, IonButtons, IonInput,CommonModule, FormsModule]
})
export class AgregarMedicoPage implements OnInit {


   nuevoMedico: any = {
    nombre: '',
    apellido: '',
    especialidad: '',
    correo: '',
    telefono: '',
    contrasena: '',
    activo: true
  };


      medicos: any[] = [];
    medicoActivo: any = null;

          verContrasena: boolean = false;

     // Se ejecuta cada vez que entras a esta página
  ionViewWillEnter() {
    this.cargarMedicos();
    this.verificarSesion();
  }


  private cargarMedicos() {
    const datosGuardados = localStorage.getItem('medicosHistorial');
    if (datosGuardados) {
      let medicos = JSON.parse(datosGuardados);

      medicos = medicos.map((m: any) => ({
        ...m,
        id: m.id ?? Date.now() + Math.random()
      }));

      this.medicos = medicos;
      localStorage.setItem('medicosHistorial', JSON.stringify(this.medicos));
    }
  }

  private verificarSesion() {
    const sesion = localStorage.getItem('medicoActivo');
    this.medicoActivo = sesion ? JSON.parse(sesion) : null;
  }




  constructor(
    private router: Router,
    private toastController: ToastController

  ) { }

  // ngOnInit() {
  // }

  ngOnInit() {
  // 1. Cargar médicos del localStorage
  const datosGuardados = localStorage.getItem('medicosHistorial');
  if (datosGuardados) {
    let medicos = JSON.parse(datosGuardados);

    // Asegurar que todos tengan ID único
    medicos = medicos.map((m: any) => ({
      ...m,
      id: m.id ?? Date.now() + Math.random()
    }));

    this.medicos = medicos;
    localStorage.setItem('medicosHistorial', JSON.stringify(this.medicos));
  }

    // 2. Verificar si hay médico logueado
  const sesion = localStorage.getItem('medicoActivo');
  if (sesion) {
    this.medicoActivo = JSON.parse(sesion);
  }


  }

   async agregarMedico() {
    // Asignar ID único
    this.nuevoMedico.id = Date.now();

    const data = localStorage.getItem('medicosHistorial');
    const medicos = data ? JSON.parse(data) : [];

    medicos.push(this.nuevoMedico);
    localStorage.setItem('medicosHistorial', JSON.stringify(medicos));

    const toast = await this.toastController.create({
      message: '✅ Médico agregado exitosamente.',
      duration: 2000,
      color: 'success'
    });
    await toast.present();

    this.router.navigate(['/historial-medicos']);
  }


   cerrarSesion() {
  localStorage.removeItem('medicoActivo');
  this.router.navigate(['/login-medico']);
  }

  regresar(){
  this.router.navigate(['/historial-medicos'])
}

  toggleVerContrasena() {
  this.verContrasena = !this.verContrasena;
}

}
