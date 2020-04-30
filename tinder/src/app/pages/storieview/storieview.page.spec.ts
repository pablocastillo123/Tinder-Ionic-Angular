import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { StorieviewPage } from './storieview.page';

describe('StorieviewPage', () => {
  let component: StorieviewPage;
  let fixture: ComponentFixture<StorieviewPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StorieviewPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(StorieviewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
