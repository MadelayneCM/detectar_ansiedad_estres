import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonGrid, IonRow, IonCol
  , IonItem, IonLabel, IonInput, IonIcon, IonButtons, IonButton
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { ViewChild, ElementRef } from '@angular/core';
import { Chart, registerables } from 'chart.js';

import { AlertController } from '@ionic/angular';


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


  diagnosticos: any[] = [];
 nombrePaciente: string = '';
diagnosticosFiltrados: any[] = [];


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

  constructor(private router: Router, private alertCtrl: AlertController) {}


  ngOnInit() {
  // 🔹 1. Cargar diagnósticos
  const guardados = localStorage.getItem('diagnosticos');
  this.diagnosticos = guardados ? JSON.parse(guardados) : [];
  this.diagnosticosFiltrados = this.diagnosticos;

  // 🔹 2. Cargar médicos
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
    this.totalPages = Math.ceil(this.diagnosticos.length / this.itemsPerPage);
    this.actualizarDiagnosticosPaginados();

  }

  // 🔹 3. Verificar si hay médico logueado
  const sesion = localStorage.getItem('medicoActivo');
  if (sesion) {
    this.medicoActivo = JSON.parse(sesion);
  }
}


  getColor(estado: string): string {
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

  // ESTE SI ME VALE 18:21 2/07/2025
  // buscarPorNombre() {
  // const nombre = this.nombrePaciente.trim().toLowerCase();
  // this.diagnosticosFiltrados = this.diagnosticos.filter(d =>
  //   d.nombre.toLowerCase().includes(nombre)
  // );
  // this.actualizarGrafico(); // <-- MUY IMPORTANTE
  // }
  buscarPorNombre() {
  const nombre = this.nombrePaciente.trim().toLowerCase();
  const filtrados = this.diagnosticos.filter(d =>
    d.nombre.toLowerCase().includes(nombre)
  );
  this.totalPages = Math.ceil(filtrados.length / this.itemsPerPage);
  this.currentPage = 1;
  this.diagnosticosFiltrados = filtrados.slice(0, this.itemsPerPage);
  this.actualizarGrafico();
}


  ionViewDidEnter() {
    setTimeout(() => this.actualizarGrafico(), 100); // Asegura que el canvas esté cargado
  }

  actualizarGrafico() {
  if (!this.chartCanvas) return;

  const conteo = {
    estrés: 0,
    ansiedad: 0,
    normal: 0,
  };

  for (let diag of this.diagnosticosFiltrados) {
    const estado = diag.estado.toLowerCase();
    if (estado in conteo) {
      conteo[estado as keyof typeof conteo]++;
    }
  }

  const total = this.diagnosticosFiltrados.length || 1;
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
      maintainAspectRatio: false, // Permite ajustar el tamaño con CSS
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
    ${diag.emg !== null ? 'EMG: ' + diag.emg + '<br>' : ''}
    ECG: ${diag.ecg}<br>
    RESP: ${diag.resp}<br>
    TEMP: ${diag.temp}<br>
    EDA: ${diag.eda}
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


  verHistorialMedico(nombre: string) {
  this.router.navigate(['/historial-paciente'], {
    queryParams: { nombre }
  });
}

// nueva info
actualizarDiagnosticosPaginados() {
  const start = (this.currentPage - 1) * this.itemsPerPage;
  const end = start + this.itemsPerPage;
  this.diagnosticosFiltrados = this.diagnosticos.slice(start, end);
  this.actualizarGrafico();
}

cambiarPagina(nuevaPagina: number) {
  if (nuevaPagina >= 1 && nuevaPagina <= this.totalPages) {
    this.currentPage = nuevaPagina;
    this.actualizarDiagnosticosPaginados();
  }
}


}
