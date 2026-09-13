import { useEffect, useState, useMemo } from 'react';
import { getServices } from '../api/services';
import { getServicesCategories } from '../api/services_categories';
import { getСategories } from '../api/categories';
import { getDiscounts } from '../api/discounts';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Services() {
  const { user } = useAuth();
  const { addToCart, cart } = useCart();

  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [serviceCategories, setServiceCategories] = useState([]);
  const [discounts, setDiscounts] = useState([]);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addingId, setAddingId] = useState(null);
  const [addMessage, setAddMessage] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [servicesData, categoriesData, linksData, discountsData] = await Promise.all([
        getServices(),
        getСategories(),
        getServicesCategories(),
        getDiscounts(),
      ]);

      setServices(servicesData);
      setCategories(categoriesData);
      setServiceCategories(linksData);
      setDiscounts(discountsData);
    } catch (err) {
      setError(err.message || 'Ошибка загрузки данных');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Personal user discount
  const userDiscount = useMemo(() => {
    if (!user || !user.discount_id) return null;
    const found = discounts.find(
      (d) => String(d.id_discount) === String(user.discount_id)
    );
    return found && found.percentage > 0 ? found : null;
  }, [user, discounts]);

  // Find promotional discount for a service
  const getServiceDiscount = (service) => {
    if (!service.discount_id) return null;
    const found = discounts.find(
      (d) => String(d.id_discount) === String(service.discount_id)
    );
    return found && found.percentage > 0 ? found : null;
  };

  // Find categories for a service
  const getServiceCategories = (service) => {
    return serviceCategories
      .filter((link) => String(link.service_id) === String(service.id_service))
      .map((link) =>
        categories.find(
          (category) => String(category.id_category) === String(link.category_id)
        )
      )
      .filter(Boolean);
  };

  // Calculate final discounted price
  const calculateFinalPrice = (basePrice, serviceDisc, userDisc) => {
    const original = parseFloat(basePrice) || 0;
    const servPct = serviceDisc ? Number(serviceDisc.percentage) : 0;
    const userPct = userDisc ? Number(userDisc.percentage) : 0;
    const effectivePct = Math.min(75, servPct + userPct);

    if (effectivePct === 0) {
      return { finalPrice: original, effectivePct: 0, hasDiscount: false };
    }

    const finalPrice = Math.round(original * (1 - effectivePct / 100));
    return { finalPrice, effectivePct, hasDiscount: true };
  };

  // Handle Category Checkbox Toggle
  const handleCategoryToggle = (categoryId) => {
    setSelectedCategoryIds((prev) => {
      if (prev.includes(categoryId)) {
        return prev.filter((id) => id !== categoryId);
      } else {
        return [...prev, categoryId];
      }
    });
  };

  const handleSelectAllCategories = () => {
    setSelectedCategoryIds([]);
  };

  // Filtered Services based on selected checkbox categories
  const filteredServices = useMemo(() => {
    if (selectedCategoryIds.length === 0) {
      return services;
    }

    return services.filter((service) => {
      const serviceCats = serviceCategories
        .filter((link) => String(link.service_id) === String(service.id_service))
        .map((link) => link.category_id);

      return selectedCategoryIds.some((selectedId) =>
        serviceCats.includes(selectedId)
      );
    });
  }, [services, serviceCategories, selectedCategoryIds]);

  const handleAddToCart = async (service) => {
    setAddingId(service.id_service);
    const res = await addToCart(service, 1);
    setAddingId(null);
    if (res.success) {
      setAddMessage(`«${service.title}» добавлена в корзину!`);
      setTimeout(() => setAddMessage(null), 3000);
    }
  };

  const getItemQuantityInCart = (serviceId) => {
    const item = cart?.find((ci) => String(ci.service_id) === String(serviceId));
    return item ? item.quantity : 0;
  };

  if (loading) {
    return (
      <div className="loading-state">
        <p>Загрузка каталога услуг с API...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-state">
        <p>Ошибка при загрузке каталога: {error}</p>
        <button onClick={loadData}>Повторить попытку</button>
      </div>
    );
  }

  return (
    <div className="services-page">
      <div className="catalog-header">
        <h1>Каталог услуг</h1>
        {userDiscount && (
          <div className="personal-discount-banner">
            <span>Ваш персональный купон: </span>
            <strong>{userDiscount.title} ({userDiscount.percentage}% скидка)</strong>
          </div>
        )}
      </div>

      {addMessage && <div className="alert-success">{addMessage}</div>}

      <div className="catalog-layout">
        {/* ASIDE */}
        <aside className="categories-aside">
          <div className="categories-aside__header">
            <h3>Категории</h3>
            {selectedCategoryIds.length > 0 && (
              <button
                type="button"
                className="btn-link"
                onClick={handleSelectAllCategories}
              >
                Сбросить
              </button>
            )}
          </div>

          <div className="categories-list">
            <label className="category-checkbox-item">
              <input
                type="checkbox"
                checked={selectedCategoryIds.length === 0}
                onChange={handleSelectAllCategories}
              />
              <span>Все категории ({services.length})</span>
            </label>

            {categories.map((cat) => {
              const count = serviceCategories.filter(
                (link) => String(link.category_id) === String(cat.id_category)
              ).length;
              const isChecked = selectedCategoryIds.includes(cat.id_category);

              return (
                <label key={cat.id_category} className="category-checkbox-item">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => handleCategoryToggle(cat.id_category)}
                  />
                  <span>{cat.title}</span>
                  <span className="category-count">({count})</span>
                </label>
              );
            })}
          </div>
        </aside>

        {/* MAIN CONTENT: SERVICES GRID */}
        <main className="catalog-main">
          <div className="catalog-summary">
            <span>Найдено услуг: {filteredServices.length}</span>
            {selectedCategoryIds.length > 0 && (
              <span className="filter-badge">
                Фильтр: {selectedCategoryIds.length} выбр.
              </span>
            )}
          </div>

          {filteredServices.length === 0 ? (
            <div className="empty-catalog">
              <p>Услуг по выбранным категориям не найдено.</p>
              <button onClick={handleSelectAllCategories}>Показать все услуги</button>
            </div>
          ) : (
            <div className="services-grid">
              {filteredServices.map((service) => {
                const serviceDisc = getServiceDiscount(service);
                const cats = getServiceCategories(service);
                const { finalPrice, hasDiscount } = calculateFinalPrice(
                  service.price,
                  serviceDisc,
                  userDiscount
                );
                const qtyInCart = getItemQuantityInCart(service.id_service);

                return (
                  <article className="service-card" key={service.id_service}>
                    <div className="service-card__body">
                      <h3>{service.title}</h3>

                      {cats.length > 0 && (
                        <div className="service-card__categories">
                          {cats.map((c) => (
                            <span key={c.id_category} className="category-tag">
                              {c.title}
                            </span>
                          ))}
                        </div>
                      )}

                      <p className="service-card__desc">{service.description}</p>

                      <div className="service-card__meta">
                        <span className="duration-label">
                          ⏱ {service.duration} мин.
                        </span>
                      </div>

                      <div className="service-card__pricing">
                        {hasDiscount ? (
                          <>
                            <span className="price-original">
                              {parseFloat(service.price).toLocaleString()} ₽
                            </span>
                            <span className="price-final">
                              {finalPrice.toLocaleString()} ₽
                            </span>
                            <div className="discount-badges">
                              {serviceDisc && (
                                <span className="discount-badge discount-badge--service">
                                  Акция: -{serviceDisc.percentage}%
                                </span>
                              )}
                              {userDiscount && (
                                <span className="discount-badge discount-badge--user">
                                  Купон: -{userDiscount.percentage}%
                                </span>
                              )}
                            </div>
                          </>
                        ) : (
                          <span className="price-final">
                            {parseFloat(service.price).toLocaleString()} ₽
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="service-card__footer">
                      <button
                        className="btn-add-cart"
                        onClick={() => handleAddToCart(service)}
                        disabled={addingId === service.id_service}
                      >
                        {addingId === service.id_service ? 'Добавление...' : 'В корзину'}
                      </button>
                      {qtyInCart > 0 && (
                        <span className="cart-qty-indicator">В корзине: {qtyInCart} шт.</span>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}