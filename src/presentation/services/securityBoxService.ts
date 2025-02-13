

import { Next, Req, Res } from "@nestjs/common";
import { encriptAdapter, protecAccountOwner } from "../../config";
import { Credentials, Sec_status, SecurityBox } from "../../data";
import { CreateSecurityBoxDTO, CustomError } from "../../domain";
import { UsersService } from "../services/userService";
import { CredentialService } from "./credentialStorageService";



export class SecurityBoxService {
  constructor(public readonly usersService: UsersService) {}

  async createSecurityBox(securityBoxData: CreateSecurityBoxDTO) {

    const securityBox = new SecurityBox()
    const user = await this.usersService.findIdUser(securityBoxData.user_id)
            
    securityBox.name = securityBoxData.name;
    securityBox.favorite = securityBoxData.favorite;
    securityBox.icon = securityBoxData.icon;
    securityBox.users = user
            
    try {
    return await securityBox.save();
    }catch (error: any) {
     throw new Error(`Error creating security box: ${error.message}`);
    }
  }; 


  async securityBoxList(
    orderBy: "name" | "createdAt" | "credentialsCount" = "name",
    orderDirection: "ASC" | "DESC" = "ASC",
    favorite?: boolean
  ) {
  const queryBuilder = SecurityBox.createQueryBuilder("securityBox")
    .leftJoinAndSelect("securityBox.credentials", "credentials")
    .select([
      "securityBox.id",
      "securityBox.name",
      "securityBox.favorite",
      "securityBox.icon",
      "securityBox.sec_status",
      "securityBox.createdAt",
    ])
    .addSelect("COUNT(DISTINCT credentials.id)", "credentialsCount")
    .where("securityBox.sec_status = :sec_status", {sec_status: Sec_status.ACTIVE,

    })
    .groupBy("securityBox.id");

    if (favorite !== undefined) {
      queryBuilder.andWhere("securityBox.favorite = :favorite", { favorite });
    }
   
    if (orderBy === "name") {
      queryBuilder.orderBy("securityBox.name", orderDirection);
    } else if (orderBy === "createdAt") {
      queryBuilder.orderBy("securityBox.createdAt", orderDirection);
    } else if (orderBy === "credentialsCount") {
      queryBuilder.orderBy("credentialsCount", orderDirection);
    }
    return await queryBuilder.getMany();
  }


  /*async getSecurityBoxes(orderBy: string): Promise<SecurityBox[]> {
    let order = {};

    switch (orderBy) {
      case 'ALFABETICO':
        order = { name: 'ASC' };
        break;
      case 'FECHA_CREACION':
        order = { createdAt: 'ASC' };
        break;
      case 'CANTIDAD_REGISTROS':
        order = { recordCount: 'DESC' };
        break;
      default:
        order = { name: 'ASC' };
    }

    return SecurityBox.find({ order });
  };*/

    
  async addFavorite(securityBoxId: string, isFavorite: boolean): Promise<SecurityBox | null> {
    try {
      const securityBox = await SecurityBox.findOne({ where: { id: securityBoxId } });
    
      if (!securityBox) {
        throw new Error('SecurityBox not found');
      }
    
      securityBox.favorite = isFavorite;
      await securityBox.save(); // Guardamos los cambios en la base de datos
    
      return securityBox; // Retornamos el objeto actualizado
    } catch (error) {
      console.error('Error in toggleFavorite:', error);
      return null; // Devuelve null si hay un error
    }
  };

  /*async findBoxById(id: string){
    try {
      return await SecurityBox.findOne({
      where: {
        id,
        sec_status: Sec_status.ACTIVE
      },
      relations: ['users', 'credentials'],
      select: {
      users: {
      id: true,
      name: true,
      surname: true,
      email: true,
      cellphone: true,
      status: true,
      securityBox: true,
      pin: true
      },
      credentials: {
        id: true,
        account: true,
        description: true,
        code_1: true,
        code_2: true,
        }}
    })
    } catch (error) {
      throw new Error("BoxId not found")
    }
  };*/

  async getSecurityBoxDetail(
    securityBoxId: string,
    page: number = 1,
    limit: number = 10
  ) {
    const securityBox = await SecurityBox.findOne({
      where: {
        id: securityBoxId,
        sec_status: Sec_status.ACTIVE,
      },
    });
    if (!securityBox) {
      throw CustomError.notFound(
        `securityBox with id: ${securityBoxId} not found`
      );
    }
    const [credentials, total] = await Credentials.findAndCount({
      where: {
        securityBox: {
          id: securityBoxId,
        },
      },
      take: limit,
      skip: (page - 1) * limit,
    });
    return {
      securityBox,
      credentialStorages: {
        totalPages: Math.ceil(total / limit),
        totalRecords: total,
        currentPage: page,
        data: credentials,
      },
    };
  }
    
}
