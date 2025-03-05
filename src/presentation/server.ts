import express, { Router } from "express"
import cors from "cors"
//import helmet from "helmet";
//import hpp from "hpp";
//import { rateLimit } from 'express-rate-limit'

interface Options {
    port: number;
    routes: Router;  
}

export class Server {

    private readonly app = express();
    private readonly port: number;
    private readonly routes: Router;

    constructor(options: Options) {
        this.port =  options.port;
        this.routes = options.routes;
    }

    async start(){
      this.app.use(cors({
        origin: "http://localhost:5174", // Prueba con '*' temporalmente
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Agrega OPTIONS
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: true // Permitir credenciales en las solicitudes CORS
    }));
      this.app.use( express.json());
      this.app.use( express.urlencoded({ extended: true}));

      /*const limiter = rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
        standardHeaders: 'draft-8', // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
        legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
        // store: ... , // Redis, Memcached, etc. See below.
      });

      this.app.use(limiter)
      this.app.use(helmet());*/

      this.app.use(this.routes)
   

      this.app.listen(this.port, () => {
        console.log(`Server started on port ${this.port} 😒😒😒`);
      })
    }
}
