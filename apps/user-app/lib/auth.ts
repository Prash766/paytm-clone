import { prismaClientDB } from '@repo/db/user_client'
import bcrypt from 'bcryptjs'
import CredentialsProvider from "next-auth/providers/credentials"
import { DefaultSession, NextAuthOptions } from "next-auth";


declare module "next-auth" {
    interface User {
      id?: string;
      phoneNumber?: string;
    }
    interface Session {
      user: DefaultSession["user"] & {
        id?: string;
        phoneNumber?: string;
      };
    }
  }
  declare module "next-auth/jwt" {
    interface JWT {
      id?: string;
      phoneNumber?: string;
    }
  }
  
  

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: "Sign In",
            credentials: {
                phoneNumber: { label: "Phone Number", type: "text", placeholder: "Enter your Phone Number" },
                password: { label: "Password", type: "password", placeholder: "Enter your password" }
            },
            async authorize(credentials) {
                try {
                    if (!credentials?.password) {
                        return null;
                    }
                    const user = await prismaClientDB.user.findFirst({
                        where: {
                            number: credentials?.phoneNumber
                        },
                        select: {
                            name: true,
                            email: true,
                            id: true,
                            number: true,
                            password: true
                        }
                    })
                    if (!user) {
                        return null
                    }
                    const isPasswordMatched = await bcrypt.compare(credentials.password, user.password)
                    if (isPasswordMatched) {
                        return {
                            id: user.id.toString(),
                            name: user.name,
                            email: user.email,
                            phoneNumber: user.number
                        }
                    }
                    return null
                } catch (error) {
                    console.log(error)
                    return null
                }
            }
        })
        
    ],
    callbacks:{
        async jwt({token, user }){
            console.log(user)
            if(user){
                token.phoneNumber = user.phoneNumber
                token.id = user.id
            }
            console.log("TOKEN IN JWT CALLBACK", token)
            return token
        },
        async session({session , token}){
            console.log("token",token)
            if(token){
                session.user.phoneNumber = token.phoneNumber
                session.user.id = token.id
            }
            console.log("SESSION",session)
            return session
        }

    },
    secret:process.env.NEXTAUTH_SECRET,
    
    
    
} satisfies NextAuthOptions