import { Request, Response } from "express";
import { CustomError, PinDTO } from "../../domain";
import { PinService } from "../services/pinService";
import { protecAccountOwner } from "../../config";


export class PinController {
    constructor(private readonly pinService: PinService){}

    private handleError = (error: unknown, res: Response) => {
      if (error instanceof CustomError) {
         return res.status(error.statusCode).json({ message: error.message});
          
        };
        return res.status(500).json({ message: "Internal served error 💩"})
    };

    createPin =  ( req: Request, res: Response) => {
        const [error, pinDTO] = PinDTO.create(req.body)
            
        if(error) return res.status(422).json({ message: error});
    
        this.pinService.createPin(pinDTO!)
        .then((data: any) => 
            res.status(201).json(data)
        )
        .catch((error: any) => this.handleError(error, res))  
    };

    validatePinByCode = async (req: Request, res: Response) => {
        try {
            const { code } = req.body;
            const sessionUserId = (req as any).user?.id;
    
            if (!code) return res.status(400).json({ error: "Code parameter is missing" });
    
            const pin = await this.pinService.validatePin(code);
    
            if (!pin) return res.status(404).json({ error: "Pin not found" });
    
            // 🔍 Verifica si el pin tiene un usuario asignado
            if (!pin.users) {
                return res.status(500).json({ error: "Pin is not associated with a user" });
            }
    
            const isOwner = protecAccountOwner(pin.users.id, sessionUserId);
            if (!isOwner) {
                return res.status(403).json({ error: "Unauthorized access to this PIN" });
            }
    
            return res.status(200).json(pin);
        } catch (error) {
            console.error("🔥 Error en validatePinByCode:", error);
            return res.status(500).json({ message: "Internal server error 💩", error });
        }
    };
   
};



    /*validatePinByCode = async (req: Request, res: Response) => {
        const { code } = req.body;
        
        if (!code) {
            return res.status(400).json({ error: "Code parameter is missing" });
        };
    
        try {
            const data = await this.pinService.validatePin(code);
            return res.status(200).json(data);
        } catch (error) {
            this.handleError(error, res);
        };
    };*/ 

    
     
