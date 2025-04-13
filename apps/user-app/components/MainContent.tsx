import { useAppSelector } from "@repo/store/redux"
import { RootState } from "@repo/store/store"
import TransferOnRamping from "./MainContentComponents/TransferOnRamping"

const MainContent = () => {
    const {activeSideBarItem}= useAppSelector((state:RootState)=> state.sideBarItemReducer)
  switch(activeSideBarItem.name){
    case "Transfer":
      return <TransferOnRamping/>
    
  }
}

export default MainContent