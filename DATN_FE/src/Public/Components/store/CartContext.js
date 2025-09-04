// store/CartContext.js
import {createContext, useContext, useState, useEffect} from "react";
import cartService from "../Service/CartService";

const CartContext = createContext();

export function CartProvider({children}) {
    const [cartCount, setCartCount] = useState(0);

    useEffect(() => {
        const user_id = sessionStorage.getItem("user_id");
        if (user_id) {
            cartService.listCart().then((res) => {
                setCartCount(res.data.data.length);
            });
        }
    }, []);

    return (
        <CartContext.Provider value={{cartCount, setCartCount}}>
            {children}
        </CartContext.Provider>
    );
}

export const useCart = () => useContext(CartContext);
