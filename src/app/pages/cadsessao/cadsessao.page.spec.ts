import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CadsessaoPage } from './cadsessao.page';

describe('CadsessaoPage', () => {
  let component: CadsessaoPage;
  let fixture: ComponentFixture<CadsessaoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CadsessaoPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CadsessaoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
