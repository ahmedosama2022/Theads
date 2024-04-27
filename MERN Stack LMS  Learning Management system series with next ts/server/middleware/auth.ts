import { Request,Response, NextFunction } from "express";
import { CatchAsyncError } from "./catchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";
import jwt, { JwtPayload } from "jsonwebtoken"
import {redis} from "../utils/redis"

export const isAutheticated = CatchAsyncError(async(req:Request, res:Response,next:NextFunction)=>{
    const access_token = req.cookies.access_token as string;

    if(!access_token){
        return next(new ErrorHandler("please login to access this resource", 400));
    }

    const decoded = jwt.verify(access_token,process.env.ACCESS_TOKEN as string) ;
     if(!decoded){
        return next(new ErrorHandler('Invalid token please login again', 401));
     }

     const user = await redis.get(decoded);
     if(!user){
        return next(new ErrorHandler('user not found', 400));
     }

     req.user = JSON.parse(user);

     next();

})




// Validate user role

export const authorizeRoles = (...roles: string[]) => {
    return (req:Request, res:Response,next:NextFunction) => {
        if(!roles.includes(req.user?.role || '')){
            return res.status(403).json("is not allowed to access this resous")
        }
    }
}