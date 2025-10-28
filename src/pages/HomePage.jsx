import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/HomePage.css';

const HomePage = () => {
  const quickActions = [
    {
      title: 'Посещаемость',
      description: 'Отметить посещаемость на тренировке',
      link: '/attendance',
      icon: '📅',
      color: '#4CAF50'
    },
    {
      title: 'Аттестация',
      description: 'Изменить пояс ученика',
      link: '/certification',
      icon: '🥋',
      color: '#FF9800'
    },
    {
      title: 'Добавить ученика',
      description: 'Зарегистрировать нового занимающегося',
      link: '/add-student',
      icon: '➕',
      color: '#2196F3'
    },
    {
      title: 'Общая информация',
      description: 'Просмотр и редактирование данных',
      link: '/students',
      icon: '📊',
      color: '#9C27B0'
    },
    {
      title: 'Оплаты',
      description: 'Просмотр оплат по людям и по датам',
      link: '/payments',
      icon: '💳',
      color: '#795548'
    }
  ];

  return (
    <div className="home-page">
      <div className="hero-section">
        <h1>Добро пожаловать в MMA Studio Admin</h1>
        <p>Система управления студией боевых искусств</p>
      </div>

      <div className="quick-actions">
        <h2>Быстрые действия</h2>
        <div className="actions-grid">
          {quickActions.map((action, index) => (
            <Link key={index} to={action.link} className="action-card">
              <div 
                className="action-icon" 
                style={{ backgroundColor: action.color }}
              >
                {action.icon}
              </div>
              <div className="action-content">
                <h3>{action.title}</h3>
                <p>{action.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
