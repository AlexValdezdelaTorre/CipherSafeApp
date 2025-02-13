import { regularExp } from "../../../config";

export class CreateUsersDTO {
    constructor(
        public name: string, 
        public surname: string, 
        public email: string, 
        public cellphone: string, 
        public password: string, ){}

        

        static create(object: { [key: string]: any }): [string?, CreateUsersDTO?]{
        const { name, surname, email, cellphone, password } = object;

        if(!name) return ['Missing name'];
        if(!surname) return ['Missing surname'];
        if(!email) return ['Missing email'];
        if(!regularExp.email.test(email)) return ['Invalid email'];
        if(!cellphone) return ["Missing cellphone"];
        if(!regularExp.password.test(password)) return ['The password must be at least 10 characters, and contain at least one uppercase letter, one lowercase and one especial character']
        if(!password) return ['Missing password']
        return [undefined, new CreateUsersDTO(name, surname, email, cellphone, password)];
    }
}