import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FiltroDataPage } from './filtro-data.page';

describe('FiltroDataPage', () => {
  let component: FiltroDataPage;
  let fixture: ComponentFixture<FiltroDataPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FiltroDataPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FiltroDataPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
