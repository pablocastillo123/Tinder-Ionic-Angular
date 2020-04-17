import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ViewpicsPage } from './viewpics.page';

describe('ViewpicsPage', () => {
  let component: ViewpicsPage;
  let fixture: ComponentFixture<ViewpicsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewpicsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ViewpicsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
