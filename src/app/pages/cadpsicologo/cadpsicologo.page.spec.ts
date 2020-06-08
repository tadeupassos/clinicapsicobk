import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CadpsicologoPage } from './cadpsicologo.page';

describe('CadpsicologoPage', () => {
  let component: CadpsicologoPage;
  let fixture: ComponentFixture<CadpsicologoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CadpsicologoPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CadpsicologoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
