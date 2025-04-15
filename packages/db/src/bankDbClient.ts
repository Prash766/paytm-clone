import { PrismaClient } from "../prisma-bank-db/bank-db";

declare global{
    var prismaBank: PrismaClient<{omit:{user : {password :true}}}> | undefined
}

export const prismaBank = globalThis.prismaBank  || new PrismaClient<{omit :{ user:{password :true}}}>()

if(process.env.NODE_ENV==="development") global.prismaBank = prismaBank

 