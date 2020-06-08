import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CadconvenioPage } from './cadconvenio.page';

describe('CadconvenioPage', () => {
  let component: CadconvenioPage;
  let fixture: ComponentFixture<CadconvenioPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CadconvenioPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CadconvenioPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
