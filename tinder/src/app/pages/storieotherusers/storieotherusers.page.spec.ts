import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { StorieotherusersPage } from './storieotherusers.page';

describe('StorieotherusersPage', () => {
  let component: StorieotherusersPage;
  let fixture: ComponentFixture<StorieotherusersPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StorieotherusersPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(StorieotherusersPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
