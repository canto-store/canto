import { Request, Response, NextFunction } from 'express';
import  AuthService  from './auth.service';
import { CreateUserDto, LoginDto } from './auth.types';

class AuthController {
    private readonly authService = new AuthService();

public async register(req: Request, res: Response, next: NextFunction) {
    try{
        const userData:CreateUserDto = req.body;
        const user = await this.authService.register(userData);
        res.status(201).json(`firstName: ${user.name.split("")[0]}`);
    }
    catch(error){
        next(error);

    }

}

public async login(req: Request, res: Response, next: NextFunction) {
    try{
        const loginData:LoginDto  = req.body;
        const user = await this.authService.login(loginData);
        res.status(200).json({firstname: user.name.split(" ")[0]});
    }
    catch(error){
        next(error);
    }
}



}

export default AuthController;
