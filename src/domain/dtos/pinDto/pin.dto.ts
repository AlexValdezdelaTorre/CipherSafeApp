
import { regularExp } from "../../../config";


export class PinDTO {
    constructor(
        public code: string, 
        public userId: string, 
        
    ){}

    
    static create(object: { [key: string]: any }): [string?, PinDTO?]{
        const { code, userId} = object;

        if(!code) return ['Missing code'];
        if(!userId) return ['Missing userId'];
        if(!userId || typeof userId !== 'string' || !regularExp.uuid.test(userId)){
            return ['Invalid BoxId format, must be a UUID']
        }
        
        return [undefined, new PinDTO(code, userId)];
    };
}