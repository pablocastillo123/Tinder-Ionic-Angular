import { Component } from "@angular/core";

import { MatchService } from "../../services/match.service";

import { UserfirebseService } from "../../services/userfirebse.service";

import { ImageFirebaseService } from "../../services/image-firebase.service";
import { Router } from "@angular/router";

import { AngularFireDatabase } from "@angular/fire/database";

import { Camera } from "@ionic-native/camera/ngx";

import { UtilToolService } from "../../services/utiltool.service";
import { ModalController } from "@ionic/angular";

import { StorieviewPage } from "../storieview/storieview.page";

import { StorieotherusersPage } from "../storieotherusers/storieotherusers.page";

import { StoriesService } from "../../services/stories.service";

@Component({
  selector: "app-tab3",
  templateUrl: "tab3.page.html",
  styleUrls: ["tab3.page.scss"],
})
export class Tab3Page {
  public matches = [];

  public user_login;

  public final = [];

  public people = [];

  public imagen = [];

  public user_profile = [];

  public objeto = {
    id_Match: "",
    id: "",
    view: true,
    email: "",
    name: "",
    last_name: "",
    imagen: "",
    token_notification: "",
  };

  public gente = [];

  public user_pic;

  public anyone;

  public mensajes_todos;

  public lastMessague = [];

  public img_base64;

  public image;

  public stories_user = [];

  public stories_others = [];

  public final_array = [];

  public user_match_stories = [];

  public currentLength : number = 0;

  constructor(
    private matchService: MatchService,
    private userfirebase: UserfirebseService,
    private imagefirebase: ImageFirebaseService,
    private router: Router,
    private afDB: AngularFireDatabase,
    private camera: Camera,
    private utilTool: UtilToolService,
    private modalCtrl: ModalController,
    private storiesService: StoriesService
  ) {}

  ngOnInit() {
    this.user_login = JSON.parse(window.localStorage.getItem("user"));

    this.imagefirebase.getImageCollection().subscribe((res) => {
      //Esto se realiza para obtener la foto de perfil del usuario logeado
      this.user_pic = res.find((elemento) => {
        return (
          elemento.id_usuario === this.user_login.email &&
          elemento.file_path === "perfil"
        );
      });
    });

    this.matchService.getMatchCollection().subscribe((res) => {
      this.matches = res;
      //Este filter se realiza para obtener los matchs pertenecientes al usuario logeado
      this.final = this.matches.filter((elemento) => {
        return (
          elemento.id_from_user == this.user_login.id ||
          elemento.id_to_user == this.user_login.id
        );
      });
    });
  }

  ionViewWillEnter() {
    setTimeout(() => {
      //Se realiza la implementacion del setTimeout ya que llegaban valores vacios a los metodos
      this.pushPeople();
      this.pushGente();
    }, 2500);
  }

  pushPeople() {
    this.userfirebase.getUserCollection().subscribe((res) => {
      //Doble for que se realiza para ingresar el token y otro tipo de informacion hacia los users con match
      for (let i = 0; i < res.length; i++) {
        for (let j = 0; j < this.final.length; j++) {
          if (
            res[i].id === this.final[j].id_from_user ||
            res[i].id === this.final[j].id_to_user
          ) {
            this.objeto = {
              id_Match: this.final[j].id_match,
              id: res[i].id,
              view: this.final[j].view,
              email: res[i].email,
              name: res[i].name,
              last_name: res[i].last_name,
              imagen: "",
              token_notification: res[i].token_notification,
            };

            this.people.push(this.objeto);
          }
        }
      }
    });
  }

  ionViewDidLeave() {
    //Vaciar los arrelgos cuando abandona la aplicacion
    this.people = [];
    this.gente = [];
    this.user_match_stories = [];
  }

  goToAnother(genId, index) {
    const match = this.matches.find((element) => {
      return element.id_match == genId;
    });

    //Cuando la persona inicia chat por primera vez, ejecuta el booleano para cambiar de posicion en el dom
    if (match.view === false) {
      match.view = true;
      this.matchService.updateMatch(match, match.id_match);
    }

    this.gente[index].view = true;

    this.anyone = this.gente[index];

    this.router.navigateByUrl("/chat/" + genId);
  }

  pushGente() {
    this.imagefirebase.getImageCollection().subscribe((res) => {
      this.imagen = res;

      //Logica que se implementa para traer la foto de perfil de los usuarios
      this.user_profile = this.imagen.filter((elemento) => {
        return (
          elemento.id_usuario != this.user_login.email &&
          elemento.file_path === "perfil"
        );
      });

      for (let i = 0; i < this.people.length; i++) {
        for (let j = 0; j < this.user_profile.length; j++) {
          if (this.people[i].email === this.user_profile[j].id_usuario) {
            this.objeto = {
              id_Match: this.people[i].id_Match,
              id: this.people[i].id,
              view: this.people[i].view,
              email: this.people[i].email,
              name: this.people[i].name,
              last_name: this.people[i].last_name,
              imagen: this.user_profile[j].url,
              token_notification: this.people[i].token_notification,
            };

            this.gente.push(this.objeto);
          }
        }
      }

      this.storiesService.getImageCollection().subscribe((res) => {
        this.stories_others = res.filter((elemento) => {
          return (
            elemento.file_path === "stories" &&
            elemento.id_usuario != this.user_login.email
          );
        });
      });

      this.anyone = this.gente.find((elemento) => {
        return elemento.view == true;
      });
      this.getLastMessague();
      window.localStorage.setItem("matches", JSON.stringify(this.gente));
    });
  }

  getLastMessague() {
    //Se hace la peticion del mensaje y se obtiene el ultimo para mostrarlo en el item
    for (let i = 0; i < this.gente.length; i++) {
      this.afDB
        .list("Mensajes/" + this.gente[i].id_Match + "/")
        .snapshotChanges(["child_added"])
        .subscribe((res) => {
          this.mensajes_todos = [];
          res.forEach((action) => {
            this.mensajes_todos.push({
              text: action.payload.exportVal().text,
              idUser: action.payload.exportVal().idUser,
              date: action.payload.exportVal().date,
            });
          });

          this.lastMessague[i] = this.mensajes_todos[
            this.mensajes_todos.length - 1
          ];
          this.currentLength = this.mensajes_todos.length;

          this.user_match_stories = this.gente.filter(({ email: id1 }) =>
            this.stories_others.some(({ id_usuario: id2 }) => id2 === id1)
          );
        });
    }
  }

  subirHistoria() {
    this.camera
      .getPicture({
        destinationType: this.camera.DestinationType.DATA_URL,
        sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
        mediaType: this.camera.MediaType.PICTURE,
        allowEdit: true,
        encodingType: this.camera.EncodingType.JPEG,
        targetHeight: 1024,
        targetWidth: 1024,
        correctOrientation: true,
        saveToPhotoAlbum: true,
      })
      .then((resultado) => {
        let base64 = "data:image/jpeg;base64," + resultado;
        this.img_base64 = resultado;
        this.image = base64;
        this.storiesService.saveImg(
          this.user_login.email,
          this.img_base64,
          "stories",
          []
        );
        this.ionViewDidLeave();
        this.ionViewWillEnter();
      })
      .catch((err) => {
        console.log(err);
        this.utilTool.presentAlert("error", err, "ok");
      });
  }

  async obtenerMisHistorias() {
    //Modal que se dispara cuando el usuario ve su propia historia
    let modal = await this.modalCtrl.create({
      component: StorieviewPage,
      componentProps: {
        user_login: this.user_login,
      },
    });

    return await modal.present();
  }

  async verHistoria(usuario) {
    //Modal que se dispara cuando el usuario ve la historia
    let modal = await this.modalCtrl.create({
      component: StorieotherusersPage,
      componentProps: {
        user: usuario,
      },
    });

    return await modal.present();
  }
}
