import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Platform } from '@ionic/angular';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { FCM } from '@ionic-native/fcm/ngx';


@Injectable({
  providedIn: 'root'
})
export class NotificationService implements OnInit  {
  private luis = "f-R48AU5QjA:APA91bG-kS4q6h-LjycIhGMgcNUr0GjQjk5oxKWE3lSDB3lAhbW0itlPphitWTwQDjJGLvx-DL7jIdYTbRgC6jcg1XEnRwBvqEJ6S2arbuofy79Op6NbkWCsODvDJ_PJxh8hCN5uyWA2"
  private pablo = "fcd1_52frkg:APA91bGWPNkZ5ZHnVWesiUTl7KPRs8IaE2smdfonTjSHVJZF6525IVYBftJ3hEmu6iMDH16HicsEdL8311wQ30s9mZu4mkw51PEGrjQYHGTIs5VimxWYx9xrf8A1z-46xA8vtstQkc5n"

  private url = "https://fcm.googleapis.com/fcm/send";

  private headers = new HttpHeaders({
    'Content-Type':'application/json',
    'Authorization':'key=AAAAbX3ephE:APA91bEXNAd8DjERzfrEYzOZQdd9Op8Sscu4x-7zxwClBobgTlDZpeD-FlzCzSEz5ctf_g8jeEb3uEvRAv1nIhLofDL0BpPJXBMnmoTtUJn-9o-Rxcl4_A4fc7XVu8_2v4Y2_FxcdeEU'
  })

  data;


  constructor(private fcm: FCM,private platform: Platform,private localNotifications: LocalNotifications,private http: HttpClient) { 
    

  }

  ngOnInit () {

    this.fcm.onNotification().subscribe(data => {
      this.data = data.wasTapped
      console.log("LA DATA", data)
      console.log( "ESta es la data",  this.data)
    })

  }

  sendNotification(title, text, to_user){
    let body = {
      "notification":{
        "title":title,
        "body":text,
        "sound":"default"
      },
      "to": "/topics/" + to_user
    }

    if(this.data) {
      this.http.post(this.url,body,{headers: this.headers}).subscribe(res =>{
        console.log( "Estas afuera",  res)
      })
    } else {
      //Aqui ira localnotification
      console.log("Estas en la app")
      
      this.localNotifications.schedule({
        title: 'tinder',
        text: 'notificacion local tinder',
        sound: this.platform.is("android") ? 'file://sound.mp3': 'file://beep.caf',

      });
    }

  }

  notifiAngularPablo(){
    this.sendNotification('tinder','angular-http-post y fcm XD',this.pablo)
    console.log('angular pablo http post')

    this.fcm.onNotification().subscribe(data => {
      this.data = data
      if(data.wasTapped){
        console.log("Received in background");
      } else {
        console.log("Received in foreground pablo");

        this.localNotifications.schedule({
          title: 'tinder',
          text: 'notificacion local tinder a pablo con angular',
          sound: this.platform.is("android") ? 'file://sound.mp3': 'file://beep.caf',

        });
      };
    });
  }

  notifiAngularLuis(){
    this.sendNotification('tinder','angular-http-post y fcm XD',this.luis)
    console.log('angular luis http post')

    this.fcm.onNotification().subscribe(data => {
      if(data.wasTapped){
        console.log("Received in background");
      } else {
        console.log("Received in foreground luis");

        this.localNotifications.schedule({
          title: 'tinder',
          text: 'notificacion local tinder a luis con angular',
          sound: this.platform.is("android") ? 'file://sound.mp3': 'file://beep.caf',

        });
      };
    });

  }

}
