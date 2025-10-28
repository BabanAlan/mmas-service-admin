import React, { useState, useEffect } from 'react';
import { mockStudents, mockBelts, updateStudent } from '../data/mockData';
import { BeltDisplay } from '../utils/beltUtils';
import '../styles/CertificationPage.css';

const CertificationPage = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('fullName');
  const [sortDirection, setSortDirection] = useState('asc');
  const [beltFilter, setBeltFilter] = useState('');
  const [studioFilter, setStudioFilter] = useState('');
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
      
      if (sortField === 'belt') {
        const aRank = mockBelts.indexOf(aVal);
        const bRank = mockBelts.indexOf(bVal);
        aVal = aRank === -1 ? Number.MAX_SAFE_INTEGER : aRank;
        bVal = bRank === -1 ? Number.MAX_SAFE_INTEGER : bRank;
      } else if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }
      
      if (sortDirection === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
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

  const handleBeltChange = async (studentId, newBelt) => {
    if (!window.confirm('Вы уверены, что хотите изменить пояс?')) {
      return;
    }

    setLoading(true);
    try {
      await updateStudent(studentId, { belt: newBelt });
      setStudents(prev => prev.map(student => 
        student.id === studentId ? { ...student, belt: newBelt } : student
      ));
    } catch (error) {
      console.error('Ошибка обновления:', error);
      alert('Ошибка при изменении пояса');
    } finally {
      setLoading(false);
    }
  };

  const getSortIcon = (field) => {
    if (sortField !== field) return '↕️';
    return sortDirection === 'asc' ? '↑' : '↓';
  };

  const studios = [...new Set(students.map(s => s.studio))];

  return (
    <div className="certification-page">
      <h1>Аттестация</h1>
      
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
                  Текущий пояс {getSortIcon('belt')}
                </th>
                <th onClick={() => handleSort('mmasId')}>
                  MMAS-ID {getSortIcon('mmasId')}
                </th>
                <th onClick={() => handleSort('studio')}>
                  Студия {getSortIcon('studio')}
                </th>
                <th>Новый пояс</th>
                <th>Действие</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map(student => (
                <tr key={student.id}>
                  <td>{student.fullName}</td>
                  <td>
                    <BeltDisplay belt={student.belt} />
                  </td>
                  <td>{student.mmasId}</td>
                  <td>{student.studio}</td>
                  <td>
                    <select 
                      defaultValue={student.belt}
                      onChange={(e) => handleBeltChange(student.id, e.target.value)}
                      disabled={loading}
                    >
                      {mockBelts.map(belt => (
                        <option key={belt} value={belt}>{belt}</option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <button 
                      className="update-btn"
                      onClick={() => {
                        const select = document.querySelector(`select[data-student-id="${student.id}"]`);
                        if (select) {
                          handleBeltChange(student.id, select.value);
                        }
                      }}
                      disabled={loading}
                    >
                      Обновить
                    </button>
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

export default CertificationPage;
