"use client"
import IconComponent from "./IconComponent"
import { SIDEBAR_ITEMS_TYPE } from "../helper/constants"
import { useAppDispatch } from "@repo/store/redux"
import { setActiveSideBarItem } from "@repo/store/sidebarslice"

const SideBarItems = ({
  item,
  activeSidebarItem,
  setActiveSidebarItem,
}: {
  item: SIDEBAR_ITEMS_TYPE
  activeSidebarItem: number
  setActiveSidebarItem: (item: SIDEBAR_ITEMS_TYPE) => void
}) => {

  const dispatch = useAppDispatch()

  return (
    <button
      onClick={() => {
        setActiveSidebarItem(item)
        dispatch(setActiveSideBarItem(item))
      }}
      key={item.name}
      className={`flex cursor-pointer items-center gap-3 px-4 py-3 text-left text-sm font-medium ${
        activeSidebarItem===item.key ? "bg-white shadow-sm rounded-2xl" : ""
      } hover:rounded-2xl ${activeSidebarItem!==item.key ? "hover:bg-gray-300" : ""}`}
    >
      <IconComponent isFocused={activeSidebarItem===item.key} Icon={item.icon} className="h-5 w-5 text-gray-500" />
      {item.name}
    </button>
  )
}

export default SideBarItems
