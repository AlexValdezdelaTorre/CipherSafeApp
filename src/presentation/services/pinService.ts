import { encriptAdapter } from "../../config";
import { Pin } from "../../data";
import { CustomError, PinDTO } from "../../domain";
import { UsersService } from "./userService";


export class PinService {
  constructor(public readonly usersService: UsersService ) {}

  async createPin(pinData: PinDTO) { 
    const pin = new Pin();

    const user = await this.usersService.findIdUser(pinData.userId);
      
    pin.code = pinData.code;
    pin.users = user
            
    try {
      return await pin.save();
        }catch (error: any) {
        throw new Error(`Error creating pin: ${error.message}`);
             
    };
  };

  async validatePin(code: string) {
    const allPins = await Pin.createQueryBuilder("pin")
        .leftJoinAndSelect("pin.users", "user") 
        .leftJoinAndSelect("pin.credentials", "credentials")
        .getMany();

    const findPin = allPins.find(pin => encriptAdapter.compare(code, pin.code));

    if (!findPin) throw CustomError.notFound(`User with code: ${code} not found`);

    return findPin;
  };

  async findPinById(id: string){
    const result = await Pin.createQueryBuilder("pin")
    .leftJoinAndSelect("pin.users", "user" )
           
    .where("pin.id = :id", { id: id})
    .getOne();
  
    if(!result) {
     throw CustomError.notFound("User not found");
    }
    
    return result;
              
  };

}


/*async validatePin(code: string) {
        
      const allPins = await Pin.find();

      const findPin = allPins.find(pin => encriptAdapter.compare(code, pin.code));
    
      if (!findPin) throw CustomError.notFound(`User with code: ${code} not found`);
    
      return findPin;
  }; */


/*async findPinById(id: string) {
      try {
        return await Pin.findOne({
         where: {
            id
          },
        relations: ['users', 'credentials'], // Combina las relaciones en una sola propiedad
          select: {
            users: {
            id: true,
            name: true,
            surname: true,
            email: true,
            cellphone: true,
            status: true,
            securityBox: true,
            pin: true,
            },
            credentials: {
            id: true,
            account: true,
            description: true,
            code_1: true,
            code_2: true,
          },
              
        }
      });
    } catch (error) {
      throw new Error("Id not found");
    }
  };*/ 
         

          
            

    
    
       


