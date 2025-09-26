import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from './components/Header';
import LoginPage from './pages/LoginPage';
import VotePage from './pages/VotePage';
import ResultsPage from './pages/ResultsPage';

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-gray-100 flex flex-col">
        {/* Sticky header */}
        <Header />
        
        {/* Content */}
        <main className="flex-1 container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/vote" element={<VotePage />} />
            <Route path="/results" element={<ResultsPage />} />
          </Routes>
        </main>

        <ToastContainer />
      </div>
    </Router>
  );
}

export default App;