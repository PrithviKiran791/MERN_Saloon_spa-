import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import Homepage from "@/pages/public/home";
import Loginpage from "./pages/public/login";
import Registerpage from "./pages/public/register";

import "./index.css";

function App() {
  return (
      <BrowserRouter>
      <Routes>
        <Route path ="/home" element={<Homepage/>}></Route>
        <Route path="/login" element={<Loginpage/>}></Route>
        <Route path="/register" element={<Registerpage/>}></Route>
        </Routes>
      </BrowserRouter>
  );
}

export default App;
