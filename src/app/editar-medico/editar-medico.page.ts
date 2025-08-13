import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IonContent, IonHeader, IonTitle, IonToolbar,
  IonLabel,IonItem,IonButton, IonInput, IonButtons, IonIcon
 } from '@ionic/angular/standalone';

import { ToastController } from '@ionic/angular';


@Component({
  selector: 'app-editar-medico',
  templateUrl: './editar-medico.page.html',
  styleUrls: ['./editar-medico.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar,  IonLabel,IonItem,IonButton,
    IonInput,IonButtons, IonIcon, CommonModule, FormsModule]
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



  constructor(private router:Router, private route:ActivatedRoute, private toastController: ToastController) { }



ngOnInit() {
  const idStr = this.route.snapshot.queryParamMap.get('id');
  if (!idStr) return;

  const id = Number(idStr); // O úsalo como string si usas UUID
  const data = localStorage.getItem('medicosHistorial');

  if (data) {
    const medicos = JSON.parse(data);
    const encontrado = medicos.find((m: any) => m.id === id);

    if (encontrado) {
      this.medico = { ...encontrado };
    }
  }
  // 2. Verificar si hay médico logueado
  const sesion = localStorage.getItem('medicoActivo');
  if (sesion) {
    this.medicoActivo = JSON.parse(sesion);
  }
}


cerrarSesion() {
  localStorage.removeItem('medicoActivo');
  this.router.navigate(['/login-medico']);
  }





// ESTE SI VALE
// async guardarCambios() {
//   const data = localStorage.getItem('medicosHistorial');
//   if (data) {
//     const medicos = JSON.parse(data);

//     // Guarda el médico sin eliminar su id
//     medicos[this.medico.id] = { ...this.medico };

//     // NO hagas delete medicos[this.medico.id].id;

//     localStorage.setItem('medicosHistorial', JSON.stringify(medicos));
//   }

//   const toast = await this.toastController.create({
//     message: '✅ Cambios guardados correctamente.',
//     duration: 2000,
//     color: 'success',
//     position: 'bottom'
//   });

//   await toast.present();
//   this.router.navigate(['/historial-medicos']);
// }


async guardarCambios() {
  const data = localStorage.getItem('medicosHistorial');
  if (data) {
    const medicos = JSON.parse(data);

    // Actualiza el médico por ID
    const index = medicos.findIndex((m: any) => m.id === this.medico.id);
    if (index !== -1) {
      medicos[index] = { ...this.medico };
      localStorage.setItem('medicosHistorial', JSON.stringify(medicos));
    }
  }

  const toast = await this.toastController.create({
    message: '✅ Cambios guardados correctamente.',
    duration: 2000,
    color: 'success',
    position: 'bottom'
  });

  await toast.present();
  this.router.navigate(['/historial-medicos']);
}

 private verificarSesion() {
    const sesion = localStorage.getItem('medicoActivo');
    this.medicoActivo = sesion ? JSON.parse(sesion) : null;
  }

  toggleVerContrasena() {
  this.verContrasena = !this.verContrasena;
}

regresar(){
  this.router.navigate(['/historial-medicos'])
}


}
