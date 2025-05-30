import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Homepage from "./pages/homepage";
import ContactPage from "./pages/contactpage";
import ProductListPage from "./pages/productpage";
import Register from "./pages/Register";
import Login from "./pages/login";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} /> 
        
        {/* 👇 Cho phép tất cả URL con của /products/ đều dùng chung 1 trang */}
        <Route path="/products/*" element={<ProductListPage />} />
      </Routes>
    </Router>
  );
};

export default App;
