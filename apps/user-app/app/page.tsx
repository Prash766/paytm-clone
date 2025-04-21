"use client";
import { Separator } from "@repo/ui/ui";
// import { useSession } from "next-auth/react";
import SideBar from "../components/SideBar";
import DashBoardTopBar from "../components/DashBoardTopBar";
import MainContent from "../components/MainContent";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useAppDispatch } from "@repo/store/redux";
import { setActiveSideBarItem } from "@repo/store/sidebarslice";

export default function Home() {

  // const session = useSession()

  return (
      <div
        className="font-text grid grid-cols-12 lg:min-h-screen 
                   bg-[#F5F7F9] border border-gray-300 
                   rounded-2xl shadow-lg"
      >
        <SideBar className="col-span-2 p-2" />
        <div className="col-span-10 p-4">
          <div className="bg-white shadow-xl lg:min-h-screen rounded-4xl p-4">
            <div>
              <DashBoardTopBar />
              <Separator
                className="bg-gray-300 my-5"
                orientation="horizontal"
              />
              <MainContent/>
            </div>
          </div>
        </div>
      </div>
  );
}
