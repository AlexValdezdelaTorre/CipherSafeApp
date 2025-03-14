import "dotenv/config";
import { get } from "env-var";
process.loadEnvFile();

export const envs = {
    PORT: get('PORT').required().asPortNumber(),
    DB_USERNAME: get('USERNAME_DATABASE').required().asString(),
    DB_PASSWORD: get('PASSWORD_DATABASE').required().asString(),
    DB_HOST: get('HOST_DATABASE').required().asString(),
    DB_DATABASE: get('DATABASE').required().asString(),
    DB_PORT: get('PORT_DATABASE').required().asPortNumber(),
    JWT_SECRET: get('JWT_SECRET').required().asString(),
    JWT_EXPIRE_IN: get("JWT_EXPIRE_IN").required().asString(),
    SEND_EMAIL: get("SEND_EMAIL").required().asBool(),
    MAILER_SERVICE: get("MAILER_SERVICE").required().asString(),
    MAILER_EMAIL: get("MAILER_EMAIL").required().asString(),
    MAILER_SECRET_KEY: get("MAILER_SECRET_KEY").required().asString(),
    WEBSERVICE_URL: get("WEBSERVICE_URL").required().asString()  
};