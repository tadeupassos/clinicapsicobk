import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CadsessaoParticularPage } from './cadsessao-particular.page';

describe('CadsessaoParticularPage', () => {
  let component: CadsessaoParticularPage;
  let fixture: ComponentFixture<CadsessaoParticularPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CadsessaoParticularPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CadsessaoParticularPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
