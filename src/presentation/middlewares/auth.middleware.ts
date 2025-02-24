import { NextFunction, Request, Response } from "express";
import { JwtAdapter } from "../../config/jwt.adapter";
import { Users } from "../../data";


export class AuthMiddleware {
  static async protec(req: Request, res: Response, next: NextFunction) {
    try {
      const authorization = req.header("Authorization");
      if (!authorization) return res.status(401).json({ message: "No token provided" });

      if (!authorization.startsWith("Bearer "))
        return res.status(401).json({ message: "Invalid token format" });

      const token = authorization.split(" ")[1];

      const payload = (await JwtAdapter.validateToken(token)) as { id: string };
      if (!payload) return res.status(401).json({ message: "Invalid token" });

      const user = await Users.findOne({
        where: { id: payload.id, status: true },
      });

      if (!user) return res.status(401).json({ message: "Invalid User" });

      //(req as any).user = user;
      (req as unknown as { user: Users }).user = user;
      next();
    } catch (error) {
      console.error("🔥 Error en AuthMiddleware:", error); // Imprime el error en la consola
      return res.status(500).json({ message: "Internal server error 💩", error });
    }
  };
  
}




/*export class AuthMiddleware {
  static async protec(req: Request, res: Response, next: NextFunction) {
    const authorization = req.header("Authorization");

    if (!authorization)
      return res.status(401).json({ message: "No token provided" });

    if (!authorization.startsWith("Bearer "))
      return res.status(401).json({ message: "Invalid token" });

    const token = authorization.split(" ").at(1) || "";

    try {
      const paylod = (await JwtAdapter.validateToken(token)) as { id: string };

      if (!paylod) return res.status(401).json({ message: "Invalid token" });

      const user = await Users.findOne({
        where: {
          id: paylod.id,
          status: true,
        },
      });

      if (!user) return res.status(401).json({ message: "Invalid User" });

      req.body.sessionUser = user;
      next();
    } catch (error) {
      return res.status(500).json({ message: "Invalid server error" });
    }
  }
}*/

