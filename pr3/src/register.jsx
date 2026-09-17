import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createUser } from './api/users';
import { useTheme } from './context/ThemeContext';

function Register() {
  const [formData, setFormData] = useState({
    second_name: '',
    first_name: '',
    middle_name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const validateForm = () => {
    const errors = {};
    const trimmedEmail = formData.email.trim();

    if (!formData.second_name.trim()) {
      errors.second_name = 'Фамилия обязательна';
    }

    if (!formData.first_name.trim()) {
      errors.first_name = 'Имя обязательно';
    }

    if (!trimmedEmail) {
      errors.email = 'Email обязателен';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      errors.email = 'Введите корректный email';
    }

    if (!formData.password) {
      errors.password = 'Пароль обязателен';
    } else if (formData.password.length < 4) {
      errors.password = 'Пароль должен содержать не менее 4 символов';
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Подтвердите пароль';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Пароли не совпадают';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      await createUser({
        role_id: 2,
        second_name: formData.second_name.trim(),
        first_name: formData.first_name.trim(),
        middle_name: formData.middle_name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        discount_id: 1,
      });

      setSuccess('Регистрация прошла успешно. Сейчас вы будете перенаправлены на страницу входа.');
      setFormData({
        second_name: '',
        first_name: '',
        middle_name: '',
        email: '',
        password: '',
        confirmPassword: '',
      });
      setFieldErrors({});

      setTimeout(() => navigate('/login', { replace: true }), 1200);
    } catch (err) {
      const message = err instanceof TypeError && err.message === 'Failed to fetch'
        ? 'Не удалось подключиться к серверу.'
        : err.message || 'Ошибка регистрации';

      if (message.toLowerCase().includes('email')) {
        setFieldErrors((prev) => ({ ...prev, email: 'Пользователь с таким email уже существует' }));
        return;
      }

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <button type="button" onClick={toggleTheme} className="login-theme-toggle">
          {theme === 'light' ? 'Темная тема' : 'Светлая тема'}
        </button>

        <h2>Регистрация</h2>

        {error && <div className="alert-error">{error}</div>}
        {success && <div className="alert-success">{success}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="second_name">Фамилия</label>
            <input
              id="second_name"
              type="text"
              name="second_name"
              value={formData.second_name}
              onChange={handleChange}
              className={fieldErrors.second_name ? 'input-error' : ''}
              disabled={loading}
            />
            {fieldErrors.second_name && <span className="field-error-text">{fieldErrors.second_name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="first_name">Имя</label>
            <input
              id="first_name"
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              className={fieldErrors.first_name ? 'input-error' : ''}
              disabled={loading}
            />
            {fieldErrors.first_name && <span className="field-error-text">{fieldErrors.first_name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="middle_name">Отчество</label>
            <input
              id="middle_name"
              type="text"
              name="middle_name"
              value={formData.middle_name}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
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
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={fieldErrors.password ? 'input-error' : ''}
              disabled={loading}
            />
            {fieldErrors.password && <span className="field-error-text">{fieldErrors.password}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Подтверждение пароля</label>
            <input
              id="confirmPassword"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={fieldErrors.confirmPassword ? 'input-error' : ''}
              disabled={loading}
            />
            {fieldErrors.confirmPassword && <span className="field-error-text">{fieldErrors.confirmPassword}</span>}
          </div>

          <button type="submit" className="login-submit" disabled={loading}>
            {loading ? 'Регистрация...' : 'Зарегистрироваться'}
          </button>
        </form>

        <div style={{ marginTop: '12px', textAlign: 'center' }}>
          <Link to="/login" className="btn-secondary btn-sm">Уже есть аккаунт? Войти</Link>
        </div>
      </div>
    </div>
  );
}

export default Register;