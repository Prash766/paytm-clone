"use client"
import { LucideIcon } from "lucide-react"
import IconComponent from "./IconComponent"
import { useState } from "react";

const SideBarItems = ({ item }: { item: { name: string; icon: LucideIcon | string } }) => {
    const [isFocused , setIsFocused] = useState(false)
  return (
    <button
    onClick={()=> setIsFocused(prev=> !prev)}
    key={item.name}
    className={`flex items-center gap-3 px-4 py-3 text-left text-sm font-medium ${isFocused ? "bg-white shadow-sm rounded-2xl" : ""} hover:rounded-2xl ${!isFocused?"hover:bg-gray-200 ":""}}`}
  >
    <IconComponent isFocused={isFocused} Icon={item.icon} className="h-5 w-5 text-gray-500" />
    {item.name}
  </button>
  )
}

export default SideBarItems