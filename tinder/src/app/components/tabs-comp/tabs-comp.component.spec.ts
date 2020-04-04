import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TabsCompComponent } from './tabs-comp.component';

describe('TabsCompComponent', () => {
  let component: TabsCompComponent;
  let fixture: ComponentFixture<TabsCompComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TabsCompComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TabsCompComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
