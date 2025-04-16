import { Route, Routes } from "react-router-dom"
import Login from "./pages/Login"
import Payment from "./pages/Payment"
import SignUp from "./pages/SignUp"

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login/>}/>
      <Route path="/signup" element={<SignUp/>}/>
      <Route path="/payment" element={<Payment/>}/>
    </Routes>
  )
}

export default App