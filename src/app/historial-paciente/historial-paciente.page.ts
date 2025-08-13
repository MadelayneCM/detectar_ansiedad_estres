import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonItem,IonLabel,IonText,IonList, IonButton, IonIcon, IonCardContent
  , IonCardTitle, IonCardHeader, IonCard
 } from '@ionic/angular/standalone';
import { ActivatedRoute, Router } from '@angular/router';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';



@Component({
  selector: 'app-historial-paciente',
  templateUrl: './historial-paciente.page.html',
  styleUrls: ['./historial-paciente.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, IonItem,IonLabel,IonText, IonIcon, IonCardContent, IonCardTitle, IonCardHeader
    ,IonList,IonButton, IonCard, CommonModule, FormsModule]
})
export class HistorialPacientePage implements OnInit {

    nombrePaciente: string = '';
  diagnosticosPaciente: any[] = [];

  diagnosticosFiltrados: any[] = [];

  currentPage: number = 1;
  itemsPerPage: number = 5;

  Math = Math;

  conteo = {
  estres: 0,
  ansiedad: 0,
  normal: 0
};


  

  constructor(private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {

     this.route.queryParams.subscribe(params => {
      this.nombrePaciente = params['nombre'] || '';

      const todos = JSON.parse(localStorage.getItem('diagnosticos') || '[]');

      this.diagnosticosPaciente = todos.filter((d: any) =>
        d.nombre.toLowerCase() === this.nombrePaciente.toLowerCase()
      );

      this.paginar();

  this.conteo = {
   estres: this.diagnosticosPaciente.filter(d => d.estado.toLowerCase() === 'estrés').length,
   ansiedad: this.diagnosticosPaciente.filter(d => d.estado.toLowerCase() === 'ansiedad').length,
   normal: this.diagnosticosPaciente.filter(d => d.estado.toLowerCase() === 'normal').length
  };
    });
  
  }

   paginar() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.diagnosticosFiltrados = this.diagnosticosPaciente.slice(start, end);
  }

  cambiarPagina(direccion: 'anterior' | 'siguiente') {
    const totalPaginas = Math.ceil(this.diagnosticosPaciente.length / this.itemsPerPage);
    if (direccion === 'anterior' && this.currentPage > 1) {
      this.currentPage--;
      this.paginar();
    } else if (direccion === 'siguiente' && this.currentPage < totalPaginas) {
      this.currentPage++;
      this.paginar();
    }
  }

  exportarPDF() {
    const doc = new jsPDF();

    doc.text(`Historial del paciente: ${this.nombrePaciente}`, 10, 10);

    autoTable(doc, {
      head: [['Fecha', 'Tipo', 'Estado', 'Edad', 'Médico', 'Tratamiento']],
      body: this.diagnosticosPaciente.map((d: any) => [
        d.fecha,
        d.tipo,
        d.estado,
        d.edad,
        d.medico,
        d.tratamiento || 'N/A'
      ]),
    });

    doc.save(`Historial_${this.nombrePaciente}.pdf`);
  }

  volverAHistorial() {
  this.router.navigate(['/historial-diagnostico']); // 👈 Cambia la ruta según corresponda
}

calcularEdad(fechaISO: string): number {
  if (!fechaISO) return 0;
  const fechaNacimiento = new Date(fechaISO);
  const hoy = new Date();
  let edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
  const mes = hoy.getMonth() - fechaNacimiento.getMonth();

  if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNacimiento.getDate())) {
    edad--;
  }
  return edad;
}


}
