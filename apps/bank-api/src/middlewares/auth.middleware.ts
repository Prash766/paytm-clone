import asyncHandler from "../utils/asyncHandler";
import jwt, { JwtPayload } from  'jsonwebtoken'
import {Request} from 'express'

declare module "express"{
    interface Request{
            user?:{
                userId:number,
                email : string
            }
    }
}

const verifyJWT = asyncHandler(async(req ,res , next)=>{
    // const token = req.header('cookie') || req.headers.authorization?.split(" ")[1]
    // console.log(token)
    const token = req.cookies['auth-token'];
    console.log("token",token)
    if(!token){
        return res.status(400).json({
            success:true,
            message:"UnAuthorized"
        })
    }
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY as string) as JwtPayload & {userId : number  , email :string}
    console.log("decoded token",decodedToken)
    if(!decodedToken){
        return res.status(400).json({
            success:false,
            message:"UnAuthorized"
        })
    }
    req.user = {
        userId :decodedToken.userId,
        email:decodedToken.email
    }
    next()
    
})

export default verifyJWT