import { regularExp } from "../../../config";




export class LoginUserDTO {
    constructor(
        public email: string,  
        public password: string, 
        public code: string
         ){}

        

        static create(object: { [key: string]: any }): [string?, LoginUserDTO?]{
        const { email, password, code } = object;

        if(!email) return ['Missing name' /*undefined*/];
        if(!regularExp.email.test(email)) return ['Invalid email'];
        //if(!regularExp.code.test(code)) return ['Invalid email'];
        if(!password) return ["Missing password"];
        if(!regularExp.password.test(password)) return ['The password must be at least 10 characters, and contain at least one uppercase letter, one lowercase and one especial character']
        
        return [undefined, new LoginUserDTO(email, password, code)];
    }
}