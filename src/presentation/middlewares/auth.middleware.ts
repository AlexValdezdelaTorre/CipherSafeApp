import { NextFunction, Request, Response } from "express";
import { JwtAdapter } from "../../config/jwt.adapter";
import { Users } from "../../data";

export class AuthMiddleware {
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
}