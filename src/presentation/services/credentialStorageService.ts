import { encode } from "punycode";
import { JwtAdapter } from "../../config/jwt.adapter";
import { Credentials, Pin, PostgresDatabase, SecurityBox } from "../../data";
import { CreateCredentialsDTO } from "../../domain/dtos/credentialsStoreage/createCredentials.dto";
import { PinService } from "./pinService";
import { SecurityBoxService } from "./securityBoxService";
//import * as jwt from "jsonwebtoken";
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';


export class CredentialService {
    constructor(public readonly securityBoxService: SecurityBoxService, public readonly pinService: PinService){}

    /*async createCredentials( credentialsData: CreateCredentialsDTO){
        const credentials = new Credentials()

        const { securityBox } = await this.securityBoxService.getSecurityBoxDetail(credentialsData.security_box_id);
        //const box = await this.securityBoxService.getSecurityBoxDetail(credentialsData.security_box_id);
        //console.log("Retrieved SecurityBox:", box); // 🔥 Verifica si `box` es `null`

        if (!securityBox) {
        throw new Error("Security Box not found");
        }

        const pin = await this.pinService.findPinById(credentialsData.pin_id)
        //console.log("Retrieved SecurityBox:", box); // 🔥 Verifica si `box` es `null`

        if (!pin) {
        throw new Error("Security Box not found");
        }

        credentials.account = credentialsData.account,
        credentials.password = credentialsData.password,
        credentials.description = credentialsData.description,
        credentials.code_1 = credentialsData.code_1,
        credentials.code_2 = credentialsData.code_2,
        credentials.securityBox = securityBox
        credentials.pin = pin

        try {
            // Insertar la entidad y obtener el ID
            const insertResult = await Credentials.insert(credentials);
            
            // Recuperar la entidad completa después de la inserción
            const newCredentials = await Credentials.findOne({
                where: { id: insertResult.identifiers[0].id },
                relations: ["securityBox", "pin"], // Incluir relaciones si son necesarias
            });
    
            if (!newCredentials) {
                throw new Error("Failed to retrieve created credentials");
            }
    
            return newCredentials;
        } catch (error: any) {
            throw new Error(`Error creating credentials: ${error.message}`);
        }
    };*/

    async createCredentials(credentialsData: CreateCredentialsDTO) {
    const credentials = new Credentials();

    // Obtener la securityBox
    const { securityBox } = await this.securityBoxService.getSecurityBoxDetail(credentialsData.security_box_id);
    if (!securityBox) {
        throw new Error("Security Box not found");
    }

    // Obtener el PIN
    const pin = await this.pinService.findPinById(credentialsData.pin_id);
    if (!pin) {
        throw new Error("Pin not found");
    }

    // Generar una contraseña aleatoria
    const generatedPassword = this.generateRandomPassword();

    // Hashear la contraseña antes de guardarla
    const hashedPassword = await bcrypt.hash(generatedPassword, 10);

    // Asignar valores
    credentials.account = credentialsData.account;
    credentials.password = hashedPassword; // Guardamos la contraseña encriptada
    credentials.description = credentialsData.description;
    credentials.code_1 = credentialsData.code_1;
    credentials.code_2 = credentialsData.code_2;
    credentials.securityBox = securityBox;
    credentials.pin = pin;

    try {
        // Insertar la entidad y obtener el ID
        const insertResult = await Credentials.insert(credentials);

        // Recuperar la entidad completa después de la inserción
        const newCredentials = await Credentials.findOne({
            where: { id: insertResult.identifiers[0].id },
            relations: ["securityBox", "pin"], // Incluir relaciones si son necesarias
        });

        if (!newCredentials) {
            throw new Error("Failed to retrieve created credentials");
        }

        return {
            //...newCredentials,
            //generatedPassword, // Si quieres devolver la contraseña generada en la respuesta
            id: newCredentials.id,
            account: newCredentials.account,
            description: newCredentials.description,
            code_1: newCredentials.code_1,
            code_2: newCredentials.code_2,
            security_box_id: newCredentials.securityBox,
            pin_id: newCredentials.pin
            
        };
    } catch (error: any) {
        throw new Error(`Error creating credentials: ${error.message}`);
    }
}

/**
 * Función para generar una contraseña aleatoria segura
 */
private generateRandomPassword(length: number = 12): string {
    return crypto.randomBytes(length).toString('hex').slice(0, length);
}

    /*static async generateRandomPassword(length = 12) {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";
        let password = "";
        for (let i = 0; i < length; i++) {
          password += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return password;
    };*/

  


    
}





    


