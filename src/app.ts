import "reflect-metadata"

import { PostgresDatabase } from "./data/postgres/postgres-database";
import { AppRoutes } from "./presentation/routes";
import { Server } from "./presentation/server";
import { envs } from "./config/envs";

//import "dotenv/config";

process.loadEnvFile()



async function main() {
    const postgres = new PostgresDatabase ({
        username: envs.DB_USERNAME,
        password: envs.DB_PASSWORD,
        host: envs.DB_HOST,
        database: envs.DB_DATABASE,
        port: envs.DB_PORT
    });

    

    await postgres.connect();

    const server = new Server({
        port: envs.PORT,
        routes: AppRoutes.routes,
    });

    console.log(process.env.PORT)

    await server.start()


}

main();