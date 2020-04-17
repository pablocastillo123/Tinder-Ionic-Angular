import { Component, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router'

import { ImageFirebaseService } from '../../services/image-firebase.service'


@Component({
  selector: 'app-viewpics',
  templateUrl: './viewpics.page.html',
  styleUrls: ['./viewpics.page.scss'],
})
export class ViewpicsPage implements OnInit {

  user_id = null

  imagen = []

  imagenes_user = []

  constructor(private route : ActivatedRoute, private imagefirebase : ImageFirebaseService ) { }

  ngOnInit() {

    this.user_id = this.route.snapshot.params['id']
    console.log("ESTE ES EL ID", this.user_id)

    this.imagefirebase.getImageCollection().subscribe(image_firebase =>{

      this.imagen = image_firebase
      
      console.log("IMAGENES", this.imagen)

      // for(let i = 0; i < this.imagen.length; i++) {


      //   if(this.imagen[i].file_path === "historia") {
      //     console.log(this.imagen[i])
      //   }

      // }

      const imagenes_historia = this.imagen.filter(elemento => {
        return elemento.file_path === 'historia'
      })

      console.log( "HISTORIA", imagenes_historia)

      this.imagenes_user = imagenes_historia.filter(elemento => {
        return elemento.id_usuario === this.user_id
      })
      
      
      console.log("NUEVAS IMAGENES ", this.imagenes_user)


    })


  }



  

}
