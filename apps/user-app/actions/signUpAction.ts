"use server";
import {prismaClientDB} from '@repo/db/user_client'
import { userSignUpSchema } from '../schemas/signup.schema';
import { ZodError } from 'zod';
import bcrypt from 'bcrypt'

export  async function signup(userInfo: any){
 try {
    console.log("user ifo ",userInfo)
    const data = userSignUpSchema.parse(userInfo)
    console.log(data)
    
    const {name , password , email , number} = userInfo
    const hashedPassword = await bcrypt.hash(password , 10)
    const user = await prismaClientDB.user.findFirst({
        where:{
            email : email
        }
    })
    if(!user){
        new Error("User already Exists", )
    }
    const new_user = await prismaClientDB.user.create({
        data : {
            name,
            password:hashedPassword,
            email,
            number            
        }
    })
    return {
        ...new_user,
        success:true

    }
    
 } catch (error :any) {
    if(error instanceof ZodError){
        throw new Error(error.errors[0]?.message)
    }
    else{
        throw new Error(error.message || "failed to add data")
    }
    
 }

}