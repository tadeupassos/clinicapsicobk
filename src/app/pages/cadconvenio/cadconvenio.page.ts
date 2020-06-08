import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Convenio } from 'src/app/interfaces/convenio';
import { ActivatedRoute } from '@angular/router';
import { ConvenioService } from 'src/app/services/convenio.service';
import { ServicosService } from 'src/app/services/servicos.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-cadconvenio',
  templateUrl: './cadconvenio.page.html',
  styleUrls: ['./cadconvenio.page.scss'],
})
export class CadconvenioPage implements OnInit {

  public fGroup: FormGroup;

  private convenio: Convenio = {};
  private convenioId: string = null;
  private convenioSubscription: Subscription;    

  constructor(
    private fBuilder: FormBuilder,
    private activeRoute: ActivatedRoute,
    private convenioService: ConvenioService,
    private servicos: ServicosService,
    private navCtrl: NavController
  ) { 
    this.convenioId = this.activeRoute.snapshot.params['id'];

    if(this.convenioId) this.loadConvenio();

    this.fGroup = this.fBuilder.group({
      'convenio': [this.convenio.convenio, Validators.compose([Validators.required,])],
      'valor': [this.convenio.valor, Validators.compose([Validators.required,])]
    });    

  }

  ngOnInit() {
  }

  ngOndestroy() {
    if(this.convenioSubscription) this.convenioSubscription.unsubscribe();
  }

  loadConvenio(){
    this.convenioSubscription = this.convenioService.getConvenio(this.convenioId).subscribe(data => {
      this.convenio = data;

      this.fGroup = this.fBuilder.group({
        'convenio': [this.convenio.convenio, Validators.compose([Validators.required,])],
        'valor': [this.convenio.valor, Validators.compose([Validators.required,])]
      });       

    });
  } 
  
  async salvarDados() {

    await this.servicos.presentLoading();
    this.convenio = this.fGroup.value;
    this.convenio.userId = "100";    

    if(this.convenioId){
      try {
        await this.convenioService.updateConvenio(this.convenioId, this.convenio);
        await this.servicos.loading.dismiss();

        this.navCtrl.navigateBack('/menu/convenios');
      } catch (error) {
        this.servicos.presentToast('Erro ao tentar salvar');
        this.servicos.loading.dismiss();
      }
    }else{
      try {
        await this.convenioService.addConvenio(this.convenio);
        await this.servicos.loading.dismiss();

        this.navCtrl.navigateBack('/menu/convenios');
      } catch (error) {
        this.servicos.presentToast('Erro ao tentar salvar');
        this.servicos.loading.dismiss();
      }
    }
  }
  
  formatarValor(event) {

    let digito = event.key;
    let valor: string = this.fGroup.value.valor;

    if(valor.trim().length > 7){
      return false;
    }else if(digito == ","){
      
    }else if(isNaN(parseInt(digito)) || digito == "." || digito == " " || digito == "/"){
      return false;
    }

    this.fGroup.get('valor').setValue(valor);

  }  

}
