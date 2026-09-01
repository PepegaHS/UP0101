import './App.css'
// import {useState} from "react"; 
// import Counter from './Counter';
// import FormExample from './FormExample';
import ProductCard from './ProductCard';
function App() {
    // const [message, setMessage] = useState("Нажми кнопку")
    // function handleClick() {
    //   setMessage("Кнопка была нажата")
    // }
    // function hello() {
    //   const name="Alex";
    //   return <h1>Привет, {name}</h1>
    // }
    return (
      <div className="container" 
      style={{ textAlign:"center", marginTop: "50px"}} >
        {/* <h1>{message}</h1>
        <button onClick={handleClick}></button>
        <h1>{hello()}</h1> */}
        {/* {Counter()}
        {FormExample()} */}
        <ProductCard name='ThinkPad P1 Gen 8' price={4189} image='https://p1-ofp.static.pub//fes/cms/2025/08/20/ytzcrqgef33bsk0weernzrogbdla94945728.png?width=584&height=584'/>
        <ProductCard name='ThinkPad P14s Gen 7 (Intel)' price={2289} image='https://p3-ofp.static.pub/ShareResource/optimized/pdp/thinkpad/thinkpad-p-series/len101t0169/lenovo-thinkpad-p14s-gen-7-14-intel-pdp-hero.png?width=584&height=584'/>
      </div>
    )
}

export default App