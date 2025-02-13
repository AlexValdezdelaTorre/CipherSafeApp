
import { regularExp } from "../../../config";

export class CreateCredentialsDTO {
    constructor(
        public account: string, 
        public password: string, 
        public description: string, 
         public code_1: string, 
         public code_2: string, 
         public security_box_id: string, 
         public pin_id: string
          
     ){}

        static create(object: { [key: string]: any }): [string?, CreateCredentialsDTO?]{
        const { account, password, description, code_1, code_2, security_box_id, pin_id } = object;

        if(!account) return ['Missing account'];
        if(!description) return ['Missing description'];
        if(!code_1) return ['Missing code 1'];
        if(!code_2) return ['Missing code 2'];
        if(!security_box_id) return ['Missing box id'];
        if(!pin_id) return ['Missing Pin']
         
        
        return [undefined, new CreateCredentialsDTO(account, password, description, code_1, code_2, security_box_id, pin_id)];
    }
}