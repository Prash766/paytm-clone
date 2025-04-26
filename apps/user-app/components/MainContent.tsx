"use client"
import { useAppSelector } from "@repo/store/redux"
import { RootState } from "@repo/store/store"
import TransferOnRamping from "./MainContentComponents/TransferOnRamping"
import Peer2PeerTransaction from "./MainContentComponents/Peer2PeerTransaction"

const MainContent = () => {
    const {activeSideBarItem}= useAppSelector((state:RootState)=> state.sideBarItemReducer)
  switch(activeSideBarItem.name){
    case "Transfer":
      return <TransferOnRamping/>
    case "P2PTransfer":
      return  <Peer2PeerTransaction/>
    
  }
}

export default MainContent