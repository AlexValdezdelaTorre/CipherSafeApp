import { Router } from "express";
import { CredentialsController } from "./controller";
import { CredentialService } from "../services/credentialStorageService";
import { SecurityBoxService } from "../services/securityBoxService";
import { PinService } from "../services/pinService";
import { UsersService } from "../services/userService";
import { envs } from "../../config";
import { EmailService } from "../services/email.service";
import { AuthMiddleware } from "../middlewares/auth.middleware";


export class CredentialsRoutes {
    static get routes(): Router {
        const router = Router();
        
        const emailService = new EmailService(envs.MAILER_SERVICE,
            envs.MAILER_EMAIL,
            envs.MAILER_SECRET_KEY,
            envs.SEND_EMAIL
        );

        const userService = new UsersService(emailService)           
        const pinService = new PinService(userService)           
        const securityBoxService = new SecurityBoxService(userService)
        const crentialsService = new CredentialService(securityBoxService, pinService)
        const credentialsController = new CredentialsController(crentialsService);
        

        router.post('/', credentialsController.createCredentialController);
        router.get("/generate-password", CredentialsController.generatePassword);
       

        //router.post("/vault-detail", credentialsController.getVaultDetail);


        
        
        //router.get('/password', credentialsController.getPassword);
        

    
        return router

    }
}

function generarContrasena(longitud: number) {
    throw new Error("Function not implemented.");
}
