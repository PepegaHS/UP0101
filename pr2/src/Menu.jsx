import { NavLink } from "react-router-dom";
import { useContext } from "react";
import ThemeContext from "./ThemeContext";

function Menu() {
    const { theme, toggleTheme } = useContext(ThemeContext);
    return ( 
        <nav className="main-nav">
            <NavLink to="/" end className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                Main
                </NavLink>

            <NavLink to="/about" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                About us
                </NavLink>

            <NavLink to="/product/1" className="nav-link">Product 1</NavLink>
            <NavLink to="/product/2" className="nav-link">Product 2</NavLink>
            <NavLink to="/product/3" className="nav-link">Product 3</NavLink>
            <NavLink to="/product/4" className="nav-link">Product 4</NavLink>
            <NavLink to="/product/5" className="nav-link">Product 5</NavLink>

            <NavLink to="/login" className="nav-link">Login</NavLink>
            <NavLink to="/dashboard" className="nav-link">Dashboard</NavLink>
            <NavLink to="/cart" className="nav-link">Cart</NavLink>
            
            <button onClick={toggleTheme} style={{ marginLeft: '10px' }}>
                Toggle theme (Current: {theme})
            </button>
        </nav>

    );
}

export default Menu;
