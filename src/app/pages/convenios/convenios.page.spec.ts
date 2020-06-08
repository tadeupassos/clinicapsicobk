import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ConveniosPage } from './convenios.page';

describe('ConveniosPage', () => {
  let component: ConveniosPage;
  let fixture: ComponentFixture<ConveniosPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConveniosPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ConveniosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
