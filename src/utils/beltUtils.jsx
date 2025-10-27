import React from 'react';

// Компонент для отображения пояса
export const BeltDisplay = ({ belt }) => {
  const getBeltClass = (beltName) => {
    return `belt belt-${beltName.toLowerCase().replace(/\s+/g, '-')}`;
  };

  return (
    <span className={getBeltClass(belt)}>
      {belt}
    </span>
  );
};

// Функция для получения CSS класса пояса
export const getBeltClass = (beltName) => {
  return `belt-${beltName.toLowerCase().replace(/\s+/g, '-')}`;
};
