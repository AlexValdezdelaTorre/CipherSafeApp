import { Request, Response } from "express";
import { CustomError } from "../../domain";
import { CredentialService } from "../services/credentialStorageService";
import { CreateCredentialsDTO } from "../../domain/dtos/credentialsStoreage/createCredentials.dto";



export class CredentialsController {
    constructor(private readonly credentialsService: CredentialService) {
        //console.log("SecurityBoxService injected into controller: ", this.securityBoxService);
    }
    
    private handleError = (error: unknown, res: Response) => {
        if (error instanceof CustomError) {
            return res.status(error.statusCode).json({ message: error.message});
          };
            console.log(error);
            return res.status(500).json({ message: "Internal served error 💩"})
    };

    createCredentialController =  ( req: Request, res: Response) => {
        const [error, createCredentialsDTO] = CreateCredentialsDTO.create(req.body)
            
        if(error) return res.status(422).json({ message: error});
    
        this.credentialsService.createCredentials(createCredentialsDTO!)
        .then((data: any) => 
            res.status(201).json(data)
        )
        .catch((error: any) => {
            this.handleError(error, res);
        }); 
    };

    /*static async generatePassword(req: Request, res: Response) {
        try {
          const password = await CredentialService.generateRandomPassword();
          res.json({ password });
        } catch (error: unknown) {
          res.status(500).json({ error });
        }
    };*/

    
}
