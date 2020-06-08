import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Convenio } from 'src/app/interfaces/convenio';
import { ConvenioService } from 'src/app/services/convenio.service';

@Component({
  selector: 'app-convenios',
  templateUrl: './convenios.page.html',
  styleUrls: ['./convenios.page.scss'],
})
export class ConveniosPage implements OnInit {

  public convenios = new Array<Convenio>();
  private convenioSubscription: Subscription;    

  // convenios = [
  //   { nome: "Unimed", valor: "50,00" },
  //   { nome: "Appas", valor: "50,00" },
  //   { nome: "Intermedica", valor: "50,00" },
  //   { nome: "Mediplan", valor: "50,00" }
  // ];  

  constructor(private convenioService: ConvenioService) { 
    this.convenioSubscription = this.convenioService.getConvenios().subscribe(data => {
      this.convenios = data;
      console.log(data);
    });
  }

  ngOnInit() {

  }

  ngOndestroy(){
    this.convenioSubscription.unsubscribe();
  }  



}
