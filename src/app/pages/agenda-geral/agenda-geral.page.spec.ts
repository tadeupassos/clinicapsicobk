import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AgendaGeralPage } from './agenda-geral.page';

describe('AgendaGeralPage', () => {
  let component: AgendaGeralPage;
  let fixture: ComponentFixture<AgendaGeralPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgendaGeralPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AgendaGeralPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
