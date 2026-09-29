import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './Navbar.css';

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Check login status whenever the route changes
  useEffect(() => {
    const userEmail = localStorage.getItem('userEmail');
    setIsLoggedIn(!!userEmail);
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('userEmail');
    setIsLoggedIn(false);
    alert('Logged out successfully!');
    navigate('/');
  };

  return (
    <nav className="navbar">
      <h2>🚀 FiberNet ISP</h2>
      <div>
        <Link to="/" className="nav-link">Home</Link>

        {/* Show 'My Account' ONLY when logged in */}
        {isLoggedIn && (
          <Link to="/account" className="nav-link">My Account</Link>
        )}

        {/* Show 'Login' when NOT logged in, show 'Logout' when logged in */}
        {!isLoggedIn ? (
          <Link to="/login" className="nav-link">Login</Link>
        ) : (
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        )}

        <Link to="/register" className="nav-link btn-register">Get Connection</Link>
      </div>
    </nav>
  );
}