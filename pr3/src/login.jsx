import { useState } from 'react';
import { useAuth } from './context/AuthContext';
import { loginUser } from './api/users';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const validateForm = () => {
    const errors = {};
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      errors.email = 'Поле Email обязательно для заполнения';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      errors.email = 'Введите корректный адрес электронной почты';
    }

    if (!password) {
      errors.password = 'Поле Пароль обязательно для заполнения';
    } else if (password.length < 4) {
      errors.password = 'Пароль должен содержать не менее 4 символов';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const userData = await loginUser(email.trim(), password);
      login(userData);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Неверный email или пароль');
    } finally {
      setLoading(false);
    }
  };

  const fillTestAccount = (testEmail, testPass) => {
    setEmail(testEmail);
    setPassword(testPass);
    setFieldErrors({});
    setError('');
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Вход в систему</h2>

        {error && <div className="alert-error">{error}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (fieldErrors.email) setFieldErrors((prev) => ({ ...prev, email: null }));
              }}
              className={fieldErrors.email ? 'input-error' : ''}
              disabled={loading}
            />
            {fieldErrors.email && <span className="field-error-text">{fieldErrors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Пароль</label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (fieldErrors.password) setFieldErrors((prev) => ({ ...prev, password: null }));
              }}
              className={fieldErrors.password ? 'input-error' : ''}
              disabled={loading}
            />
            {fieldErrors.password && <span className="field-error-text">{fieldErrors.password}</span>}
          </div>

          <button type="submit" disabled={loading} style={{ width: '100%', marginTop: '10px' }}>
            {loading ? 'Вход...' : 'Войти'}
          </button>
        </form>

        <div className="test-accounts-hint">
          <p>Быстрый вход для тестирования:</p>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => fillTestAccount('isip_v.yu.skorbilin@mpt.ru', 'admin123')}
              className="btn-secondary btn-sm"
            >
              Администратор
            </button>
            <button
              type="button"
              onClick={() => fillTestAccount('ivan.petrov@mail.ru', '123456')}
              className="btn-secondary btn-sm"
            >
              Клиент (Иван)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
