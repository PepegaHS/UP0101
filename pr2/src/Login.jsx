import { useNavigate } from "react-router-dom";

export default function Login() {
    const navigate = useNavigate();

    function handleLogin(){
        const isAuth = true;

        if (isAuth) {
            navigate("/dashboard")
        } else {
            alert("Ошибка авторизации")
        }
    }

    return (
        <div>
            <h2>Login</h2>
            <button onClick={handleLogin}>CLICK IT</button>
        </div>
    )
}