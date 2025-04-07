import { PrismaClient } from "@prisma/client";
declare global {
    var prisma:
      | PrismaClient<{ omit: { user: { password: true } } }>
      | undefined;
  }
  

export const prisma = globalThis.prisma || new PrismaClient(
    {
        omit:{
            user:{
                password:true
            }
        }
    }
)


if(process.env.NODE_ENV==="production") global.prisma = prisma