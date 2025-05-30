import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation.jsx';
import Login from './pages/login';
import Register from './pages/Register';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/Checkout" element={<Checkout/>} />
         <Route path="/OrderConfirmation" element={<OrderConfirmation/>} />
         <Route path="/Login" element={<Login/>} />
         <Route path="/Register" element={<Register/>} />
      </Routes>
    </Router>
  );
}

export default App;