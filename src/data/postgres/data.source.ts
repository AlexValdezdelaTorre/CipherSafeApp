import { DataSource } from "typeorm";
import { Users } from "./models/users.model";
import { Credentials } from "./models/credentialStorage.model";
import { Pin } from "./models/pin.model";
import { SecurityBox } from "./models/security_box.model";
import { envs } from "../../config";

interface Options {
    host: string;
    port: number;
    username: string;
    password: string;
    database: string;
}

const options: Options = {
    host: envs.DB_HOST,
    port: envs.DB_PORT,
    username: envs.DB_USERNAME,
    password: envs.DB_PASSWORD,
    database: envs.DB_DATABASE,
        
};

export const AppDataSource = new DataSource ({
    type: 'postgres',
    host: options.host,
    port: options.port,
    username: options.username,
    password: options.password,
    database: options.database,
    entities: [Users, Credentials, Pin, SecurityBox],
    synchronize: false,
    migrationsRun: true,
    migrations: [__dirname + "/migrations/*.ts"],
    ssl: {
        rejectUnauthorized: false,
    },
});
    
