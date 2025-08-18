import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonIcon, IonButtons,
  IonItem, IonLabel, IonSelectOption, IonDatetime, IonInput, IonSelect
} from '@ionic/angular/standalone';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../services/api.service';
import { Paciente } from '../interfaces/interfacePaciente';

@Component({
  selector: 'app-registro-paciente',
  templateUrl: './registro-paciente.page.html',
  styleUrls: ['./registro-paciente.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonDatetime, IonInput, IonSelect,
    IonButton, IonIcon, IonItem, IonLabel, IonSelectOption, CommonModule, FormsModule, ReactiveFormsModule]
})
export class RegistroPacientePage implements OnInit {

  pacientes: any[] = [];
  medicoActivo: any = null;
  isEdit: boolean = false;
  origen: string | null = null;

  ionViewWillEnter() {
    this.cargarPacientes();
    this.verificarSesion();
  }

  nuevoPaciente: Paciente = {
    id_paciente: 0,
    pac_cedula: '',
    pac_nombre: '',
    pac_apellido: '',
    pac_fecnac: '',
    pac_genero: '',
    pac_tiposangre: '',
    pac_correo: ''
  };


  private cargarPacientes() {
    const datosGuardados = localStorage.getItem('pacientesHistorial');
    if (datosGuardados) {
      let pacientes = JSON.parse(datosGuardados);

      pacientes = pacientes.map((p: any) => ({
        ...p,
        id: p.id ?? Date.now() + Math.random()
      }));

      this.pacientes = pacientes;
      localStorage.setItem('pacientesHistorial', JSON.stringify(this.pacientes));
    }
  }

  private verificarSesion() {
    const sesion = localStorage.getItem('medicoActivo');
    this.medicoActivo = sesion ? JSON.parse(sesion) : null;
  }

  constructor(private router: Router, private toastController: ToastController, private route: ActivatedRoute, private apiService: ApiService) { }

  ngOnInit() {
   const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.apiService.getPacienteId(+id).subscribe(data => {
        this.nuevoPaciente = data;
      });
    }
  }

  cerrarSesion() {
    localStorage.removeItem('medicoActivo');
    this.router.navigate(['/login-medico']);
  }

  regresar() {
    if (this.origen === 'formulario-diagnostico') {
      this.router.navigate(['/formulario-diagnostico']);
    } else if (this.origen === 'pacientes') {
      this.router.navigate(['/pacientes']);
    } else {
      // Por si no llega nada, redirigir a una ruta por defecto
      this.router.navigate(['/pacientes']);
    }
  }

 guardarPaciente() {
    if (this.nuevoPaciente.id_paciente && this.nuevoPaciente.id_paciente > 0) {
      // Actualizar
      this.apiService.actualizarPaciente(this.nuevoPaciente.id_paciente, this.nuevoPaciente)
        .subscribe(() => {
          alert('Paciente actualizado con éxito');
          this.router.navigate(['/pacientes']);
        });
    } else {
      // Insertar
      this.apiService.crearPaciente(this.nuevoPaciente)
        .subscribe(() => {
          alert('Paciente agregado con éxito');
          this.router.navigate(['/pacientes']);
        });
    }
  }


}
