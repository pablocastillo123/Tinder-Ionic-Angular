import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ImgFirebasePage } from './img-firebase.page';

describe('ImgFirebasePage', () => {
  let component: ImgFirebasePage;
  let fixture: ComponentFixture<ImgFirebasePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImgFirebasePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ImgFirebasePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
