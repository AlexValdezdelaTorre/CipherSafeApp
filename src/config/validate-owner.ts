


import { Request, Response, NextFunction } from "express";

/**
 * Middleware para verificar si el usuario autenticado es el dueño de la cuenta
 */
export const protecAccountOwner = (req: Request, res: Response, next: NextFunction) => {
    const sessionUserId = (req as any).user?.id; // Usuario autenticado desde JWT
    const ownerUserId = req.params.userId || req.query.userId; // ID del dueño del recurso

    if (!sessionUserId) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    if (!ownerUserId || sessionUserId !== ownerUserId) {
        return res.status(403).json({ message: "Access denied: Not the account owner" });
    }

    next(); // Si todo está bien, continúa con la ejecución
};



/*export const protecAccountOwner = (
    ownerUserId: string,
    sessionUserId: string

) => {
    if ( ownerUserId !== sessionUserId) {
        return false; 
    }

    return true
}*/