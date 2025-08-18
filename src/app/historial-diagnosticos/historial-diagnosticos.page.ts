import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent, IonHeader, IonTitle, IonToolbar, IonGrid, IonRow, IonCol
  , IonItem, IonLabel, IonInput, IonIcon, IonButtons, IonButton
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { ViewChild, ElementRef } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { AlertController } from '@ionic/angular';
import { ApiService } from '../services/api.service';
import { ConsultaPorCedula } from '../interfaces/interfaceConsulta';
import { ChangeDetectorRef } from '@angular/core';

Chart.register(...registerables);

@Component({
  selector: 'app-historial-diagnosticos',
  templateUrl: './historial-diagnosticos.page.html',
  styleUrls: ['./historial-diagnosticos.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonGrid, IonRow
    , IonCol, IonItem, IonLabel, IonInput, IonIcon, IonButtons, IonButton
  ]
})
export class HistorialDiagnosticosPage implements OnInit {
  tabSeleccionado: string = 'historial';

  cedulaPaciente: string = '';
  diagnosticosFiltrados: any[] = [];
  diagnosticos: ConsultaPorCedula[] = [];


  // nuevas cosas agregadas
  currentPage: number = 1;
  itemsPerPage: number = 4;
  totalPages: number = 1;


  // aaa
  medicos: any[] = [];
  medicoActivo: any = null;

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

  @ViewChild('chartCanvas') chartCanvas!: ElementRef;
  chart: any;

  constructor(private router: Router, private alertCtrl: AlertController, private apiService: ApiService, private cdr: ChangeDetectorRef
  ) { }


  ngOnInit() {
    this.apiService.listarConsultas().subscribe((consultas: ConsultaPorCedula[]) => {
      this.diagnosticosFiltrados = consultas.map(d => ({
        fecha_consulta: d.fecha_consulta || '',
        nombre_paciente: d.nombre_paciente || '',
        tipo_diagnostico: d.tipo_diagnostico || '',
        estado: d.estado || '',
        atributos: d.atributos ? (typeof d.atributos === 'string' ? JSON.parse(d.atributos.replace(/'/g, '"')) : d.atributos) : {},
        nombre_doctor: d.nombre_doctor || 'Desconocido',
        tratamiento: d.tratamiento || ''
      }));
      console.log('Consultas generales:', consultas); // 👈 Verifica si hay datos
      this.totalPages = Math.ceil(this.diagnosticosFiltrados.length / this.itemsPerPage);
      this.currentPage = 1;
      this.actualizarDiagnosticosPaginados();
    });
  }

  getColor(estado: string): string {
    if (!estado) return 'black'; //añadi esto -MD
    switch (estado.toLowerCase()) {
      case 'estrés':
        return 'red';
      case 'ansiedad':
        return 'orange';
      default:
        return 'green';
    }
  }

  goToDiagnostico() {
    this.router.navigate(['/formulario-diagnostico']);
  }

  consultasPorCedula: ConsultaPorCedula[] = [];

  buscarPorCedula() {
    if (!this.cedulaPaciente) {
      this.apiService.listarConsultas().subscribe({
        next: (data: ConsultaPorCedula[]) => {
          this.diagnosticosFiltrados = data.map(d => ({
            fecha_consulta: d.fecha_consulta || '',
            cedula_paciente: d.cedula_paciente || '',
            nombre_paciente: d.nombre_paciente || '',
            tipo_diagnostico: d.tipo_diagnostico || '',
            estado: d.estado || '',
            atributos: d.atributos ? (typeof d.atributos === 'string' ? JSON.parse(d.atributos.replace(/'/g, '"')) : d.atributos) : {},
            nombre_doctor: d.nombre_doctor || 'Desconocido',
            tratamiento: d.tratamiento || ''
          }));
          this.totalPages = Math.ceil(this.diagnosticosFiltrados.length / this.itemsPerPage);
          this.currentPage = 1;
          this.cdr.detectChanges();
          this.actualizarDiagnosticosPaginados();
          //this.actualizarGrafico(this.diagnosticosFiltrados);

        },
        error: (err) => {
          console.error(err);
          this.diagnosticosFiltrados = [];
        }
      });
      return;
    }

    // Con cédula: filtramos usando el endpoint
    this.apiService.listarConsultasPorCedula(this.cedulaPaciente).subscribe({
      next: (data: ConsultaPorCedula[]) => {
        this.diagnosticosFiltrados = data.map(d => ({
          fecha_consulta: d.fecha_consulta,
          cedula_paciente: d.cedula_paciente,
          nombre_paciente: d.nombre_paciente,
          tipo_diagnostico: d.tipo_diagnostico,
          estado: d.estado,
          atributos: d.atributos
            ? typeof d.atributos === 'string'
              ? JSON.parse(d.atributos.replace(/'/g, '"'))
              : d.atributos
            : {},
          nombre_doctor: d.nombre_doctor,
          tratamiento: d.tratamiento
        }));

        this.totalPages = Math.ceil(this.diagnosticosFiltrados.length / this.itemsPerPage);
        this.currentPage = 1;
        this.cdr.detectChanges();

        this.actualizarDiagnosticosPaginados();
        //this.actualizarGrafico(this.diagnosticosFiltrados);

      },
      error: (err) => {
        console.error(err);
        this.diagnosticosFiltrados = [];
      }
    });
  }

  ionViewDidEnter() {
    //setTimeout(() => this.actualizarGrafico(), 100); // Asegura que el canvas esté cargado
    this.apiService.listarConsultas().subscribe((consultas: ConsultaPorCedula[]) => {
      this.actualizarGrafico(consultas);
    });
  }

  actualizarGrafico(datos: any[] = this.diagnosticosFiltrados) {
    if (!this.chartCanvas) return;

    const conteo = {
      estrés: 0,
      ansiedad: 0,
      normal: 0,
    };

    for (let item of datos) {
      // Puede venir como "estado" (local) o "con_estado" (API)
      const estado = (item.estado || item.estado || '').toLowerCase();
      if (estado in conteo) {
        conteo[estado as keyof typeof conteo]++;
      }
    }

    const data = [
      conteo.estrés,
      conteo.ansiedad,
      conteo.normal,
    ];

    const labels = ['Estrés', 'Ansiedad', 'Normal'];

    if (this.chart) {
      this.chart.destroy();
    }

    this.chart = new Chart(this.chartCanvas.nativeElement, {
      type: 'doughnut',
      data: {
        labels,
        datasets: [{
          data,
          backgroundColor: ['red', 'orange', 'green'],
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
          },
        },
      },
    });
  }


  seleccionarTab(tab: string) {
    this.tabSeleccionado = tab;
    this.router.navigate([`/${tab}`]);
  }

  async verValores(diag: any) {
    const mensaje = `
    ${diag.emg !== null ? 'EMG: ' + diag.atributos.EMG + '<br>' : ''}
    ECG: ${diag.atributos.ECG}<br>
    RESP: ${diag.atributos.RESP}<br>
    TEMP: ${diag.atributos.TEMP}<br>
    EDA: ${diag.atributos.EDA}<br>
  `;

    const alert = await this.alertCtrl.create({
      header: 'Valores Fisiológicos',
      message: mensaje,
      buttons: ['Cerrar'],
    });

    await alert.present();
  }

  cerrarSesion() {
    localStorage.removeItem('medicoActivo');
    this.router.navigate(['/login-medico']);
  }

  verHistorialMedico(cedula: string) {
    console.log('Cédula del paciente:', cedula);
    this.router.navigate(['/historial-paciente'], {
      queryParams: { cedula }
    });
  }

  // nueva info
  actualizarDiagnosticosPaginados() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;

    if (this.diagnosticosFiltrados.length > 0) {
      this.consultasPorCedula = this.diagnosticosFiltrados.slice(start, end);
      this.actualizarGrafico(this.diagnosticosFiltrados);
    } else {
      this.consultasPorCedula = this.diagnosticos.slice(start, end);
      this.actualizarGrafico(this.diagnosticos);
    }
  }

  cambiarPagina(nuevaPagina: number) {
    if (nuevaPagina >= 1 && nuevaPagina <= this.totalPages) {
      this.currentPage = nuevaPagina;
      this.actualizarDiagnosticosPaginados();
      // refresca el gráfico con los datos de la página actual
      this.actualizarGrafico(this.consultasPorCedula);
    }
  }

}
