import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CadpacientePage } from './cadpaciente.page';

describe('CadpacientePage', () => {
  let component: CadpacientePage;
  let fixture: ComponentFixture<CadpacientePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CadpacientePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CadpacientePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
