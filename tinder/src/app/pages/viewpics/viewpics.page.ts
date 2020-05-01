import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router'
import { ImageFirebaseService } from '../../services/image-firebase.service'

@Component({
  selector: 'app-viewpics',
  templateUrl: './viewpics.page.html',
  styleUrls: ['./viewpics.page.scss'],
})
export class ViewpicsPage implements OnInit {

  private user_id = null
  private imagen = []
  private imagenes_user = []

  constructor(private route : ActivatedRoute, private imagefirebase : ImageFirebaseService ) { }

  ngOnInit() {

    this.user_id = this.route.snapshot.params['id']
    console.log("ESTE ES EL ID", this.user_id)

    this.imagefirebase.getImageCollection().subscribe(image_firebase =>{

      this.imagen = image_firebase
      
      const imagenes_historia = this.imagen.filter(elemento => {
        return elemento.file_path === 'historia'
      })

      this.imagenes_user = imagenes_historia.filter(elemento => {
        return elemento.id_usuario === this.user_id
      })
    })
  }
}
