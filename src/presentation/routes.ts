import { Router } from "express";
import { UserRoutes } from "./users/router";
import { PinRoutes } from "./pin/router";
import { SecurityBoxRoutes } from "./securityBox/router";
import { CredentialsRoutes } from "./credentials/router";


export class AppRoutes {
    
    static get routes(): Router {
        const router = Router();

        router.use('/api/users', UserRoutes.routes);
        router.use("/api/security-boxes", SecurityBoxRoutes.routes);
        router.use('/api/pin', PinRoutes.routes);
        router.use('/api/credentials', CredentialsRoutes.routes);
        
        
        return router;
    };
}