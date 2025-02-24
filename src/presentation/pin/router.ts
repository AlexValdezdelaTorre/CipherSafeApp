import { Router } from "express";
import { PinService } from "../services/pinService";
import { UsersService } from "../services/userService";
import { envs } from "../../config";
import { PinController } from "./controller";
import { EmailService } from "../services/email.service";
import { AuthMiddleware } from "../middlewares/auth.middleware";


export class PinRoutes {
    static get routes(): Router {
        const router = Router();
        
        const emailService = new EmailService(
            envs.MAILER_SERVICE,
            envs.MAILER_EMAIL,
            envs.MAILER_SECRET_KEY,
            envs.SEND_EMAIL
        )

        const usersService = new UsersService(emailService)
        const pinService = new PinService(usersService)
        const pinController = new PinController(pinService);

        router.post('/', pinController.createPin); 

        router.use(AuthMiddleware.protec);
        router.post('/validate', pinController.validatePinByCode); 
          

        return router;
    };
}