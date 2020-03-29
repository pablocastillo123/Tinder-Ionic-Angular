export class User {
    email: string;
    password: string;
    name: string;
    last_name: string;
    age: number;
    sexo: string;
    id:string;

    setUserId(id:string){
        this.id = id;
    }

    getUserId(){
        return this.id;
    }

    setEmail(email:string){
        this.email = email
    }

    getEmail(){
        return this.email;
    }
}