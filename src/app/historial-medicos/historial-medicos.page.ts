import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonLabel
  , IonCol, IonGrid, IonRow, IonIcon, IonButton, IonButtons
} from '@ionic/angular/standalone';
import { AlertController } from '@ionic/angular';
import { ApiService } from '../services/api.service'; // Asegúrate de importar tu servicio

@Component({
  selector: 'app-historial-medicos',
  templateUrl: './historial-medicos.page.html',
  styleUrls: ['./historial-medicos.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar
    , IonItem, IonLabel, IonCol, IonIcon, IonButton, IonButtons,
    IonGrid, IonRow, CommonModule, FormsModule]
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

  constructor(public router: Router, private alertController: AlertController, private apiService: ApiService) { }

  // Se ejecuta cada vez que entras a esta página
  ionViewWillEnter() {
    this.cargarMedicos();
    this.verificarSesion();
  }

  private verificarSesion() {
    const sesion = localStorage.getItem('medicoActivo');
    this.medicoActivo = sesion ? JSON.parse(sesion) : null;
  }

  ngOnInit() {}

  seleccionarTab(tab: string) {
    this.tabSeleccionado = tab;
    this.router.navigate([`/${tab}`]);
  }

  editarMedico(medico: any) {
    this.router.navigate(['/editar-medico'], { queryParams: { id: medico.id_doctor } });
  }

  toggleEstado(medico: any) {
    this.apiService.cambiarEstadoDoctor(medico.id_doctor).subscribe({
      next: (res) => {
        console.log(res.mensaje);
        //this.cargarMedicos(); // recarga la lista actualizada
        medico.doc_estado = res.estado;
      },
      error: (err) => {
        console.error('Error cambiando estado:', err);
      }
    });
  }

  cerrarSesion() {
    localStorage.removeItem('medicoActivo');
    this.router.navigate(['/login-medico']);
  }

  private cargarMedicos() {
    this.apiService.getDoctores().subscribe({
      next: (data) => {
        this.medicos = data;
        this.totalPages = Math.ceil(this.medicos.length / this.itemsPerPage);
        this.actualizarMedicosPaginados();
      },
      error: (err) => {
        console.error('Error cargando médicos:', err);
      }
    });
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
