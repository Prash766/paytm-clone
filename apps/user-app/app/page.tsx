'use client';
import {  signIn, signOut, useSession } from "next-auth/react";

export default function Home() {
  const session = useSession()
  return (
    <div className="bg-gray-700 h-screen text-white ">
    {
      session.status==="authenticated" ? 
      (
        <>
      <div>
        {JSON.stringify(session.data.user)}  
      </div>
      <button onClick={()=> signOut()}>logout</button>
        </>
      )
      :
       <button onClick={()=>signIn()}>sign in</button>
    }
    </div>
  );
}
