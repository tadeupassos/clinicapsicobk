import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SessoesPage } from './sessoes.page';

describe('SessoesPage', () => {
  let component: SessoesPage;
  let fixture: ComponentFixture<SessoesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SessoesPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SessoesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
