import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-resultado-diagnostico-modal',
  templateUrl: './resultado-diagnostico-modal.component.html',
  styleUrls: ['./resultado-diagnostico-modal.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule],  // 👈 aquí está la magia

})
export class ResultadoDiagnosticoModalComponent  implements OnInit {

  @Input() nombrePaciente!: string;
  @Input() estado!: string;
  
  constructor(private modalCtrl: ModalController) {}

  ngOnInit() {}

   cerrarModal() {
    this.modalCtrl.dismiss();
  }
  

}
