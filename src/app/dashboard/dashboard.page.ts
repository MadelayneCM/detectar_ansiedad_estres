import { Component, AfterViewInit, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonIcon, IonButtons, IonButton } from '@ionic/angular/standalone';
import { Chart } from 'chart.js/auto';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, IonIcon, IonButtons, IonButton, CommonModule, FormsModule]
})
export class DashboardPage implements AfterViewInit, OnInit {

  tabSeleccionado: string = 'dashboard';


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

  // ESTE SI VALE

  constructor(private router: Router, private apiService: ApiService) { }

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



  // ngAfterViewInit() {
  //   const data = localStorage.getItem('diagnosticos');
  //   const diagnosticos = data ? JSON.parse(data) : [];

  //   const tipos = { estrés: 0, ansiedad: 0, normal: 0 };
  //   const fechas: string[] = [];

  //   // Recolectar info general
  //   diagnosticos.forEach((diag: any) => {
  //     const estado = diag.estado?.toLowerCase();
  //     if (estado in tipos) {
  //       tipos[estado as keyof typeof tipos]++;
  //     }

  //     if (!fechas.includes(diag.fecha)) {
  //       fechas.push(diag.fecha);
  //     }
  //   });

  //   // 🎯 Cargar ambos gráficos
  //   this.createBarChart(tipos);
  //   this.createStackedBarWithLine(diagnosticos, fechas);
  // }

  // 📊 Gráfico 1: Diagnósticos por tipo
  

  ngAfterViewInit() {
  this.apiService.listarConsultas().subscribe({
    next: (diagnosticos: any[]) => {
      const tipos = { estrés: 0, ansiedad: 0, normal: 0 };
      const fechas: string[] = [];

      diagnosticos.forEach((diag: any) => {
        const estado = diag.estado?.toLowerCase();
        if (estado in tipos) {
          tipos[estado as keyof typeof tipos]++;
        }

        // 👀 cuidado: tu endpoint usa "fecha_consulta" no "fecha"
        if (!fechas.includes(diag.fecha_consulta)) {
          fechas.push(diag.fecha_consulta);
        }
      });

      // 🎯 Llamar a los gráficos con los datos del endpoint
      this.createBarChart(tipos);
      this.createStackedBarWithLine(diagnosticos, fechas);
    },
    error: (err) => {
      console.error("Error cargando diagnósticos:", err);
    }
  });
}

  createBarChart(tipos: { [key: string]: number }) {
    const ctx: any = document.getElementById('barChart');

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: Object.keys(tipos),
        datasets: [
          {
            label: 'Cantidad de diagnósticos',
            data: Object.values(tipos),
            backgroundColor: ['#ef4444', '#f59e0b', '#10b981'],
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
          title: {
            display: true,
            text: 'Cantidad de diagnósticos por tipo'
          }
        },
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }

  // 📊 Gráfico 2: Barras apiladas por fecha + línea total
  createStackedBarWithLine(diagnosticos: any[], fechas: string[]) {
    const estados = ['estrés', 'ansiedad', 'normal'];
    const colores = {
      'estrés': '#ef4444',
      'ansiedad': '#f59e0b',
      'normal': '#10b981'
    };

    const dataPorEstado: { [estado: string]: number[] } = {
      'estrés': [],
      'ansiedad': [],
      'normal': []
    };

    const totalesPorFecha: number[] = [];

    fechas.forEach((fecha) => {
      let total = 0;
      estados.forEach((estado) => {
        const cantidad = diagnosticos.filter((d: any) =>
          d.fecha_consulta === fecha &&
          d.estado.toLowerCase() === estado
        ).length;
        dataPorEstado[estado].push(cantidad);
        total += cantidad;
      });
      totalesPorFecha.push(total);
    });

    const datasetsBarra = estados.map((estado) => ({
      type: 'bar' as const,
      label: estado,
      data: dataPorEstado[estado],
      backgroundColor: colores[estado as keyof typeof colores],
      stack: 'diagnosticos'
    }));

    const datasetLinea = {
      type: 'line' as const,
      label: 'Total por fecha',
      data: totalesPorFecha,
      borderColor: '#6366f1',
      borderWidth: 2,
      fill: false,
      tension: 0.3,
      pointRadius: 4,
      pointBackgroundColor: '#6366f1'
    };

    const ctx: any = document.getElementById('comboChart');
    new Chart(ctx, {
      data: {
        labels: fechas,
        datasets: [...datasetsBarra, datasetLinea]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'top' },
          title: {
            display: true,
            text: 'Diagnósticos por Fecha (Barras Apiladas + Línea de Total)'
          }
        },
        scales: {
          x: { stacked: true },
          y: { stacked: true, beginAtZero: true }
        }
      }
    });
  }

  seleccionarTab(tab: string) {
    this.tabSeleccionado = tab;
    this.router.navigate([`/${tab}`]);
  }

  cerrarSesion() {
    localStorage.removeItem('medicoActivo');
    this.router.navigate(['/login-medico']);
  }
}
