import {useState} from "react"; 

function ProductCard({name, price, image}) {

    const [amt, setAmt] = useState(0);

    function handleAddToCart() {
        setAmt(amt + 1);
    }

    return (
        <div>
            <h2>{name}</h2>
            <img src={image} alt={name} />
            <p>${price}</p>
            <p>В корзине: {amt}</p>
            <button onClick={handleAddToCart}>Добавить в корзину</button>
        </div>
    )
}

export default ProductCard;