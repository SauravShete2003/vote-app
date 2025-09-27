import React from "react";
import { NavLink } from "react-router-dom";

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = React.useState(
    !!localStorage.getItem("isLoggedIn")
  );

  React.useEffect(() => {
    const onStorage = () => setIsLoggedIn(!!localStorage.getItem("isLoggedIn"));
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("isLoggedIn");
    setIsLoggedIn(false);

    // notify other tabs
    window.dispatchEvent(new Event("storage"));

    // redirect
    window.location.href = "/login";
  };

  const linkClasses = ({ isActive }) =>
    `px-4 py-2 rounded-md font-medium transition ${
      isActive
        ? "bg-blue-600 text-white"
        : "text-gray-700 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-blue-800"
    }`;

  let user = {};
  try {
    const raw = localStorage.getItem("user");
    if (raw && raw !== "undefined") {
      user = JSON.parse(raw);
    }
  } catch {
    user = {};
  }

  return (
    <header className="sticky top-0 z-20 bg-white dark:bg-slate-800 shadow-md">
      <nav className="container mx-auto flex items-center justify-between px-6 py-4">
        <h1 className="text-xl font-bold text-blue-600 dark:text-blue-400">
          🗳 VoteApp
        </h1>
        <div className="flex items-center space-x-4">
          {!isLoggedIn && (
            <NavLink to="/login" className={linkClasses}>
              Login
            </NavLink>
          )}
          <NavLink to="/vote" className={linkClasses}>
            Vote
          </NavLink>
          <NavLink to="/results" className={linkClasses}>
            Results
          </NavLink>
          {isLoggedIn && (
            <>
              <span className="text-gray-600 dark:text-gray-300">
                Hi, {user?.username || "Guest"}
              </span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-md font-medium transition text-red-600 hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-800"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
