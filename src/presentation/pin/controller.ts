import { Request, Response } from "express";
import { CustomError, PinDTO } from "../../domain";
import { PinService } from "../services/pinService";


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
    }; 

    findIdPin = async (req: Request, res: Response) => {
        const { id } = req.params;
        
        this.pinService.findPinById(id)
        .then((data: any) => {
            return res.status(200).json(data)
        })
        .catch((error: any) => {
            return res.status(500).json({
            message: "Internal Server Error",
            error,
            });
        }) ;  
    };
   
};

    
     
