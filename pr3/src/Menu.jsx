import { NavLink } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { useCart } from './context/CartContext';

function Menu() {
  const { user, logout } = useAuth();
  const { totalCount } = useCart();

  const isAdmin = user && (user.role_id === 1 || user.role_title === 'Администратор');

  return (
    <header className="main-navbar">
      <div className="navbar-brand">
        <NavLink to="/available-services" className="brand-logo">
          Детейлинг-Салон
        </NavLink>
      </div>

      <nav className="navbar-links">
        <NavLink
          to="/available-services"
          className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
        >
          Каталог услуг
        </NavLink>

        <NavLink
          to="/cart"
          className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
        >
          Корзина {totalCount > 0 && <span className="nav-badge">{totalCount}</span>}
        </NavLink>

        {isAdmin && (
          <NavLink
            to="/categories"
            className={({ isActive }) => (isActive ? 'nav-link nav-link--admin active' : 'nav-link nav-link--admin')}
          >
            Админ-панель
          </NavLink>
        )}
      </nav>

      <div className="navbar-user">
        <div className="user-details">
          <span className="user-name">
            {user?.first_name ? `${user.first_name} ${user.second_name || ''}` : user?.email}
          </span>
          {user?.discount_percentage > 0 && (
            <span className="user-discount-tag">
              Скидка: {user.discount_percentage}%
            </span>
          )}
        </div>
        <button onClick={logout} className="btn-logout">
          Выйти
        </button>
      </div>
    </header>
  );
}

export default Menu;