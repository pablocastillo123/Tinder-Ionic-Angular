# Tinder-Ionic-Angular

En los cards correspondientes realizamos cierta cantidad de filtraciones a los arreglos, para que solo me retornara todos los usuarios que no pertenecian al usuario logeado, y que solo retornara los usuarios de diferente sexo. Una vez los datos estaban filtrados de manera correcta, el usuario podria deslizar hacia la derecha o izquierda. El metodo swipe es el que realizara todas las acciones relacionadas con el deslizamiento del dedo en el card. Cuando se ejecuta dicho metodo recibe dos parametros, el index actual y el evento, el cual es true o false. Dicho evento es true cuando se le da like al user (desliza hacia la derecha), cuando es true pasa por un if en el cual me realizara la accion hacia el backend, guardando el swipe, y guardando el like, dicho like posee 3 registros, el id del like, el id_from_user y el id_to_user, entendiendose por id_from_user al usuario logeado y al id_to_user al usuario que recibe el like. Una vez es guardado, el mismo metodo realiza una consulta hacia la base de datos para listar en un arreglo los nuevos likes. Posterior a esto se realizan dos filters. El primer filter es para que me retorne en un arreglo los likes pertenecientes al usuario logeado, el segundo filter es para que nos filtre todos los usuarios que pertenecen a los likes con el registro id_to_user del usuario al cual se le acaba de dar like, esto hara que nos traiga basicamente el like actual perteneciente a la coleccion likes. Luego, al tener el arreglo se realiza un for de todos los arreglos en la base de datos, esto con la finalidad de recorrer uno por uno cada uno de los objetos que se encuentra en la misma. Posterior a esto, dentro del for se coloca un if en el cual va a guardar en la coleccion match y ejecutara la notificacion siempre y cuando el id_from_user del usuario actual sea igual al id_to_user del los likes recorridos, y se coloca tambien dentro del if el id_to_user que sean iguales a los id_from_user de los likes recorridos. Ejemplo:


                                        Like actual :                                          

                                    [{                                                              
                                        id_like : 123456,                                                   
                                        id_from_user: 'abc123',
                                        id_to_user : '567fgh'
                                    }]

                                        

                                    Likes que se recorren :

                                    [{
                                        id_like : 786798,
                                        id_from_user : '567fgh,
                                        id_to_user : 'abc123'
                                    },
                                    {
                                        id_like : 456098,
                                        id_from_user : 'ujeu7,
                                        id_to_user : 'ldlk9'
                                    },
                                    {
                                        id_like : 786798,
                                        id_from_user : 'lfofp0,
                                        id_to_user : 'bcnjl'
                                    }]


Como se ve en el ejemplo anterior solo habria match entre el usuario actual y el usuario en el index 0 de los likes obtenidos por medio de la consulta en la base de datos, ya que el id_from_user del usuario actual coincide con el id_to_user de los likes obtenidos, y el id_to_user del usuario actual coincide con uno de los usuarios que posee el mismo valor en el id_from_user.