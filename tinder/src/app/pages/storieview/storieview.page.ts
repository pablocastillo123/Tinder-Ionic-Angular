import { Component, OnInit, ViewChild } from "@angular/core";
import { NavParams, ModalController } from "@ionic/angular";

import { ImageFirebaseService } from "../../services/image-firebase.service";

import { IonSlides } from "@ionic/angular";
import { Router } from "@angular/router";

import { StoriesService } from "../../services/stories.service";

@Component({
  selector: "app-storieview",
  templateUrl: "./storieview.page.html",
  styleUrls: ["./storieview.page.scss"],
})
export class StorieviewPage implements OnInit {
  @ViewChild(IonSlides, { static: false }) slides: IonSlides;

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

  public stories_user = [];

  public user_login;

  public profile_pic;

  public currentIndex : number = 0;

  public previousIndex = [];


  constructor(
    private navParams: NavParams,
    private imagefirebase: ImageFirebaseService,
    private route: Router,
    private modalCtrl: ModalController,
    private storieService: StoriesService
  ) {}

  ngOnInit() {
    //Se obtiene la informacion del usuario que se pasa mediante parametros
    this.user_login = this.navParams.get("user_login");

    this.imagefirebase.getImageCollection().subscribe((res) => {
      this.profile_pic = res.find((elemento) => {
        return (
          elemento.file_path === "perfil" &&
          elemento.id_usuario === this.user_login.email
        );
      });
    });

    this.storieService.getImageCollection().subscribe((res) => {
      this.stories_user = res.filter((elemento) => {
        return (
          elemento.file_path === "stories" &&
          elemento.id_usuario === this.user_login.email
        );
      });
    });
  }

  //Ciclo de vida que se dispara cuando el slider se cambia
  ionSlideWillChange() {
    this.slides.getActiveIndex().then((index) => {
      this.currentIndex = index;
    });
  }

  //Metodo creado para comprobar si se es el ultimo y cancelar el modal
  nextStoryItem() {
    this.slides.slideNext();

    if (this.currentIndex === this.stories_user.length - 1) {
      this.modalCtrl.dismiss();
    }
  }

  goBack() {
    this.modalCtrl.dismiss();
  }
}
