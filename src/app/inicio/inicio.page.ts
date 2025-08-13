import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent } from '@ionic/angular/standalone';
import { Router } from '@angular/router';


@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule]
})
export class InicioPage implements OnInit {

  constructor(private router:Router) { }

  ngOnInit() {
     setTimeout(() => {
      this.router.navigateByUrl('/login-medico', { replaceUrl: true });
    }, 4000); // 3 segundos y redirige
  }

}
