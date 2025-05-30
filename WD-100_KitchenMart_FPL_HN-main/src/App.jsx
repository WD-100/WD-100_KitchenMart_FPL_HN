import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Homepage from "./pages/homepage";
import ContactPage from "./pages/contactpage";
import ProductListPage from "./pages/productpage";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/contact" element={<ContactPage />} />
        
        {/* 👇 Cho phép tất cả URL con của /products/ đều dùng chung 1 trang */}
        <Route path="/products/*" element={<ProductListPage />} />
      </Routes>
    </Router>
  );
};

export default App;
