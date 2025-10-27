import React, { useState, useEffect } from 'react';
import { mockStudents, mockBelts, updateStudent, deleteStudent } from '../data/mockData';
import { BeltDisplay } from '../utils/beltUtils';
import './StudentsPage.css';

const StudentsPage = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('fullName');
  const [sortDirection, setSortDirection] = useState('asc');
  const [beltFilter, setBeltFilter] = useState('');
  const [studioFilter, setStudioFilter] = useState('');
  const [editingStudent, setEditingStudent] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setStudents(mockStudents);
    setFilteredStudents(mockStudents);
  }, []);

  useEffect(() => {
    let filtered = students.filter(student => {
      const matchesSearch = student.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           student.mmasId.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesBelt = !beltFilter || student.belt === beltFilter;
      const matchesStudio = !studioFilter || student.studio === studioFilter;
      
      return matchesSearch && matchesBelt && matchesStudio;
    });

    filtered.sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];
      
      // Специальная обработка для дат
      if (sortField === 'birthDate') {
        aVal = new Date(aVal);
        bVal = new Date(bVal);
      } else if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }
      
      if (sortDirection === 'asc') {
        return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
      } else {
        return aVal < bVal ? 1 : aVal > bVal ? -1 : 0;
      }
    });

    setFilteredStudents(filtered);
  }, [students, searchTerm, sortField, sortDirection, beltFilter, studioFilter]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleEdit = (student) => {
    setEditingStudent({ ...student });
  };

  const handleSave = async () => {
    if (!window.confirm('Вы уверены, что хотите сохранить изменения?')) {
      return;
    }

    setLoading(true);
    try {
      await updateStudent(editingStudent.id, editingStudent);
      setStudents(prev => prev.map(student => 
        student.id === editingStudent.id ? editingStudent : student
      ));
      setEditingStudent(null);
      alert('Данные успешно обновлены!');
    } catch (error) {
      console.error('Ошибка обновления:', error);
      alert('Ошибка при обновлении данных');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (studentId, studentName) => {
    if (!window.confirm(`Вы уверены, что хотите удалить ученика "${studentName}"?`)) {
      return;
    }

    setLoading(true);
    try {
      await deleteStudent(studentId);
      setStudents(prev => prev.filter(student => student.id !== studentId));
      alert('Ученик успешно удален!');
    } catch (error) {
      console.error('Ошибка удаления:', error);
      alert('Ошибка при удалении ученика');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditingStudent(null);
  };

  const handleFieldChange = (field, value) => {
    setEditingStudent(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const getSortIcon = (field) => {
    if (sortField !== field) return '↕️';
    return sortDirection === 'asc' ? '↑' : '↓';
  };

  const studios = [...new Set(students.map(s => s.studio))];

  return (
    <div className="students-page">
      <h1>Общая информация</h1>
      
      <div className="filters">
        <div className="search-box">
          <input
            type="text"
            placeholder="Поиск по ФИО или MMAS-ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="filter-group">
          <select value={beltFilter} onChange={(e) => setBeltFilter(e.target.value)}>
            <option value="">Все пояса</option>
            {mockBelts.map(belt => (
              <option key={belt} value={belt}>{belt}</option>
            ))}
          </select>
        </div>
        
        <div className="filter-group">
          <select value={studioFilter} onChange={(e) => setStudioFilter(e.target.value)}>
            <option value="">Все студии</option>
            {studios.map(studio => (
              <option key={studio} value={studio}>{studio}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="students-table">
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th onClick={() => handleSort('fullName')}>
                  ФИО {getSortIcon('fullName')}
                </th>
                <th onClick={() => handleSort('belt')}>
                  Пояс {getSortIcon('belt')}
                </th>
                <th onClick={() => handleSort('birthDate')}>
                  Дата рождения {getSortIcon('birthDate')}
                </th>
                <th onClick={() => handleSort('mmasId')}>
                  MMAS-ID {getSortIcon('mmasId')}
                </th>
                <th onClick={() => handleSort('studio')}>
                  Студия {getSortIcon('studio')}
                </th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map(student => (
                <tr key={student.id}>
                  <td>
                    {editingStudent?.id === student.id ? (
                      <input
                        type="text"
                        value={editingStudent.fullName}
                        onChange={(e) => handleFieldChange('fullName', e.target.value)}
                        className="edit-input"
                      />
                    ) : (
                      student.fullName
                    )}
                  </td>
                  <td>
                    {editingStudent?.id === student.id ? (
                      <select
                        value={editingStudent.belt}
                        onChange={(e) => handleFieldChange('belt', e.target.value)}
                        className="edit-select"
                      >
                        {mockBelts.map(belt => (
                          <option key={belt} value={belt}>{belt}</option>
                        ))}
                      </select>
                    ) : (
                      <BeltDisplay belt={student.belt} />
                    )}
                  </td>
                  <td>
                    {editingStudent?.id === student.id ? (
                      <input
                        type="date"
                        value={editingStudent.birthDate}
                        onChange={(e) => handleFieldChange('birthDate', e.target.value)}
                        className="edit-input"
                      />
                    ) : (
                      new Date(student.birthDate).toLocaleDateString('ru-RU')
                    )}
                  </td>
                  <td>
                    {editingStudent?.id === student.id ? (
                      <input
                        type="text"
                        value={editingStudent.mmasId}
                        onChange={(e) => handleFieldChange('mmasId', e.target.value)}
                        className="edit-input"
                        style={{ textTransform: 'uppercase' }}
                      />
                    ) : (
                      student.mmasId
                    )}
                  </td>
                  <td>
                    {editingStudent?.id === student.id ? (
                      <select
                        value={editingStudent.studio}
                        onChange={(e) => handleFieldChange('studio', e.target.value)}
                        className="edit-select"
                      >
                        {studios.map(studio => (
                          <option key={studio} value={studio}>{studio}</option>
                        ))}
                      </select>
                    ) : (
                      student.studio
                    )}
                  </td>
                  <td>
                    {editingStudent?.id === student.id ? (
                      <div className="edit-actions">
                        <button
                          onClick={handleSave}
                          className="save-btn"
                          disabled={loading}
                        >
                          Сохранить
                        </button>
                        <button
                          onClick={handleCancel}
                          className="cancel-btn"
                          disabled={loading}
                        >
                          Отмена
                        </button>
                      </div>
                    ) : (
                      <div className="actions">
                        <button
                          onClick={() => handleEdit(student)}
                          className="edit-btn"
                          disabled={loading}
                        >
                          Редактировать
                        </button>
                        <button
                          onClick={() => handleDelete(student.id, student.fullName)}
                          className="delete-btn"
                          disabled={loading}
                        >
                          Удалить
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredStudents.length === 0 && (
        <div className="no-results">
          <p>Ученики не найдены</p>
        </div>
      )}
    </div>
  );
};

export default StudentsPage;
