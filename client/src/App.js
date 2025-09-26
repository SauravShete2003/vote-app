import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from './components/Header';
import LoginPage from './pages/LoginPage';
import VotePage from './pages/VotePage';
import ResultsPage from './pages/ResultsPage';
import './App.css';

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <div className="App">
        {/* Test Tailwind CSS */}
        <div className="bg-blue-500 text-white p-4 mb-4 rounded">
          Tailwind CSS is working!
        </div>
        <Header />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/vote" element={<VotePage />} />
          <Route path="/results" element={<ResultsPage />} />
        </Routes>
        <ToastContainer />
      </div>
    </Router>
  );
}

export default App;
