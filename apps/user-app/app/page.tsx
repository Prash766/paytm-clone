'use client';
import { Separator } from "@repo/ui/ui";
// import { useSession } from "next-auth/react";
import SideBar from "../components/SideBar";

export default function Home() {
  // const session = useSession()

  return (
    <main className="bg-gray-300 min-h-screen p-6">
      <div 
        className="grid grid-cols-12 h-[calc(100vh-100px)] 
                   bg-[#F5F7F9] border border-gray-300 
                   rounded-2xl shadow-lg"
      >
        <SideBar className="col-span-2 p-2" />
        <div className="col-span-10 p-4">
          <div className="bg-white shadow-xl h-[calc(100vh-140px)] rounded-4xl p-4">
            <div>
              
            <Separator className="bg-gray-300 my-2" orientation="horizontal"/>

            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
