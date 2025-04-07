import { prisma } from '@repo/db/client'
import NextAuth from 'next-auth'
import bcrypt from 'bcrypt'
import CredentialsProvider from "next-auth/providers/credentials"


export const authOptions = {
    providers: [
        CredentialsProvider({
            name: "Sign In",
            credentials: {
                phoneNumber: { label: "Phone Number", type: "number", placeholder: "Enter your Phone Number" },
                password: { label: "Password", type: "password", placeholder: "Enter your password" }
            },
            async authorize(credentials) {
                try {
                    if (!credentials?.password) {
                        return null;
                    }
                    const hashedPassword = await bcrypt.hash(credentials.password , 10)
                    const user = await prisma.user.findFirst({
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
                } catch (error) {
                    console.log(error)
                    return null
                }
            }
        })
        
    ],
    secret:process.env.NEXTAUTH_URL
}