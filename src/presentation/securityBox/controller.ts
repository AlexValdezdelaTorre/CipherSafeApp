import { Request, Response } from "express";
import { SecurityBoxService } from "../services/securityBoxService";
import { CreateSecurityBoxDTO, CustomError } from "../../domain";



export class SecurityBoxController {
  constructor(private readonly securityBoxService: SecurityBoxService) {
      console.log("SecurityBoxService injected into controller: ", this.securityBoxService);
  }
    
  private handleError = (error: unknown, res: Response) => {
    if (error instanceof CustomError) {
       return res.status(error.statusCode).json({ message: error.message});
    };
      console.log(error);
    return res.status(500).json({ message: "Internal served error 💩"})
  }

  createSecurityBox =  ( req: Request, res: Response) => {
    const [error, createSecurityBoxDTO] = CreateSecurityBoxDTO.create(req.body)
    //const sessionUserId = req.body.sessionUser.id;
    const sessionUserId = (req as unknown as { user: { id: string } }).user.id;
            
      if(error) return res.status(422).json({ message: error});
    
      this.securityBoxService.createSecurityBox(createSecurityBoxDTO!, sessionUserId)
      .then((data: any) => 
        res.status(201).json(data)
      )
      .catch((error: any) => {
        this.handleError(error, res);
      }); 
  };

   
  async getBoxList(req: Request, res: Response) {
    try {
      const {  orderBy, orderDirection, favorite } = req.query;
      //const sessionUserId = req.body.sessionUser.id;
      const sessionUserId = (req as unknown as { user: { id: string } }).user.id;
        
      // Validar y asignar valores predeterminados
    const validOrderBy = ["name", "createdAt", "credentialsCount"];
    const validOrderDirection = ["ASC", "DESC"];
        
    const orderByValue = validOrderBy.includes(orderBy as string) ? (orderBy as "name" | "createdAt" | "credentialsCount") : "name";
    const orderDirectionValue = validOrderDirection.includes(orderDirection as string) ? (orderDirection as "ASC" | "DESC") : "ASC";
        
    const favoriteValue = favorite !== undefined ? favorite === "true" : undefined;
  
    const securityBoxes = await this.securityBoxService.securityBoxList(sessionUserId, orderByValue, orderDirectionValue, favoriteValue);
      return res.json(securityBoxes);
    } catch (error) {
      console.error("Error listing security boxes:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
  };

  addFavorite = async (req: Request, res: Response) => {
    try {
      const securityBoxId = req.params.id; // El ID se mantiene como string
      const { isFavorite } = req.body; // Extraemos el booleano desde el body
      //const sessionUserId = req.body.sessionUser.id;
      const sessionUserId = (req as unknown as { user: { id: string } }).user.id;
      
      if (!securityBoxId) {
        return res.status(400).json({ message: 'Invalid ID format' });
      }
      
      const updatedSecurityBox = await this.securityBoxService.addFavorite( securityBoxId, isFavorite, sessionUserId );
      
      if (!updatedSecurityBox) {
        return res.status(404).json({ message: 'SecurityBox not found' });
      }
      
      return res.status(200).json(updatedSecurityBox); // Enviamos la respuesta con la caja de seguridad actualizada
      } catch (error) {
        console.error('Error in toggleFavorite:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
  };

  getSecurityBoxDetails = async (req: Request, res: Response) => {
    const { id } = req.params;
    const page = req.query.page || 1;
    const limit = req.query.limit || 10
      
    this.securityBoxService.getSecurityBoxDetail(id, +page, +limit)
      .then((data: any) => {
          return res.status(200).json(data)
      })
      .catch((error: any) => {
          return res.status(500).json({
          message: "Internal Server Error",
          error,
        });
    });  
  };

}


 /*getSecurityBoxes = async (req: Request, res: Response) => {
        try {
          const orderBy = req.query.orderBy as string || 'ALFABETICO'; // Default a 'ALFABETICO' si no se envía
          console.log('Calling getSecurityBoxes with orderBy: ', orderBy);
      
          const data = await this.securityBoxService.getSecurityBoxes(orderBy);
          return res.status(200).json(data);
        } catch (error) {
          console.error('Error in getSecurityBoxes: ', error);
          return res.status(500).json({ message: 'Internal server error 💩' });
        }
    };*/
