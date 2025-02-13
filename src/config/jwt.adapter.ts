import jwt from "jsonwebtoken";
import { envs } from './envs'



const JWT_SEED = envs.JWT_SECRET;

export class JwtAdapter {
    static async generateToken(payload: any, duration: any = "3h") {

        return new Promise((resolve) => {

            if (typeof payload !== "object" || payload === null) {
                console.error("JWT Generation Error: Payload must be an object, received:", payload);
                return resolve(null);
            }
            jwt.sign(payload, JWT_SEED, { expiresIn: duration}, (err, token) => {
                if(err)  return resolve(null);

                resolve(token)
        });
        });
    }

    static async validateToken(token: string) {
        return new Promise((resolve) => {
            jwt.verify(token, JWT_SEED, (err: any, decoded: any) => {
                if(err) return resolve(null);

                resolve(decoded);
            });
        });
    }
}