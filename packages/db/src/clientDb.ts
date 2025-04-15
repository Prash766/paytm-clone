import { PrismaClient } from "../prisma-client-db/client-db";
declare global {
    var prismaClientDB:
      | PrismaClient<{ omit: { user: { password: true } } }>
      | undefined;
  }
  

export const prismaClientDB = globalThis.prismaClientDB || new PrismaClient(
    {
        omit:{
            user:{
                password:true
            }
        }
    }
)


if(process.env.NODE_ENV==="production") global.prismaClientDB = prismaClientDB