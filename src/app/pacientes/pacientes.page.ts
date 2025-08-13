import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonHeader, IonTitle, IonToolbar, IonButton, IonButtons, IonIcon,
  IonContent, IonGrid, IonRow, IonCol
 } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
 import { ToastController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';


@Component({
  selector: 'app-pacientes',
  templateUrl: './pacientes.page.html',
  styleUrls: ['./pacientes.page.scss'],
  standalone: true,
  imports: [IonHeader, IonTitle, IonToolbar,   IonContent, IonGrid, IonRow, IonCol,
    IonButton, IonButtons, IonIcon, CommonModule, FormsModule]
})
export class PacientesPage implements OnInit {


    pacientes: any[] = [];  
    medicoActivo: any = null;
      tabSeleccionado: string = 'paciente';

     // Se ejecuta cada vez que entras a esta página
  ionViewWillEnter() {
      this.cargarPacientes(); 
    this.verificarSesion();
  }

   cargarPacientes() {
    const data = localStorage.getItem('pacientesHistorial');
    if (data) {
      this.pacientes = JSON.parse(data);
    } else {
      this.pacientes = [];
    }
  }


  private verificarSesion() {
    const sesion = localStorage.getItem('medicoActivo');
    this.medicoActivo = sesion ? JSON.parse(sesion) : null;
  }



  constructor(    private router: Router, private toastController: ToastController, private alertController: AlertController) { }

 ngOnInit() {

   const data = localStorage.getItem('pacientesHistorial');
    this.pacientes = data ? JSON.parse(data) : [];

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

//   editarPaciente(id: number) {
//   this.router.navigate(['/registro-paciente', id]);
// }
editarPaciente(id: number) {
  this.router.navigate(['/registro-paciente', id], { state: { origen: 'pacientes' } });
}


async confirmarEliminarPaciente(id: number) {
  const alert = await this.alertController.create({
    header: 'Confirmar eliminación',
    message: '¿Estás seguro que quieres eliminar este paciente? 🗑️',
    buttons: [
      {
        text: 'Cancelar',
        role: 'cancel',
        cssClass: 'secondary',
        handler: () => {
          // Nada que hacer aquí
        }
      }, {
        text: 'Eliminar',
        handler: () => {
          this.borrarPaciente(id);
        }
      }
    ]
  });

  await alert.present();
}

async borrarPaciente(id: number) {
  const data = localStorage.getItem('pacientesHistorial');
  if (!data) return; // nada que borrar

  let pacientes = JSON.parse(data);

  // Filtramos para eliminar el paciente con el id
  pacientes = pacientes.filter((p: any) => p.id !== id);

  // Guardamos la lista actualizada
  localStorage.setItem('pacientesHistorial', JSON.stringify(pacientes));

  // Actualizamos la lista local para refrescar la tabla
  this.pacientes = pacientes;

  // Toast de confirmación
  const toast = await this.toastController.create({
    message: '🗑️ Paciente eliminado correctamente',
    duration: 2000,
    color: 'danger'
  });
  await toast.present();
}

formatearFecha(fechaISO: string): string {
  if (!fechaISO) return '';
  const fecha = new Date(fechaISO);
  const dia = fecha.getDate().toString().padStart(2, '0');
  const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
  const anio = fecha.getFullYear();
  return `${dia}/${mes}/${anio}`;
}

seleccionarTab(tab: string) {
    this.tabSeleccionado = tab;
    this.router.navigate([`/${tab}`]);
  }





}
