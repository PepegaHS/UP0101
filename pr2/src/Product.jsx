import { useParams } from "react-router-dom";
import { useContext } from "react";
import { CartContext } from "./CartContext";
import { useNavigate } from "react-router-dom";
import { productCards } from "./Data";

function Product() {
    const { id } = useParams();
    const product = productCards.find(p => p.id === parseInt(id));
    const navigate = useNavigate();
    const { dispatch } = useContext(CartContext);

    function handleAddToCart() {
        dispatch({ type: 'ADD_TO_CART', product });
        alert(`${product.name} (ID: ${id}) has been added to your cart!`);
        navigate('/cart');
    }

    return (
        <div>
            <h2>Product ID: {id}</h2>
            <p>{product.name}</p>
            <img src={product.img} alt={product.name} />
            <p>Price: ${product.price}</p>
            <button onClick={handleAddToCart}>Add to Cart</button>
        </div>
    );
}

export default Product;
