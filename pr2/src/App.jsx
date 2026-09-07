import { BrowserRouter, Routes, Route, } from "react-router-dom";
import { useState } from 'react';
import './App.css'

import Home from './Home';
import About from './About';
import Product from './Product';
import Menu from "./Menu";
import Login from './Login';
import Dashboard from './Dashboard';
import Cart from './Cart';

import ThemeContext from "./ThemeContext";
import { CartProvider } from "./CartContext";

function App() {
  const[theme, setTheme] = useState('light');

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    document.documentElement.classList.toggle('dark', nextTheme === 'dark');
  };

  const appStyle = {
    backgroundColor: theme === 'light' ? '#fff' : '#16171d',
    color: theme === 'light' ? '#242424' : '#fff',
    minHeight: '100vh',
    padding: '20px',
  };
  

  return (
   <ThemeContext.Provider value={{ theme, toggleTheme }}>
    <CartProvider>
      <div className={`app ${theme}`} style={appStyle}>
          <BrowserRouter>
          <Menu />
          
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/product/:id" element={<Product />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/cart" element={<Cart />} />
          </Routes>
        </BrowserRouter>

        <div className="app-footer" style={{ margin: '20px', color: theme === 'light' ? '#000' : '#fff' }}>
            <p>© 2026 PepegaHS</p>
            <a href="mailto:isip_v.yu.skorbilin@mpt.ru">
                <img style={{ width: '20px', height: '20px' }} src="https://upload.wikimedia.org/wikipedia/commons/8/8f/Gmail_icon_%282026%29.svg?utm_source=en.wikipedia.org&utm_campaign=index&utm_content=original" alt="Email" />
            </a>
            <a href="https://github.com/PepegaHS/UP0101">
                <img style={{ width: '20px', height: '20px' }} src="https://cdn-icons-png.flaticon.com/256/25/25231.png" alt="GitHub" />
            </a>
          </div>
    
      </div>
    </CartProvider>
    </ThemeContext.Provider>

    
  );
}

export default App
