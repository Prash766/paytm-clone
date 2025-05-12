import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import {prismaClientDB} from '@repo/db/user_client'

export default async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { number, password, email, name } = body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prismaClientDB.user.findFirst({
      where: {
        email: email,
      },
    });
    if (user) {
      return NextResponse.json({
        message: "User Already Exists",
      });
    }

    const newUser = await prismaClientDB.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        number,
      },
    });
    const newAccount = await prismaClientDB.balance.create({
      data:{
        userId:newUser.id,
        
      }
    })
    return NextResponse.json({
      message: "User Signed Up successfully",
      user: newUser,
    });
  } catch (error) {
    console.log(error);
  }
}
