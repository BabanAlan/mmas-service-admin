import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import HomePage from './pages/HomePage';
import AttendancePage from './pages/AttendancePage';
import CertificationPage from './pages/CertificationPage';
import AddStudentPage from './pages/AddStudentPage';
import StudentsPage from './pages/StudentsPage';
import PaymentsPage from './pages/PaymentsPage';
import './styles/App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Navigation />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/attendance" element={<AttendancePage />} />
            <Route path="/certification" element={<CertificationPage />} />
            <Route path="/add-student" element={<AddStudentPage />} />
            <Route path="/students" element={<StudentsPage />} />
            <Route path="/payments" element={<PaymentsPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
