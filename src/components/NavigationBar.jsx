import { useState } from 'react';
import { 
  FaHome, 
  FaInfoCircle, 
  FaUserFriends, 
  FaBars, 
  FaTimes,
  FaSignOutAlt 
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { label } from 'framer-motion/client';

const NavigationBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const isAuthenticated = !!localStorage.getItem('authToken');

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('username');
    navigate('/signin');
    setIsMenuOpen(false);
  };

  const navItems = [
    { icon: <FaHome className="nav-icon" />, label: 'Home', path: '/' },
    { icon: <FaUserFriends className="nav-icon" />, label: 'Family Members', path: '/home' },
    { icon: <FaInfoCircle className="nav-icon" />, label: 'About', path: '/about' },
    {
    icon: (
      <img
        src="/images/quiz.png"
        alt="Quiz"
        className="nav-icon image"
      />
    ),
    label: 'Quiz',
    path: '/quiz',
  },
  ];

  return (
    <nav className="navbar">
      <motion.div 
        className="navbar-logo"
        whileHover={{ scale: 1.05 }}
        onClick={() => navigate('/')}
        style={{ cursor: 'pointer' }}
      >
        <span role="img" aria-label="Family">👨‍👩‍👧‍👦</span>
        Family Explorer
      </motion.div>
      
      <button className="mobile-menu-btn" onClick={toggleMenu}>
        {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
      </button>
      
      <ul className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
        {navItems.map((item, index) => (
          <motion.li
            key={index}
            whileHover={{ backgroundColor: '#45B7D1', color: 'white' }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              navigate(item.path);
              setIsMenuOpen(false);
            }}
          >
            {item.icon}
            <span>{item.label}</span>
          </motion.li>
        ))}

        {isAuthenticated && (
          <motion.li
            className="logout-btn"
            whileHover={{ backgroundColor: '#FF6B6B', color: 'white' }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
          >
            <FaSignOutAlt className="nav-icon" />
            <span>Logout</span>
          </motion.li>
        )}
      </ul>

      <style jsx>{`
        .navbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 2rem;
          background-color: #F7FFF7;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          font-family: system-ui, sans-serif;
          position: sticky;
          top: 0;
          z-index: 1000;
        }

        .navbar-logo {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 1.5rem;
          font-weight: bold;
          color: #1A535C;
        }

        .nav-links {
          display: flex;
          list-style: none;
          gap: 2rem;
          margin: 0;
          padding: 0;
        }

        .nav-links li {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
          padding: 0.5rem 1rem;
          border-radius: 8px;
        }

        .nav-icon {
          color: inherit;
          font-size: 1.2rem;
        }

        .logout-btn {
          color: #FF6B6B;
          font-weight: bold;
        }
.nav-icon.image {
    width: 24px;
    height: 24px;
    filter: invert(28%) sepia(22%) saturate(871%) hue-rotate(155deg) brightness(93%) contrast(90%);
    transition: filter 0.3s ease;
  }
    
  .nav-links li:hover .nav-icon.image {
    filter: invert(100%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(100%) contrast(100%);
  }
        .mobile-menu-btn {
          display: none;
          background: none;
          border: none;
          color: #FF6B6B;
          cursor: pointer;
          padding: 0.5rem;
        }

        @media (max-width: 768px) {
          .mobile-menu-btn {
            display: block;
          }
          
          .nav-links {
            position: fixed;
            top: 80px;
            left: 0;
            width: 100%;
            background-color: #F7FFF7;
            flex-direction: column;
            align-items: center;
            padding: 1rem 0;
            gap: 0;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
            transform: translateY(-150%);
            transition: transform 0.3s ease-in-out;
            z-index: 99;
          }
          
          .nav-links.active {
            transform: translateY(0);
          }
          
          .nav-links li {
            width: 80%;
            justify-content: center;
            padding: 1rem 2rem !important;
            margin: 0.25rem 0;
          }
        }
      `}</style>
    </nav>
  );
};

export default NavigationBar;