import { NavLink } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { useTheme } from './context/ThemeContext';

function AdminPanel() {
  const { logout, user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="admin-panel">
      <div className="admin-panel__header">
        <h2>Админ-панель</h2>
        <span className="admin-badge">Администратор</span>
      </div>

      <div className="admin-panel__section">
        <span className="admin-section-title">Витрина</span>
        <NavLink
          to="/available-services"
          className={({ isActive }) => (isActive ? 'nav-link active store-link' : 'nav-link store-link')}
        >
          Каталог услуг
        </NavLink>
      </div>

      <div className="admin-panel__section">
        <span className="admin-section-title">Управление данными</span>
        <NavLink to="/categories" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
          Категории
        </NavLink>
        <NavLink to="/services" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
          Услуги
        </NavLink>
        <NavLink to="/discounts" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
          Скидки
        </NavLink>
        <NavLink to="/users" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
          Пользователи
        </NavLink>
        <NavLink to="/service-categories" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
          Связи услуг и категорий
        </NavLink>
        <NavLink to="/appointments" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
          Записи
        </NavLink>
        <NavLink to="/appointments-services" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
          Услуги в записях
        </NavLink>
        <NavLink to="/carts" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
          Корзины
        </NavLink>
        <NavLink to="/carts-items" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
          Элементы корзин
        </NavLink>
        <NavLink to="/payments" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
          Платежи
        </NavLink>
        <NavLink to="/roles" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
          Роли
        </NavLink>
      </div>

      <div className="admin-panel__user">
        <span className="user-email-text">{user?.email}</span>
        <button type="button" onClick={toggleTheme} className="theme-toggle">
          {theme === 'light' ? 'Темная тема' : 'Светлая тема'}
        </button>
        <button onClick={logout} className="admin-panel__logout">
          Выйти
        </button>
      </div>
    </nav>
  );
}

export default AdminPanel;