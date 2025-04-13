"use client"

import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"

const DashBoardTopBar = () => {
    const session = useSession()
    const [date , setDate] = useState<string>("")
    useEffect(()=>{
        const date = new Date()
        const formattedDate = date.toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })
          setDate(formattedDate)
    },[setDate ])
  return (
    <div className="w-full font-text">
    <h1 className="font-semibold text-xl">Hey, {session.data?.user.name} !</h1>
    <p className="text-sm text-gray-600">
        {date}
    </p>
    </div>
  )
}

export default DashBoardTopBar