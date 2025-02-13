import { regularExp } from "../../../config";

export class UpdateUsersDTO {
    constructor(
        public name: string,
        public surname: string, 
        public email: string, 
        public cellphone: string
        ){}

    static create(object: { [key: string]: any }): [string?, UpdateUsersDTO?]{
        const { name, surname, email, cellphone } = object;

        if(!name) return ['Missing name', undefined];
        if (!surname) ["Missing surname"]
        if(!email) return ['Missing email'];
        if(!regularExp.email.test(email)) return ["Invalid email"]
        if(!cellphone) return ["Missing cellphone"]
         

        return [undefined, new UpdateUsersDTO(name, surname, email, cellphone)];
    };
}