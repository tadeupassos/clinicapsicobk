import { Component, OnInit } from '@angular/core';
import { Router, RouterEvent } from '@angular/router';
import { NavController } from '@ionic/angular';


@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {

  pages = [
    {
      title: 'Pacientes',
      url: '/menu/pacientes'
    },
    {
      title: 'Convênios',
      url: '/menu/convenios'
    },
    // {
    //   title: 'Guias',
    //   url: '/menu/guias'
    // },
    {
      title: 'Psicólogos',
      url: '/menu/psicologos'
    }
  ];

  selectedPath = '';

  constructor(private router: Router, private navCtrl: NavController) {
    this.router.events.subscribe((event: RouterEvent) => {

      //console.log("page: ", event.url);

      if(typeof event.url === 'undefined' || event.url == '/' || event.url == "/menu/cadpaciente"){
        this.selectedPath = '/menu/pacientes';
      }else{
        this.selectedPath = event.url;
      }

    });
  }

  ngOnInit() {
  }

  sair(){
    localStorage.clear();
    //window.location.reload();
    this.router.navigate(['login']);
  }

}
