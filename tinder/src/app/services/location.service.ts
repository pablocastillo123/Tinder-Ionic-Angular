import { UtilToolService } from './utiltool.service';
import { Injectable } from '@angular/core';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  private coord = {
    longitude: 0,
    latitude: 0
  }

  constructor(private androidPermissions: AndroidPermissions,
    private geolocation: Geolocation,private UtilToolService:UtilToolService,
    private locationAccuracy: LocationAccuracy) { }

    checkGPSPermission() {
      this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION).then(
        result => {
          if (result.hasPermission) {
   
            //If having permission show 'Turn On GPS' dialogue
            this.askToTurnOnGPS();
          } else {
   
            //If not having permission ask for permission
            this.requestGPSPermission();
          }
        },
        err => {
          alert(err);
        }
      );
    }
   
    private requestGPSPermission() {
      this.locationAccuracy.canRequest().then((canRequest: boolean) => {
        if (canRequest) {
          console.log("4");
        } else {
          //Show 'GPS Permission Request' dialogue
          this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION)
            .then(
              () => {
                // call method to turn on GPS
                this.askToTurnOnGPS();
              },
              error => {
                //Show alert if user click on 'No Thanks'
                alert('requestPermission Error requesting location permissions ' + error)
              }
            );
        }
      });
    }
   
    private askToTurnOnGPS() {
      this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
        () => {
          // When GPS Turned ON call method to get Accurate location coordinates
          this.getLocationCoordinates()
        },
        error => {this.UtilToolService.presentAlert('Alerta','El usuario debe activar la ubicacion del dispositivo','ok')
        console.log('Error requesting location permissions ' + JSON.stringify(error))
      }
      );
    }

    getLocationCoordinates(){
      this.geolocation.getCurrentPosition().then((data) => {
        this.coord.longitude = data.coords.longitude
        this.coord.latitude = data.coords.latitude
        console.log('long:'+this.coord.longitude+"\nlat:"+this.coord.latitude)
       }).catch((error) => {
        console.log('Error watch getting location', error);
       });
    }

    getCoord(){
      return this.coord
    }
}
