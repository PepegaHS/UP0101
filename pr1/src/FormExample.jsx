import { useState } from 'react'

function FormExample() {
    const [text, setText] = useState("");

    function handleChange(e) {
        setText(e.target.value);
    }

    function handleSubmit(e) {
        e.preventDefault();
        alert('Отправлено: ${text}');
    }

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" value={text} onChange={handleChange} />
            <button type="submit">Отправить</button>
        </form>
    );
}

export default FormExample