import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonRadioGroup, IonContent, IonHeader, IonRadio, IonTitle, IonToolbar, IonItem, IonLabel,
  IonButton, IonInput, IonIcon, IonButtons, IonText
} from '@ionic/angular/standalone';
import { AlertController } from '@ionic/angular';
import { ViewChild, TemplateRef } from '@angular/core';

import { ModalController } from '@ionic/angular';
import { ResultadoDiagnosticoModalComponent } from 'src/app/resultado-diagnostico-modal/resultado-diagnostico-modal.component';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { PacienteDatos } from '../../interfaces/interfacePaciente';
import { AtributosEntrada, AtributosEntradaAnsiedd, ResultadoPrediccion } from 'src/app/interfaces/interfacePrediccionEstres';
import { GuardarConsultaRequest } from 'src/app/interfaces/interfaceConsulta';

@Component({
  selector: 'app-formulario-diagnostico',
  templateUrl: './formulario-diagnostico.page.html',
  styleUrls: ['./formulario-diagnostico.page.scss'],
  standalone: true,
  imports: [IonRadioGroup, ReactiveFormsModule, IonContent, IonHeader, IonRadio, IonTitle, IonIcon, IonToolbar, IonItem, IonLabel,
    IonInput, IonButton, CommonModule, FormsModule, IonButtons, IonText],
  providers: [ModalController]

})
export class FormularioDiagnosticoPage implements OnInit {

  tabSeleccionado: string = 'diagnostico';

  medicos: any[] = [];
  medicoActivo: any = null;
  cedulaBuscar: string = '';
  pacienteEncontrado: PacienteDatos | null = null;


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

  @ViewChild('alertTemplate', { static: true }) alertTemplate!: TemplateRef<any>;

  nombrePaciente = '';
  edad: any = '';
  fecha = '';
  emg: any = '';
  ecg: any = '';
  resp: any = '';
  temp: any = '';
  eda: any = '';
  tipoDiagnostico: string = '';
  tratamiento: string = '';


  diagnosticoGenerado: boolean = false;
  estado: string = '';

  constructor(private alertController: AlertController, private modalController: ModalController, private router: Router, private apiService: ApiService) { }

  // ngOnInit() {
  // }

  ngOnInit() {
    // 1. Cargar médicos desde la API
    this.apiService.getDoctores().subscribe({
      next: (medicos: any[]) => {
        // Asegurar que todos tengan ID único
        this.medicos = medicos.map((m: any) => ({
          ...m,
          id: m.id ?? Date.now() + Math.random()
        }));
      },
      error: (err) => {
        console.error('Error al cargar médicos:', err);
      }
    });

    // 2. Verificar si hay médico logueado
    const sesion = localStorage.getItem('medicoActivo');
    if (sesion) {
      this.medicoActivo = JSON.parse(sesion);
    }
  }

  // async mostrarResultadoPrediccion() {
  //   if (!this.tipoDiagnostico) {
  //     const alerta = await this.alertController.create({
  //       header: 'Diagnóstico no seleccionado',
  //       message: 'Por favor selecciona si deseas diagnosticar estrés o ansiedad.',
  //       buttons: ['OK'],
  //     });
  //     await alerta.present();
  //     return;
  //   }

  //   const entrada: AtributosEntrada = {
  //     EMG: Number(this.emg),
  //     ECG: Number(this.ecg),
  //     RESP: Number(this.resp),
  //     TEMP: Number(this.temp),
  //     EDA: Number(this.eda),
  //   };

  //    const entradaAnsiedad: AtributosEntradaAnsiedd = {
  //     ecg: Number(this.ecg),
  //     gsr: Number(this.eda),
  //     skt: Number(this.temp),
  //     resp: Number(this.resp),
  //   };


  //   this.apiService.predecirEstres(entrada).subscribe({
  //     next: async (res) => {
  //       this.estado = res.estado;
  //       this.diagnosticoGenerado = true;

  //       const modal = await this.modalController.create({
  //         component: ResultadoDiagnosticoModalComponent,
  //         componentProps: {
  //           nombrePaciente: this.nombrePaciente,
  //           estado: res.estado

  //         }
  //       });
  //       await modal.present();
  //     },
  //     error: async (err) => {
  //       console.error('Error en predicción:', err);
  //       const alerta = await this.alertController.create({
  //         header: 'Error en diagnóstico',
  //         message: 'No se pudo obtener la predicción. Intenta de nuevo.',
  //         buttons: ['OK'],
  //       });
  //       await alerta.present();
  //     }
  //   });
  // }

  async mostrarResultadoPrediccion() {
    if (!this.tipoDiagnostico) {
      const alerta = await this.alertController.create({
        header: 'Diagnóstico no seleccionado',
        message: 'Por favor selecciona si deseas diagnosticar estrés o ansiedad.',
        buttons: ['OK'],
      });
      await alerta.present();
      return;
    }

    if (this.tipoDiagnostico === 'estres') {
      const entrada: AtributosEntrada = {
        EMG: Number(this.emg),
        ECG: Number(this.ecg),
        RESP: Number(this.resp),
        TEMP: Number(this.temp),
        EDA: Number(this.eda),
      };

      this.apiService.predecirEstres(entrada).subscribe({
        next: async (res) => {
          this.estado = res.estado;
          this.diagnosticoGenerado = true;

          const modal = await this.modalController.create({
            component: ResultadoDiagnosticoModalComponent,
            componentProps: {
              nombrePaciente: this.nombrePaciente,
              estado: res.estado
            }
          });
          await modal.present();
        },
        error: async (err) => {
          console.error('Error en predicción de estrés:', err);
          const alerta = await this.alertController.create({
            header: 'Error en diagnóstico',
            message: 'No se pudo obtener la predicción de estrés. Intenta de nuevo.',
            buttons: ['OK'],
          });
          await alerta.present();
        }
      });
    }

    if (this.tipoDiagnostico === 'ansiedad') {
      const entradaAnsiedad: AtributosEntradaAnsiedd = {
        ecg: Number(this.ecg),
        gsr: Number(this.eda),   // mapeo: gsr = EDA
        skt: Number(this.temp),  // mapeo: skt = Temp
        resp: Number(this.resp),
      };

      this.apiService.predecirAnsiedad(entradaAnsiedad).subscribe({
        next: async (res) => {
          this.estado = res.estado;
          this.diagnosticoGenerado = true;

          const modal = await this.modalController.create({
            component: ResultadoDiagnosticoModalComponent,
            componentProps: {
              nombrePaciente: this.nombrePaciente,
              estado: res.estado
            }
          });
          await modal.present();
        },
        error: async (err) => {
          console.error('Error en predicción de ansiedad:', err);
          const alerta = await this.alertController.create({
            header: 'Error en diagnóstico',
            message: 'No se pudo obtener la predicción de ansiedad. Intenta de nuevo.',
            buttons: ['OK'],
          });
          await alerta.present();
        }
      });
    }
  }


  goToHistorial() {
    this.router.navigate(['/historial-diagnostico']);
  }
  goToDash() {
    this.router.navigate(['/dashboard']);
  }

  seleccionarTab(tab: string) {
    this.tabSeleccionado = tab;
    this.router.navigate([`/${tab}`]);
  }

  cerrarSesion() {
    localStorage.removeItem('medicoActivo');
    this.router.navigate(['/login-medico']);
  }

  // guardarConTratamiento() {
  //   const diagnosticos = JSON.parse(localStorage.getItem('diagnosticos') || '[]');

  //   // Encuentra el último diagnóstico (el más reciente)
  //   const ultimo = diagnosticos[diagnosticos.length - 1];

  //   if (ultimo) {
  //     ultimo.tratamiento = this.tratamiento;
  //     localStorage.setItem('diagnosticos', JSON.stringify(diagnosticos));
  //     this.tratamiento = '';
  //     this.diagnosticoGenerado = false;
  //     this.estado = '';

  //     this.alertController.create({
  //       header: '✅ Tratamiento Guardado',
  //       message: 'El tratamiento ha sido guardado exitosamente junto al diagnóstico.',
  //       buttons: ['OK']
  //     }).then(alert => alert.present());
  //   }
  // }

  async guardarConTratamiento() {
    try {
      // Validar que todos los campos estén llenos
      if (!this.tratamiento.trim()) {
        this.mostrarAlerta('Error', 'Por favor ingrese el tratamiento');
        return;
      }

      if (!this.pacienteEncontrado) {
        this.mostrarAlerta('Error', 'No se ha encontrado un paciente');
        return;
      }

      // Preparar los datos para enviar al backend
      const consultaData: GuardarConsultaRequest = {
        cedula: this.cedulaBuscar,
        id_doctor: this.medicoActivo.id_doctor, // Asumiendo que tienes el médico activo
        atributos: {
          EMG: this.emg || 0,
          ECG: this.ecg || 0,
          RESP: this.resp || 0,
          TEMP: this.temp || 0,
          EDA: this.eda || 0
        },
        estado: this.estado,
        tratamiento: this.tratamiento,
        tipo_diag: this.tipoDiagnostico === 'estres' ? 'Estrés' : 'Ansiedad'
      };

      // Enviar al backend
      this.apiService.guardarConsulta(consultaData).subscribe({
        next: (response) => {
          console.log('Consulta guardada exitosamente:', response);

          // Limpiar el formulario
          this.limpiarFormulario();

          this.mostrarAlertaExito('✅ Consulta Guardada',
            'El diagnóstico y tratamiento han sido guardados exitosamente en el sistema.');
        },
        error: (error) => {
          console.error('Error al guardar consulta:', error);
          this.mostrarAlerta('Error',
            'No se pudo guardar la consulta. Por favor, intente nuevamente.');
        }
      });

    } catch (error) {
      console.error('Error inesperado:', error);
      this.mostrarAlerta('Error', 'Ocurrió un error inesperado');
    }
  }
  buscarPaciente() {
    this.apiService.getPacienteCedulaDatos(this.cedulaBuscar).subscribe({
      next: (encontrado: any) => {
        if (encontrado) {
          this.pacienteEncontrado = encontrado;
          // Rellenar automáticamente el nombre
          this.nombrePaciente = `${encontrado.nombre} ${encontrado.apellido}`;
        } else {
          this.pacienteEncontrado = null;
          this.mostrarAlertaPacienteNoEncontrado();
          console.log('Paciente encontrado:', this.pacienteEncontrado);

        }
      },
      error: (err) => {
        console.error('Error al buscar paciente:', err);
        this.pacienteEncontrado = null;
        this.mostrarAlertaPacienteNoEncontrado();
      }
    });
  }

  private async mostrarAlerta(titulo: string, mensaje: string) {
    const alert = await this.alertController.create({
      header: titulo,
      message: mensaje,
      buttons: ['OK']
    });
    await alert.present();
  }

  private async mostrarAlertaExito(titulo: string, mensaje: string) {
    const alert = await this.alertController.create({
      header: titulo,
      message: mensaje,
      buttons: ['OK']
    });
    await alert.present();
  }

  private limpiarFormulario() {
    this.tratamiento = '';
    this.diagnosticoGenerado = false;
    this.estado = '';
    this.emg = 0;
    this.ecg = 0;
    this.resp = 0;
    this.temp = 0;
    this.eda = 0;
    this.tipoDiagnostico = '';
    this.pacienteEncontrado = null;
    this.cedulaBuscar = '';
  }

  async mostrarAlertaPacienteNoEncontrado() {
    const alert = await this.alertController.create({
      header: 'Paciente no encontrado',
      message: 'El paciente no se encuentra, ¿deseas ingresarlo?',
      buttons: [
        {
          text: 'No',
          role: 'cancel'
        },
        {
          text: 'Sí',
          handler: () => {
            this.router.navigate(['/registro-paciente'], { state: { origen: 'formulario-diagnostico' } });
          }

        }
      ]
    });
    await alert.present();
  }


}
