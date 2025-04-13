// "use client"

// import { useSession } from "next-auth/react"
// import ProfileCard from "./ProfileCard"
// import { Separator } from "@repo/ui/ui"

// const SideBar = ({ className }: { className: string }) => {
//     const session = useSession()
//     return (
//         <div className={className}>
//             <ProfileCard className="mt-4" bg_color="#000000" email={session.data?.user.email!} initialName={session.data?.user.name!} profileType="random" />
//             <div className="">
//             <Separator decorative  orientation="horizontal"/>

//             </div>
//         </div>
//     )
// }

// export default SideBar

// SideBar.tsx
"use client"

import { useSession } from "next-auth/react"
import ProfileCard from "./ProfileCard"
import { SIDEBAR_ITEMS, SIDEBAR_ITEMS_TYPE } from "../helper/constants"
import SideBarItems from "./SideBarItems"
import { SearchIcon } from "lucide-react"
import { Separator } from "@repo/ui/ui"
import { useState } from "react"

const SideBar = ({ className }: { className?: string }) => {
  const session = useSession()
  const [isFocused , setIsFocused] = useState(false)
  const [activeSidebarItem  , setActiveSidebarItem] = useState<number>(1)

  const handleClick = (item: SIDEBAR_ITEMS_TYPE) => {
    if (activeSidebarItem !== item.key) {
      setActiveSidebarItem(item.key);
    }
  }

  
  return (
    <div className={` font-text flex flex-col h-full bg-gray-100 ${className}`}>
      <div className="p-1">
        <ProfileCard 
          email={session.data?.user?.email || "hey@kevdu.co"} 
          initialName={session.data?.user?.name || "Kevin Dukkon"} 
          profileType="initials" 
        />
      <Separator className="bg-gray-300 my-2" orientation="horizontal"/>
      </div>
      
      <div className="px-1 py-2">
        <div className="relative mt-2">
          <input
            type="text"
            placeholder="Search"
            className="w-full rounded-xl bg-gray-200 px-8 py-2 focus:outline-none focus:ring-none text-sm"
          />
          <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 "/>
          <span className="absolute right-3 top-2 text-sm text-gray-400">/</span>
        </div>
      </div>
      
      <nav className="mt-2 flex flex-col">
        {SIDEBAR_ITEMS.map((item , index) => (
            <SideBarItems activeSidebarItem={activeSidebarItem} setActiveSidebarItem={(item:SIDEBAR_ITEMS_TYPE)=>handleClick(item)}  key={index} item={item}/>
        ))}
      </nav>
    </div>
  )
}

// Simple icon component to match the design


export default SideBar