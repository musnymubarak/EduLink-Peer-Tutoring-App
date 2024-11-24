import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav style={styles.nav}>
      <Link to="/" style={styles.link} className="nav-link">Home</Link>
      <Link to="/about-us" style={styles.link} className="nav-link">About Us</Link>
      <Link to="/contact-us" style={styles.link} className="nav-link">Contact Us</Link>
    </nav>
  );
};

const styles = {
  nav: {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: '10px 30px',
    background: '#121212',
    position: 'fixed',
    width: '100%',
    top: '0',
    zIndex: '10',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.8)',
  },
  link: {
    color: '#fff',
    textDecoration: 'none',
    fontSize: '18px',
    fontWeight: '500',
    position: 'relative',
    transition: 'color 0.3s ease, transform 0.3s ease',
  },
};

const addStyles = () => {
  const styleTag = document.createElement('style');
  styleTag.innerHTML = `
    .nav-link::after {
      content: '';
      position: absolute;
      bottom: -5px;
      left: 50%;
      width: 0;
      height: 2px;
      background: #00bcd4;
      transition: width 0.3s ease, left 0.3s ease;
    }
    .nav-link:hover {
      color: #00bcd4;
      transform: scale(1.05); // Slight zoom effect
    }
    .nav-link:hover::after {
      width: 100%;
      left: 0;
    }
  `;
  document.head.appendChild(styleTag);
};

addStyles();

export default Navbar;
