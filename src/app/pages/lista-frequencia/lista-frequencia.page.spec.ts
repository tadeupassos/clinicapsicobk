import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ListaFrequenciaPage } from './lista-frequencia.page';

describe('ListaFrequenciaPage', () => {
  let component: ListaFrequenciaPage;
  let fixture: ComponentFixture<ListaFrequenciaPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListaFrequenciaPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ListaFrequenciaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
