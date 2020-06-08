import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { GuiasPage } from './guias.page';

describe('GuiasPage', () => {
  let component: GuiasPage;
  let fixture: ComponentFixture<GuiasPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GuiasPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(GuiasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
