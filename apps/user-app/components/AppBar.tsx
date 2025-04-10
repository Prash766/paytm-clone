"use client"
import { Button } from "@repo/ui/ui";
import { signIn, signOut, useSession } from "next-auth/react";

const AppBar = () => {
  const session = useSession();
  return (
    <div className="min-w-full h-14 grid grid-cols-12 bg-gray-100 ">
      <div className="font-bold text-lg text-blue-600 col-span-3 cursor-pointer my-auto ml-2">Paytm</div>
      <div className="col-span-9 justify-items-end mr-10 my-auto">
        <div className="">
          {session.status === "authenticated" ? (
            <Button variant="destructive" className="cursor-pointer" onClick={() => signOut()}>Logout</Button>
          ) : (
            <Button variant="destructive" className="cursor-pointer" onClick={() => signIn()}>Sign In</Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppBar;
