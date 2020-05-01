import { Component, OnInit, ViewChild } from "@angular/core";
import { NavParams, ModalController, IonSlides } from "@ionic/angular";

import { ImageFirebaseService } from "../../services/image-firebase.service";

import { StoriesService } from "../../services/stories.service";

@Component({
  selector: "app-storieotherusers",
  templateUrl: "./storieotherusers.page.html",
  styleUrls: ["./storieotherusers.page.scss"],
})
export class StorieotherusersPage implements OnInit {
  @ViewChild(IonSlides, { static: false }) slides: IonSlides;

  //Logica que se usa cuando el progress pertenciente al css llega al 100%
  @ViewChild("divv", { static: false }) set progressElement(divv: any) {
    if (divv) {
      divv = divv.nativeElement;

      divv.addEventListener("animationend", () => {
        this.nextStoryItem();
      });

      divv.addEventListener("webkitAnimationWend", () => {
        this.nextStoryItem();
      });
    }
  }

  private user;

  private stories_user = [];

  public currentIndex : number = 0;

  constructor(
    private navParams: NavParams,
    private imagefirebase: ImageFirebaseService,
    private modalCtrl: ModalController,
    private storieService: StoriesService
  ) {}

  ngOnInit() {
    //Se obtiene la informacion del usuario que se pasa mediante parametros
    this.user = this.navParams.get("user");

    this.storieService.getImageCollection().subscribe((res) => {
      this.stories_user = res.filter((elemento) => {
        return (
          elemento.file_path === "stories" &&
          elemento.id_usuario === this.user.email
        );
      });
    });
  }

  goBack() {
    this.modalCtrl.dismiss();
  }

  //Ciclo de vida que se dispara cuando el slider se cambia
  ionSlideWillChange() {
    this.slides.getActiveIndex().then((index) => {
      this.currentIndex = index;
    });

    console.log("EVENTO", event);
  }

  //Metodo creado para comprobar si se es el ultimo y cancelar el modal
  nextStoryItem() {
    this.slides.slideNext();

    if (this.currentIndex === this.stories_user.length - 1) {
      this.modalCtrl.dismiss();
    }
  }
}
