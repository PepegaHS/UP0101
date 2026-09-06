import { Link } from "react-router-dom";
import { productCards } from "./Data";
// import { ThemeContext } from "./ThemeContext"
// import { useContext } from "react";

function Dashboard() {
    // const { theme } = useContext(ThemeContext);

    return (
        <main className="dashboard">  

            <h1>Dashboard</h1>
            <p>Choose a product to view its details.</p>
            <div className="product-grid">
                {productCards.map((product) => (
                    <Link className="product-card" to={`/product/${product.id}`} key={product.id}>
                        <img src={product.img} alt={product.name} />
                        <h2>{product.name}</h2>
                        <p>${product.price}</p>
                    </Link>
                ))}
            </div>
        </main>
    );
}

export default Dashboard;
