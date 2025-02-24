import { NextFunction, Request, Response } from "express";
import { Pin, SecurityBox } from "../data";



export const protecAccountOwner = (
    ownerUserId: string,
    sessionUserId: string

) => {
    if ( ownerUserId !== sessionUserId) {
        return false; 
    }

    return true
}


export const protecAccountOwnerMiddleware = (req: Request, res: Response, next: NextFunction) => {
    (async () => {
      try {
        const sessionUserId = (req as any).user.id; // Usuario autenticado
        const { security_box_id, pin_id } = req.body; // ID de la SecurityBox y del PIN desde el request
  
        // 🔹 Verificar SecurityBox
        const securityBox = await SecurityBox.findOne({
          where: { id: security_box_id },
          relations: ["users"],
        });
  
        if (!securityBox) {
          return res.status(404).json({ message: "Security Box not found" });
        }
  
        if (securityBox.users.id !== sessionUserId) {
          return res.status(403).json({ message: "You are not the owner of this Security Box" });
        }
  
        // 🔹 Verificar PIN
        const pin = await Pin.findOne({
          where: { id: pin_id, users: { id: sessionUserId } }, // Asegurar que el PIN también pertenezca al usuario
          relations: ["users"],
        });
  
        if (!pin) {
          return res.status(404).json({ message: "Pin not found or does not belong to you" });
        }
  
        next(); // Todo correcto, continuar con la ejecución
      } catch (error) {
        console.error("🔥 Error en protecAccountOwnerMiddleware:", error);
        next(error); // Pasar el error al manejador de Express
      }
    })();
  };