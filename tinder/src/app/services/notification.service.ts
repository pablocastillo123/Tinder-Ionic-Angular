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
    'Authorization':'key=AAAAAEjI6l0:APA91bEd8-rugEm0CCNnnp95ZRsgSqFtQD4N2zbabU_4_lzxXx3jbKXnvQJ7kaAKsv7prlLQbns7t8a1uy6ENQuoLR43rb_Vr8xf-SOiFRBEytFDDqJrEgCITrn-gEo8ABKw_ZYghURd'
  })

  data;


  constructor(private fcm: FCM,private platform: Platform,private localNotifications: LocalNotifications,private http: HttpClient) { 
    

  }

  ngOnInit () {

    this.fcm.onNotification().subscribe(data => {
      this.data = data.wasTapped
    })

  }

  sendNotification(title, text, to_user, from_user){
    
    let body_to_user = {
      "notification":{
        "title":title,
        "body":text,
        "sound":"default"
      },
      "to": "/topics/" + to_user
    }

    let body_from_user = {
      "notification":{
        "title":title,
        "body":text,
        "sound":"default"
      },
      "to": "/topics/" + from_user
    }

    
      this.http.post(this.url, body_to_user, {headers: this.headers}).subscribe(res =>{
      })
      this.http.post(this.url, body_from_user,  {headers: this.headers}).subscribe(res =>{    
      })
    
      this.localNotifications.schedule({
        title: 'Tinder',
        text: 'Tienes un nuevo Match',
        sound: this.platform.is("android") ? 'file://sound.mp3': 'file://beep.caf',

      });
    }

  }

  

