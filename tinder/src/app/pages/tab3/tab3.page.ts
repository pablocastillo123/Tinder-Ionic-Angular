import { Component } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { UtilToolService } from 'src/app/services/utiltool.service';


@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
  private long ;
  private lat ;
  private watch_long ;
  private watch_lat ;

  constructor(private UtilToolService:UtilToolService,private geolocation:Geolocation) {}

  ngOnInit() {
    this.geolocation.getCurrentPosition().then((resp) => {
      this.long = resp.coords.longitude
      this.lat = resp.coords.latitude 
     }).catch((error) => {
       console.log('Error getting location', error);
       this.UtilToolService.presentAlert('error',error.message,'ok')
     });
     
     let watch = this.geolocation.watchPosition();
     watch.subscribe((data) => {
       try{
        // data can be a set of coordinates, or an error (if an error occurred).
        this.watch_long = data.coords.longitude
        this.watch_lat = data.coords.latitude
       }catch(error){
        this.UtilToolService.presentAlert('error',error.message,'ok') 
        console.log('Error watch getting location', error);

       }
     });
  }

  


}
