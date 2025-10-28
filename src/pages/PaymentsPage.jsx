import React, { useEffect, useMemo, useState } from 'react';
import { mockStudents, getPaymentsByStudent, getPaymentsByDate, mockStudios } from '../data/mockData';
import { formatDateToDDMMYYYY } from '../utils/dateUtils';
import '../styles/PaymentsPage.css';

const PaymentsPage = () => {
  const [mode, setMode] = useState('byPerson'); // 'byPerson' | 'byDate'
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [studentQuery, setStudentQuery] = useState('');
  const [studentSuggestions, setStudentSuggestions] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [studioFilter, setStudioFilter] = useState('');
  const [methodFilter, setMethodFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortField, setSortField] = useState('date');
  const [sortDirection, setSortDirection] = useState('desc');

  const studentsById = useMemo(() => {
    const map = new Map();
    mockStudents.forEach(s => map.set(s.id, s));
    return map;
  }, []);

  const loadPayments = async () => {
    setLoading(true);
    try {
      let data = [];
      if (mode === 'byPerson' && selectedStudentId) {
        data = await getPaymentsByStudent(parseInt(selectedStudentId));
      } else if (mode === 'byDate' && selectedDate) {
        data = await getPaymentsByDate(selectedDate);
      } else {
        data = [];
      }
      setPayments(data);
    } catch (e) {
      console.error('Ошибка загрузки платежей:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPayments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, selectedStudentId, selectedDate]);

  // keep native date input for calendar UX

  useEffect(() => {
    if (mode !== 'byPerson') return;
    const term = studentQuery.trim().toLowerCase();
    if (!term) {
      setStudentSuggestions([]);
      return;
    }
    const suggestions = mockStudents
      .filter(s => s.fullName.toLowerCase().includes(term) || s.mmasId.toLowerCase().includes(term))
      .slice(0, 8);
    setStudentSuggestions(suggestions);
  }, [studentQuery, mode]);

  const handlePickStudent = (student) => {
    setSelectedStudentId(String(student.id));
    setStudentQuery(`${student.fullName} (${student.mmasId})`);
    setStudentSuggestions([]);
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

  const filtered = useMemo(() => {
    let list = [...payments];

    if (mode === 'byPerson' && searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      list = list.filter(p => {
        const student = studentsById.get(p.studentId);
        const name = student?.fullName?.toLowerCase() || '';
        const id = student?.mmasId?.toLowerCase() || '';
        return name.includes(term) || id.includes(term);
      });
    }

    if (studioFilter) list = list.filter(p => p.studio === studioFilter);
    if (methodFilter) list = list.filter(p => p.method === methodFilter);
    if (statusFilter) list = list.filter(p => p.status === statusFilter);

    list.sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];
      if (sortField === 'amount') {
        aVal = Number(aVal);
        bVal = Number(bVal);
      } else if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }
      if (sortDirection === 'asc') return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
      return aVal < bVal ? 1 : aVal > bVal ? -1 : 0;
    });

    return list;
  }, [payments, searchTerm, studioFilter, methodFilter, statusFilter, sortField, sortDirection, studentsById]);

  return (
    <div className="payments-page">
      <h1>Оплаты тренировок</h1>

      <div className="mode-switch">
        <label>
          <input
            type="radio"
            name="mode"
            value="byPerson"
            checked={mode === 'byPerson'}
            onChange={() => setMode('byPerson')}
          />
          По человеку
        </label>
        <label>
          <input
            type="radio"
            name="mode"
            value="byDate"
            checked={mode === 'byDate'}
            onChange={() => setMode('byDate')}
          />
          По дате тренировки
        </label>
      </div>

      {/* controls removed per request */}

      <div className="filters">
        {mode === 'byPerson' ? (
          <div className="filter-group typeahead">
            <input
              id="studentSearch"
              type="text"
              placeholder="Введите ФИО или MMAS-ID"
              value={studentQuery}
              onChange={(e) => {
                setStudentQuery(e.target.value);
                setSelectedStudentId('');
              }}
            />
            {studentSuggestions.length > 0 && (
              <ul className="suggestions">
                {studentSuggestions.map(s => (
                  <li key={s.id} onClick={() => handlePickStudent(s)}>
                    <span className="suggest-name">{s.fullName}</span>
                    <span className="suggest-id">{s.mmasId}</span>
                    <span className="suggest-studio">{s.studio}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ) : (
          <>
            <div className="filter-group">
              <label htmlFor="date">Дата:</label>
              <input
                id="date"
                type="date"
                className="date-input"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>
          </>
        )}

        <div className="filter-group">
          <select value={studioFilter} onChange={(e) => setStudioFilter(e.target.value)}>
            <option value="">Все студии</option>
            {mockStudios.map(studio => (
              <option key={studio} value={studio}>{studio}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <select value={methodFilter} onChange={(e) => setMethodFilter(e.target.value)}>
            <option value="">Все способы</option>
            <option value="Наличные">Наличные</option>
            <option value="Карта">Карта</option>
            <option value="Перевод">Перевод</option>
          </select>
        </div>

        <div className="filter-group">
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">Все статусы</option>
            <option value="Оплачено">Оплачено</option>
            <option value="Не оплачено">Не оплачено</option>
          </select>
        </div>
      </div>

      {(mode === 'byPerson' ? selectedStudentId : selectedDate) && (
        <div className="payments-table">
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th onClick={() => handleSort('date')}>Дата {getSortIcon('date')}</th>
                  <th onClick={() => handleSort('studio')}>Студия {getSortIcon('studio')}</th>
                  <th>Ученик</th>
                  <th onClick={() => handleSort('amount')}>Сумма {getSortIcon('amount')}</th>
                  <th onClick={() => handleSort('method')}>Способ {getSortIcon('method')}</th>
                  <th onClick={() => handleSort('status')}>Статус {getSortIcon('status')}</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(p => {
                  const s = studentsById.get(p.studentId);
                  return (
                    <tr key={p.id}>
                      <td>{formatDateToDDMMYYYY(p.date)}</td>
                      <td>{p.studio}</td>
                      <td>{s ? `${s.fullName} (${s.mmasId})` : p.studentId}</td>
                      <td>{p.amount} ₽</td>
                      <td>{p.method}</td>
                      <td>{p.status}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentsPage;


