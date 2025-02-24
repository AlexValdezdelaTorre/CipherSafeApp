import { Router } from "express";
import { SecurityBoxController } from "./controller";
import { SecurityBoxService } from "../services/securityBoxService";
import { UsersService } from "../services/userService";
import { EmailService } from "../services/email.service";
import { envs } from "../../config";
import { AuthMiddleware } from "../middlewares/auth.middleware";


export class SecurityBoxRoutes {
    static get routes(): Router {
        const router = Router();
        
        const emailService = new EmailService(envs.MAILER_SERVICE,
            envs.MAILER_EMAIL,
            envs.MAILER_SECRET_KEY,
            envs.SEND_EMAIL
        );
                    
        const userService = new UsersService(emailService)
        const securityBoxService = new SecurityBoxService(userService)
        const securityBoxcontroller = new SecurityBoxController(securityBoxService);
        

        router.use(AuthMiddleware.protec);

        router.post('/', securityBoxcontroller.createSecurityBox);
        router.patch('/favorite/:id', securityBoxcontroller.addFavorite)
        router.get("/",  (req, res) => securityBoxcontroller.getBoxList(req, res));
        
        router.get('/:id', securityBoxcontroller.getSecurityBoxDetails);
        

        return router

    };
}
