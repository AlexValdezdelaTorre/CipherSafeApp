
import { encriptAdapter, protecAccountOwner } from "../../config";
import { JwtAdapter } from "../../config/jwt.adapter";
import { Pin, Users } from "../../data";
import { CreateUsersDTO, CustomError, LoginUserDTO, UpdateUsersDTO } from "../../domain";
import { EmailService } from "./email.service";


export class UsersService {
  constructor(private readonly emailService: EmailService) {}

  async findIdUser(id: string){
    const result = await Users.createQueryBuilder("user")
         
    .where("user.id = :id", { id: id})
    .andWhere("user.status = :status", {status: true})
    .getOne();

    if(!result) {
      throw CustomError.notFound("User not found");
    }
  
    return result;
            
  };

  async createUser(usersData: CreateUsersDTO) { 
    const users = new Users()
  
    users.name = usersData.name;
    users.surname = usersData.surname;
    users.email = usersData.email;
    users.cellphone = usersData.cellphone;
    users.password = usersData.password;  
        
    try {
      const dbUser = await users.save();
      
      await this.createPin(usersData.pin, dbUser);
   
      return {
        id: dbUser.id, 
        name: dbUser.name,
        surname: dbUser.surname,
        email: dbUser.email,
        cellphone: dbUser.cellphone,
        status: dbUser.status,
        //pin: usersData.pin
        
      }
      }catch (error: any) {
        if(error.code === '23505'){
        throw CustomError.badRequest(`User with: ${usersData.email} email already exist`);
      }
      throw CustomError.internalServed("Error creando el usuario")
    }
  };

  async loginUser(loginUserDto: LoginUserDTO) {
    const user = await this.findUserByEmail(loginUserDto.email, true)
     
    const isMatching = encriptAdapter.compare(
      loginUserDto.password,
      user.password
    );
        
    if(!isMatching) throw CustomError.unAuthorized('Invalid Credentials');
    
    const token = await JwtAdapter.generateToken({id: user.id});
    if(!token) throw CustomError.internalServed("Error while creating JWT")
      return {
        token: token,
        user: {
          id: user.id,
          name: user.name,
          surname: user.surname,
          email: user.email,
          cellphone: user.cellphone,
          
        }
        
      };
  };

  async createPin(pin: string, users: Users) { 
      const userPin = new Pin();
        
      userPin.code = pin;
      userPin.users = users
              
      try {
        return await userPin.save();
          }catch (error: any) {
          throw new Error(`Error creating pin: ${error.message}`);
               
      };
  };

  async findUserByEmail(email: string, status: boolean){
    const user = await Users.findOne({
      where: {
       email: email,
       status: status
      }
    });
    if(!user) throw CustomError.notFound(`User with email: ${email} not found`);
    
    return user;
  };

  async updateUser(id: string, usersData: UpdateUsersDTO, sessionUserId: string ){
   const user = await this.findIdUser(id);
   
    const isOwner = protecAccountOwner(user.id, sessionUserId);
    if(!isOwner) throw CustomError.unAuthorized("You are not the owner of this account");

    
    user.name = usersData.name.trim()
    user.surname = usersData.surname.trim()
    user.email = usersData.email.toLowerCase().trim()
    user.cellphone = usersData.cellphone.trim()

    try {
      const dbUser = await user.save();
        
      return {
        name: dbUser.name,
        surname: dbUser.surname,
        email: dbUser.email,
        cellphone: dbUser.cellphone
      };
    } catch (error) {
      throw CustomError.internalServed("Error actualizando el usuario")
    }
  };

  async deleteUser(id: string, sessionUserId: string){
    const userId = await this.findIdUser(id);

    const isOwner = protecAccountOwner(userId.id, sessionUserId);
    if(!isOwner) throw CustomError.unAuthorized("You are not the owner of this account");

    userId.status = false

    try {
      userId.save()

      return {
        id: userId.id,
        status: userId.status
      }
    } catch (error) {
      throw CustomError.internalServed("Error eliminando el usuario")
    }
  };

}

/*async findAllUsers() {
    try {
      return await Users.find({
        where: {
          status: true
        }
      })
      } catch (error) {
      throw CustomError.internalServed("Error obteniendo datos")
    }
  };*/

  /*validateEmail = async (token: string) => {
    const payload = await JwtAdapter.validateToken(token);
    if(!payload) throw CustomError.badRequest("Invalid token");
  
    const { email } = payload as { email: string}
    if(!email) throw CustomError.internalServed("Email not in token");
         
    const user = await Users.findOne({ where : {email: email} });
    if(!user) throw CustomError.internalServed("Email  not exist");
  
    user.status
  
    try {
      await user.save();
    
      return {
        message: "User active"
        };
    } catch (error) {
    throw CustomError.internalServed("Something went wery wrong");
    };
  };*/

  /*public sendEmailValidationLink = async (email: string) => {
    const token = await JwtAdapter.generateToken({ email }, '300s');
    const link = `http://${envs.WEBSERVICE_URL}/api/users/validate-email/${token}`;
    const html = `
    <h1>Validate your email</h1>
    <p>click on the following link to validate your email<p>
    <a href="${link}">Validate your email: ${email}</a>
    `;
    const isSent = this.emailService.sendEmail({
      to: email,
      subject: "Validate your account",
      htmlBody: html
    });
    if(!isSent) throw CustomError.internalServed("Error sending email");
      
    return true;
  };*/

