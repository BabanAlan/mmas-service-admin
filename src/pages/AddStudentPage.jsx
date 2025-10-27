import React, { useState } from 'react';
import { mockStudios, mockBelts, addStudent, studioAbbreviations, generateMmasId } from '../data/mockData';
import './AddStudentPage.css';

const AddStudentPage = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    belt: 'Белый',
    birthDate: '',
    mmasId: '',
    studio: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'ФИО обязательно для заполнения';
    }
    
    if (!formData.birthDate) {
      newErrors.birthDate = 'Дата рождения обязательна';
    }
    
    if (!formData.mmasId.trim()) {
      newErrors.mmasId = 'MMAS-ID обязателен';
    } else if (!/^[А-Яа-я]{2}\d{4}$/.test(formData.mmasId)) {
      newErrors.mmasId = 'MMAS-ID должен быть в формате ТС0001 (сокращение студии + 4 цифры)';
    }
    
    if (!formData.studio) {
      newErrors.studio = 'Студия обязательна';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Очищаем ошибку при изменении поля
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    
    // Автоматически генерируем mmas-id при выборе студии
    if (name === 'studio' && value && !formData.mmasId) {
      try {
        const generatedId = generateMmasId(value);
        setFormData(prev => ({
          ...prev,
          [name]: value,
          mmasId: generatedId
        }));
      } catch (error) {
        console.error('Ошибка генерации MMAS-ID:', error);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    try {
      await addStudent(formData);
      alert('Ученик успешно добавлен!');
      setFormData({
        fullName: '',
        belt: 'Белый',
        birthDate: '',
        mmasId: '',
        studio: ''
      });
    } catch (error) {
      console.error('Ошибка добавления:', error);
      alert('Ошибка при добавлении ученика');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateMmasId = () => {
    if (!formData.studio) {
      alert('Сначала выберите студию');
      return;
    }
    
    try {
      const generatedId = generateMmasId(formData.studio);
      setFormData(prev => ({
        ...prev,
        mmasId: generatedId
      }));
    } catch (error) {
      console.error('Ошибка генерации MMAS-ID:', error);
      alert('Ошибка генерации MMAS-ID');
    }
  };

  return (
    <div className="add-student-page">
      <h1>Добавить нового ученика</h1>
      
      <div className="form-container">
        <form onSubmit={handleSubmit} className="student-form">
          <div className="form-group">
            <label htmlFor="fullName">ФИО *</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              placeholder="Введите полное имя"
              className={errors.fullName ? 'error' : ''}
            />
            {errors.fullName && <span className="error-message">{errors.fullName}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="belt">Пояс</label>
            <select
              id="belt"
              name="belt"
              value={formData.belt}
              onChange={handleInputChange}
            >
              {mockBelts.map(belt => (
                <option key={belt} value={belt}>{belt}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="birthDate">Дата рождения *</label>
            <input
              type="date"
              id="birthDate"
              name="birthDate"
              value={formData.birthDate}
              onChange={handleInputChange}
              className={errors.birthDate ? 'error' : ''}
            />
            {errors.birthDate && <span className="error-message">{errors.birthDate}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="mmasId">MMAS-ID *</label>
            <div className="mmas-id-input">
              <input
                type="text"
                id="mmasId"
                name="mmasId"
                value={formData.mmasId}
                onChange={handleInputChange}
                placeholder="ТС0001"
                className={errors.mmasId ? 'error' : ''}
                style={{ textTransform: 'uppercase' }}
              />
              <button
                type="button"
                onClick={handleGenerateMmasId}
                className="generate-btn"
              >
                Сгенерировать
              </button>
            </div>
            {errors.mmasId && <span className="error-message">{errors.mmasId}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="studio">Студия *</label>
            <select
              id="studio"
              name="studio"
              value={formData.studio}
              onChange={handleInputChange}
              className={errors.studio ? 'error' : ''}
            >
              <option value="">Выберите студию</option>
              {mockStudios.map(studio => (
                <option key={studio} value={studio}>{studio}</option>
              ))}
            </select>
            {errors.studio && <span className="error-message">{errors.studio}</span>}
          </div>

          <div className="form-actions">
            <button
              type="submit"
              className="submit-btn"
              disabled={loading}
            >
              {loading ? 'Добавление...' : 'Добавить ученика'}
            </button>
            
            <button
              type="button"
              onClick={() => setFormData({
                fullName: '',
                belt: 'Белый',
                birthDate: '',
                mmasId: '',
                studio: ''
              })}
              className="reset-btn"
            >
              Очистить форму
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddStudentPage;
