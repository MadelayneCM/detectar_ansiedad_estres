import { Component, OnInit } from '@angular/core';
import { IonContent, IonIcon } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Doctor } from '../interfaces/interfaceDoctor';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonContent, CommonModule],
})
export class HomePage implements OnInit {

  tabSeleccionado: string = 'diagnostico';
  medicoActivo: Doctor | null = null;

  constructor(private router: Router) { }

  ngOnInit() {
    // Recuperar el médico activo del localStorage al cargar la página
    const stored = localStorage.getItem('medicoActivo');
    if (stored) {
      this.medicoActivo = JSON.parse(stored);
    }
  }

  irAHistorial() {
    this.router.navigate(['historial-diagnostico']);
  }

  irADiagnostico() {
    this.router.navigate(['formulario-diagnostico']);
  }

  irADash() {
    this.router.navigate(['dashboard']);
  }

  irAMed() {
    this.router.navigate(['historial-medicos']);
  }

  // seleccionarTab(tab: string) {
  //   this.tabSeleccionado = tab;
  //   this.router.navigate([`/${tab}`]);
  // }
}
