import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/Navigation.css';

const Navigation = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Главная', icon: '🏠' },
    { path: '/attendance', label: 'Посещаемость', icon: '📅' },
    { path: '/certification', label: 'Аттестация', icon: '🥋' },
    { path: '/add-student', label: 'Добавить ученика', icon: '➕' },
    { path: '/students', label: 'Общая информация', icon: '📊' },
    { path: '/payments', label: 'Оплаты', icon: '💳' }
  ];

  return (
    <nav className="navigation">
      <div className="nav-brand">
        <h2>🥊 MMA Studio Admin</h2>
      </div>
      <ul className="nav-list">
        {navItems.map(item => (
          <li key={item.path} className="nav-item">
            <Link 
              to={item.path} 
              className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navigation;
