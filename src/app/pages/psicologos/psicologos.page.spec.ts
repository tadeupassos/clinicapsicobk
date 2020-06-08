import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PsicologosPage } from './psicologos.page';

describe('PsicologosPage', () => {
  let component: PsicologosPage;
  let fixture: ComponentFixture<PsicologosPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PsicologosPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PsicologosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
