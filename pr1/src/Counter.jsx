import { useState } from 'react'

function Counter(){
    const [count, setCount] = useState(0);

    return (
        <div>
            <p>Счетчик: {count}</p>
            <button onClick={() => setCount(count + 1)}>+</button>
            <button onClick={() => setCount(count - 1)}>-</button>
            <button onClick={() => setCount(0)}>Сбросить</button>
        </div>
    );
}

export default Counter;