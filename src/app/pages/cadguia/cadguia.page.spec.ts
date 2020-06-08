import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CadguiaPage } from './cadguia.page';

describe('CadguiaPage', () => {
  let component: CadguiaPage;
  let fixture: ComponentFixture<CadguiaPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CadguiaPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CadguiaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
