import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FechamentoPage } from './fechamento.page';

describe('FechamentoPage', () => {
  let component: FechamentoPage;
  let fixture: ComponentFixture<FechamentoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FechamentoPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FechamentoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
