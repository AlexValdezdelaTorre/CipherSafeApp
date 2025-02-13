import { regularExp } from "../../../config";

export class CreateSecurityBoxDTO {
    constructor(
        public name: string, 
        public favorite: boolean, 
        public icon: string, 
        public user_id: string, 
    ){}

        

    static create(object: { [key: string]: any }): [string?, CreateSecurityBoxDTO?]{
        const { name, favorite, icon, user_id } = object;

        if(!name) return ['Missing name'];
        //if(!userId) return ['Missing userId'];
        if(!icon) return ['Missing icon'];
        if(!user_id) return ['Missing Id', undefined];
        if(!user_id|| typeof user_id !== 'string' || !regularExp.uuid.test(user_id)){
            return ['Invalid userId format, must be a UUID']
        }
        
        return [undefined, new CreateSecurityBoxDTO(name, favorite, icon, user_id)];
    }
}