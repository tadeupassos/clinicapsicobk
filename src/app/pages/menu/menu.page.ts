import { Component, OnInit } from '@angular/core';
import { Router, RouterEvent } from '@angular/router';
import { ModalController, NavController } from '@ionic/angular';
import { ServicosService } from 'src/app/services/servicos.service';
import { ListaFrequenciaPage } from '../lista-frequencia/lista-frequencia.page';


@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {

  pages = [
    {
      title: 'Agenda Geral',
      url: '/menu/agenda-geral'
    },
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
    },
    {
      title: 'Fechamento',
      url: '/menu/fechamento'
    }
  ];

  selectedPath = '';

  constructor(private router: Router, private modalController: ModalController, public serv: ServicosService) {
    this.router.events.subscribe((event: RouterEvent) => {

      if (typeof event.url === 'undefined' || event.url == '/' || event.url == "/menu/agenda-geral") {
        this.selectedPath = '/menu/agenda-geral';
      } else {
        this.selectedPath = event.url;
      }
    });
  }

  ngOnInit() {
    this.setaPermissao();
  }

  sair() {
    localStorage.clear();
    //window.location.reload();
    this.router.navigate(['login']);
  }

  async abrirTipoFrequencia() {
    this.setaPermissao();
    const modal = await this.modalController.create({
      component: ListaFrequenciaPage,
      backdropDismiss: false
    });

    return await modal.present();
  }

  setaPermissao(){
    this.serv.permissao = localStorage["logado"] == "fernando.lira";
  }

}
