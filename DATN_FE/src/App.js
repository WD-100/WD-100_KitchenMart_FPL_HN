import './App.css';
import Public from './Public/Public';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import {CartProvider} from "./Public/Components/store/CartContext";

function App() {
    return (<CartProvider>
            <Public/>
        </CartProvider>);
}

export default App;
