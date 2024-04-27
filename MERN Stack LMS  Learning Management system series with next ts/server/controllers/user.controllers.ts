require('dotenv').config();
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";
import jwt from "jsonwebtoken"
import userModel from "../models/user.model";
import { Request ,Response,NextFunction} from "express";

import { getUserById } from "../services/user.service";

interface IRegistrationBody{

    name: string;
    email: string;
    password:string;
    avater?:string;
}

export const registrationUser = CatchAsyncError(async(req:Request,res:Response,next:NextFunction) => {
    try{
        const {name,email,password}= req.body;
        const newUser = new userModel({ name,email,password});
        
        const isEmailExist = await userModel.findOne({email});
        if(isEmailExist){
            return next (new ErrorHandler("Email already exist",400))
        };

        const user: IRegistrationBody = {
            name,
            email,
            password,
        };
        const activationToken = createActivationToken(user);
        const activationCode = activationToken.activationCode;

        const data = {user: {name:user.name}, activationCode}
        
        try {
            await newUser.save();
            res.status(201).json({
                success:true,
                activationToken: activationToken.token,
            });
          } catch (error) {
            next(error);
          }
      
           
        
    }
    catch (error:any){
        return next(new ErrorHandler(error.message,400))
    }
});

interface IActivationToken{
    token:string;
    activationCode: string;
}

export const createActivationToken= (user: any): IActivationToken => {
    const activationCode = Math.floor(1000 + Math.random() * 9000).toString();

    const token = jwt.sign({
        user,activationCode
    },process.env.ACTIVATION_SECRET,{
        expiresIn: "10m"
    });
    return{token, activationCode}
}




// login user



export const loginUser = CatchAsyncError(async(req:Request, res:Response,next:NextFunction) => {
    const { email } = req.body;
    try {
        const validUser = await userModel.findOne({ email });
        if (!validUser) return next(ErrorHandler(404, 'User not found!'));
      
        const token = jwt.sign({ id: validUser._id }, process.env.ACTIVATION_SECRET);
   
    res.cookie('access_token', token, { httpOnly: true })
      .status(200)
      .json(validUser);
      } catch (error) {
        next(error);
      }
})



// logout user 


export const logoutUser = CatchAsyncError( async (req:Request, res:Response,next:NextFunction) => {
    try {
        res.clearCookie('access_token');
        res.status(200).json('User has been logged out!');
      } catch (error) {
        next(error);
      }
    })



    
export const getUserInfo = CatchAsyncError( async  (res:Response,req: Request, next: NextFunction) => {
    try{
        const userId = req.user?._id;
      getUserById(userId, res);
     
     }catch(error){
        return next(new ErrorHandler(error.message, 400))
     }
})
   
  