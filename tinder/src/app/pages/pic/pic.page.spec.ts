import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PicPage } from './pic.page';

describe('PicPage', () => {
  let component: PicPage;
  let fixture: ComponentFixture<PicPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PicPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PicPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
