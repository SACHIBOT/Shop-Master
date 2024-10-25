import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "./pages/Home"

import "./App.css"
import Categories from "./pages/Categories"
import Login from "./pages/Login"
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from "./context/AuthContext"
import Items from "./pages/Items"
import Users from "./pages/Users"

function App() {

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<ProtectedRoute />} >
            <Route path="/" element={<Home />} />
            <Route path="/items" element={<Items />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/users" element={<Users />} />
          </Route>
          <Route path="/login" element={<Login />}></Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
