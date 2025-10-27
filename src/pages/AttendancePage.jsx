import React, { useState, useEffect } from 'react';
import { mockStudents, mockStudios, getAttendance, updateAttendance } from '../data/mockData';
import { BeltDisplay } from '../utils/beltUtils';
import './AttendancePage.css';

const AttendancePage = () => {
  const [selectedStudio, setSelectedStudio] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [loading, setLoading] = useState(false);

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

  const filteredStudents = students.filter(student => 
    !selectedStudio || student.studio === selectedStudio
  );

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

      {selectedStudio && selectedDate && (
        <div className="attendance-table">
          <h2>Список учеников</h2>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>ФИО</th>
                  <th>Пояс</th>
                  <th>MMAS-ID</th>
                  <th>Присутствовал</th>
                  <th>Время (мин)</th>
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
