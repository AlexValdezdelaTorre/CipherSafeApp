import { Router } from "express";
import { UsersService } from "../services/userService";
import { UsersController } from "./controller";
import { EmailService } from "../services/email.service";
import { envs } from "../../config/envs";
import { AuthMiddleware } from "../middlewares/auth.middleware";



export class UserRoutes {
    static get routes(): Router {
        const router = Router();
        
        const emailService = new EmailService(
            envs.MAILER_SERVICE,
            envs.MAILER_EMAIL,
            envs.MAILER_SECRET_KEY,
            envs.SEND_EMAIL
        )

        const usersService = new UsersService(emailService)
        const usersController = new UsersController(usersService);

        router.post('/', usersController.createUser);
        router.post('/login', usersController.loginUser);
        //router.get('/', usersController.findAllUsers);
        router.get('/:id', usersController.findIdUser);
        
        router.use(AuthMiddleware.protec);

        router.patch('/:id', usersController.updateUser);
        router.delete('/:id', usersController.deleteUser);
        //router.get('/validate-email/:token', usersController.validateAccount);
        
        

          return router;
    }
}