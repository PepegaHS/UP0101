import { useContext } from "react";
import { CartContext } from "./CartContext";

function Cart() {
    const { cart } = useContext(CartContext);
    const { dispatch } = useContext(CartContext);
    return (
        <div>
            <h1>Cart</h1>
            {cart.length === 0 ? (
                <p>Your cart is empty.</p>
            ) : (
                <ul>
                    {cart.map((item) => (
                        <li key={item.id}>
                            <img src={item.img} alt={item.name} />
                            <h2>{item.name}</h2>
                            <p>${item.price}</p>
                            <button onClick={() => dispatch({ 
                                type: 'REMOVE_FROM_CART', 
                                productId: item.id }
                                )}>Remove from Cart</button>
                        </li>
                        ))
                    }
                    <button onClick={() => dispatch({ type: 'DELETE_CART' })}>Delete All Items</button>
                    <h1> Total: ${cart.reduce((total, item) => total + item.price, 0)}</h1>
                </ul>
                
            )}
        </div>
    )
}

export default Cart;
