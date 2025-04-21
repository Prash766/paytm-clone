import { Route, Routes } from "react-router-dom"
import Login from "./pages/Login"
import Payment from "./pages/Payment"
import SignUp from "./pages/SignUp"
import { useState } from "react"

const App = () => {
  const [isLoggedIn , setIsLoggedIn] = useState(false)
  return (
    <Routes>
      <Route path="/login" element={<Login isLoggedIn={isLoggedIn} setIsLoggedIn={(status:boolean)=>setIsLoggedIn(status)}/>}/>
      <Route path="/signup" element={<SignUp/>}/>
      <Route path="/payment" element={<Payment isLoggedIn= {isLoggedIn}/>}/>
    </Routes>
  )
}

export default App