import React, { useState, useEffect } from 'react';
import { mockStudents, mockStudios, mockBelts, getAttendance, updateAttendance } from '../data/mockData';
import { BeltDisplay } from '../utils/beltUtils';
import { formatDateToDDMMYYYY } from '../utils/dateUtils';
import '../styles/AttendancePage.css';

const AttendancePage = () => {
  const [selectedStudio, setSelectedStudio] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [beltFilter, setBeltFilter] = useState('');
  const [studioFilter, setStudioFilter] = useState('');
  const [sortField, setSortField] = useState('fullName');
  const [sortDirection, setSortDirection] = useState('asc');

  useEffect(() => {
    setStudents(mockStudents);
  }, []);

  const handleStudioChange = (studio) => {
    setSelectedStudio(studio);
    if (selectedDate) {
      loadAttendance(studio, selectedDate);
    }
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    if (selectedStudio) {
      loadAttendance(selectedStudio, date);
    }
  };
  // keep native date input for calendar UX

  const loadAttendance = async (studio, date) => {
    setLoading(true);
    try {
      const attendanceData = await getAttendance(date, studio);
      const attendanceMap = {};
      attendanceData.forEach(item => {
        attendanceMap[item.studentId] = {
          present: item.present,
          duration: item.duration
        };
      });
      setAttendance(attendanceMap);
    } catch (error) {
      console.error('Ошибка загрузки посещаемости:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAttendanceChange = (studentId, present) => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        present,
        duration: present ? (prev[studentId]?.duration || 60) : 0
      }
    }));
  };

  const handleDurationChange = (studentId, duration) => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        duration: parseInt(duration) || 0
      }
    }));
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (field) => {
    if (sortField !== field) return '↕️';
    return sortDirection === 'asc' ? '↑' : '↓';
  };

  const saveAttendance = async () => {
    if (!selectedStudio || !selectedDate) {
      alert('Выберите студию и дату');
      return;
    }

    setLoading(true);
    try {
      const promises = Object.entries(attendance).map(([studentId, data]) => {
        if (data.present) {
          return updateAttendance({
            studentId: parseInt(studentId),
            date: selectedDate,
            studio: selectedStudio,
            duration: data.duration,
            present: true
          });
        }
        return Promise.resolve();
      });

      await Promise.all(promises);
      alert('Посещаемость сохранена!');
    } catch (error) {
      console.error('Ошибка сохранения:', error);
      alert('Ошибка при сохранении');
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = (() => {
    let list = [...students];

    // Поиск
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      list = list.filter(student =>
        student.fullName.toLowerCase().includes(term) ||
        student.mmasId.toLowerCase().includes(term)
      );
    }

    // Фильтры
    if (beltFilter) {
      list = list.filter(student => student.belt === beltFilter);
    }
    if (studioFilter) {
      list = list.filter(student => student.studio === studioFilter);
    }

    // Сортировка
    list.sort((a, b) => {
      let aVal;
      let bVal;

      if (sortField === 'present') {
        aVal = attendance[a.id]?.present ? 1 : 0;
        bVal = attendance[b.id]?.present ? 1 : 0;
      } else if (sortField === 'duration') {
        aVal = attendance[a.id]?.duration ?? 0;
        bVal = attendance[b.id]?.duration ?? 0;
      } else if (sortField === 'belt') {
        const aRank = mockBelts.indexOf(a.belt);
        const bRank = mockBelts.indexOf(b.belt);
        aVal = aRank === -1 ? Number.MAX_SAFE_INTEGER : aRank;
        bVal = bRank === -1 ? Number.MAX_SAFE_INTEGER : bRank;
      } else {
        aVal = a[sortField];
        bVal = b[sortField];
        if (typeof aVal === 'string') {
          aVal = aVal.toLowerCase();
          bVal = bVal.toLowerCase();
        }
      }

      if (sortDirection === 'asc') {
        return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
      } else {
        return aVal < bVal ? 1 : aVal > bVal ? -1 : 0;
      }
    });

    return list;
  })();

  return (
    <div className="attendance-page">
      <h1>Посещаемость</h1>
      
      <div className="controls">
        <div className="control-group">
          <label htmlFor="studio">Студия:</label>
          <select 
            id="studio"
            value={selectedStudio} 
            onChange={(e) => handleStudioChange(e.target.value)}
          >
            <option value="">Выберите студию</option>
            {mockStudios.map(studio => (
              <option key={studio} value={studio}>{studio}</option>
            ))}
          </select>
        </div>

        <div className="control-group">
          <label htmlFor="date">Дата тренировки:</label>
          <input
            id="date"
            type="date"
            value={selectedDate}
            onChange={(e) => handleDateChange(e.target.value)}
          />
        </div>

        <button 
          className="save-btn"
          onClick={saveAttendance}
          disabled={loading || !selectedStudio || !selectedDate}
        >
          {loading ? 'Сохранение...' : 'Сохранить посещаемость'}
        </button>
      </div>

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
            {[...new Set(students.map(s => s.belt))].map(belt => (
              <option key={belt} value={belt}>{belt}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <select value={studioFilter} onChange={(e) => setStudioFilter(e.target.value)}>
            <option value="">Все студии</option>
            {mockStudios.map(studio => (
              <option key={studio} value={studio}>{studio}</option>
            ))}
          </select>
        </div>
      </div>

      {selectedStudio && selectedDate && (
        <div className="attendance-table">
          <h2>Список учеников</h2>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th onClick={() => handleSort('fullName')}>ФИО {getSortIcon('fullName')}</th>
                  <th onClick={() => handleSort('belt')}>Пояс {getSortIcon('belt')}</th>
                  <th onClick={() => handleSort('mmasId')}>MMAS-ID {getSortIcon('mmasId')}</th>
                  <th onClick={() => handleSort('studio')}>Студия {getSortIcon('studio')}</th>
                  <th onClick={() => handleSort('present')}>Присутствовал {getSortIcon('present')}</th>
                  <th onClick={() => handleSort('duration')}>Время (мин) {getSortIcon('duration')}</th>
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
                      <input
                        type="checkbox"
                        checked={attendance[student.id]?.present || false}
                        onChange={(e) => handleAttendanceChange(student.id, e.target.checked)}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        min="0"
                        max="180"
                        value={attendance[student.id]?.duration || 0}
                        onChange={(e) => handleDurationChange(student.id, e.target.value)}
                        disabled={!attendance[student.id]?.present}
                        className="duration-input"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendancePage;
