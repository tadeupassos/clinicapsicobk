import { Component, OnInit } from '@angular/core';
import { Psicologo } from 'src/app/interfaces/psicologo';
import { PsicologoService } from 'src/app/services/psicologo.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-psicologos',
  templateUrl: './psicologos.page.html',
  styleUrls: ['./psicologos.page.scss'],
})
export class PsicologosPage implements OnInit {

  public psicologos = new Array<Psicologo>();
  private psicologoSubscription: Subscription;   

  constructor(private psicologoService: PsicologoService) { 
    this.psicologoSubscription = this.psicologoService.getPsicologos().subscribe(data => {
      this.psicologos = data;
      this.psicologos.sort((a,b) => { return a.nome < b.nome ? -1 : 1 });
      console.log(data);
    });
  }

  ngOnInit() {

  }

  ngOndestroy(){
    this.psicologoSubscription.unsubscribe();
  }    

}
