import { Component } from '@angular/core';
import { IonContent, IonIcon} from '@ionic/angular/standalone';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonContent],
})
export class HomePage {

    tabSeleccionado: string = 'diagnostico';

  constructor(private router:Router) {}
  
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
