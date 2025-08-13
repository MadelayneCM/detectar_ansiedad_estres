import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonItem,IonLabel 
  ,  IonCol, IonGrid,IonRow, IonIcon, IonButton, IonButtons
} from '@ionic/angular/standalone';
import { AlertController } from '@ionic/angular';
import { IonAlert } from '@ionic/angular/standalone';


@Component({
  selector: 'app-historial-medicos',
  templateUrl: './historial-medicos.page.html',
  styleUrls: ['./historial-medicos.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar
    ,IonItem,IonLabel,IonCol, IonIcon,IonButton, IonButtons,
    IonGrid,IonRow,CommonModule, FormsModule]
})
export class HistorialMedicosPage implements OnInit {

        tabSeleccionado: string = 'Médicos';

    medicos: any[] = [];
    medicoActivo: any = null;

    // nuevo
    currentPage: number = 1;
      itemsPerPage: number = 8; // puedes ajustar según cuántos médicos quieras ver por página
      totalPages: number = 1;
      medicosPaginados: any[] = [];

    
    // 
    

     // Se ejecuta cada vez que entras a esta página
  ionViewWillEnter() {
    this.cargarMedicos();
    this.verificarSesion();
  }


  // private cargarMedicos() {
  //   const datosGuardados = localStorage.getItem('medicosHistorial');
  //   if (datosGuardados) {
  //     let medicos = JSON.parse(datosGuardados);

  //     medicos = medicos.map((m: any) => ({
  //       ...m,
  //       id: m.id ?? Date.now() + Math.random()
  //     }));

  //     this.medicos = medicos;
  //     localStorage.setItem('medicosHistorial', JSON.stringify(this.medicos));
  //   }
  // }

  private verificarSesion() {
    const sesion = localStorage.getItem('medicoActivo');
    this.medicoActivo = sesion ? JSON.parse(sesion) : null;
  }




  constructor( public router:Router, private alertController: AlertController) { }



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


  


seleccionarTab(tab: string) {
    this.tabSeleccionado = tab;
    this.router.navigate([`/${tab}`]);
  }



editarMedico(medico: any) {
  this.router.navigate(['/editar-medico'], { queryParams: { id: medico.id } });
}



  toggleEstado(medico: any) {
    medico.activo = !medico.activo;
    this.guardarEnLocalStorage();
  }


async eliminarMedico(medico: any) {
  const alert = await this.alertController.create({
    header: '🗑️ Eliminar Médico',
    message: `¿Estás segur@ de eliminar a ${medico.nombre} ?`,
    buttons: [
      {
        text: 'Cancelar',
        role: 'cancel',
        cssClass: 'secondary'
      },
      {
        text: 'Eliminar',
        handler: () => {
          this.medicos = this.medicos.filter(m => m.id !== medico.id);
          this.guardarEnLocalStorage();
        }
      }
    ]
  });

  await alert.present();
}



  private guardarEnLocalStorage() {
    localStorage.setItem('medicosHistorial', JSON.stringify(this.medicos));
  }


  cerrarSesion() {
  localStorage.removeItem('medicoActivo');
  this.router.navigate(['/login-medico']);
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
    this.totalPages = Math.ceil(this.medicos.length / this.itemsPerPage);
    this.actualizarMedicosPaginados();

    localStorage.setItem('medicosHistorial', JSON.stringify(this.medicos));
  }
}

actualizarMedicosPaginados() {
  const start = (this.currentPage - 1) * this.itemsPerPage;
  const end = start + this.itemsPerPage;
  this.medicosPaginados = this.medicos.slice(start, end);
}

cambiarPagina(nuevaPagina: number) {
  if (nuevaPagina >= 1 && nuevaPagina <= this.totalPages) {
    this.currentPage = nuevaPagina;
    this.actualizarMedicosPaginados();
  }
}


}
