import React from 'react';
import { NavLink } from 'react-router-dom';

const Header = () => {
  const linkClasses = ({ isActive }) =>
    `px-4 py-2 rounded-md font-medium transition ${
      isActive
        ? "bg-blue-600 text-white"
        : "text-gray-700 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-blue-800"
    }`;

  return (
    <header className="sticky top-0 z-20 bg-white dark:bg-slate-800 shadow-md">
      <nav className="container mx-auto flex items-center justify-between px-6 py-4">
        <h1 className="text-xl font-bold text-blue-600 dark:text-blue-400">
          🗳 VoteApp
        </h1>
        <div className="flex items-center space-x-4">
          <NavLink to="/login" className={linkClasses}>Login</NavLink>
          <NavLink to="/vote" className={linkClasses}>Vote</NavLink>
          <NavLink to="/results" className={linkClasses}>Results</NavLink>
        </div>
      </nav>
    </header>
  );
};

export default Header;