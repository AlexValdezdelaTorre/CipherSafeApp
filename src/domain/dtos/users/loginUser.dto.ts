import { regularExp } from "../../../config";




export class LoginUserDTO {
    constructor(
        public email: string,  
        public password: string, 
        public code: string
         ){}

        

        static create(object: { [key: string]: any }): [string?, LoginUserDTO?]{
        const { email, password, code } = object;

        if(!email) return ['Missing email'];
        if(!regularExp.email.test(email)) return ["Invalid email"];
        if(!password) return ["Missing password"];
        if(!regularExp.password.test(password)) return ["Password must be at least 10 characters"]
        
        return [undefined, new LoginUserDTO(email, password, code)];
    }
} 