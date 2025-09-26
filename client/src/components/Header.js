import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header>
      <nav>
        <Link to="/login">Login</Link>
        <Link to="/vote">Vote</Link>
        <Link to="/results">Results</Link>
      </nav>
    </header>
  );
};

export default Header;
