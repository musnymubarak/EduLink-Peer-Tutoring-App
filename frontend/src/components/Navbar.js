import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav style={styles.nav}>
      <div style={styles.logo}>
        <Link to="/" style={styles.logoLink}>
          EDULink
        </Link>
      </div>

      <div style={styles.linksContainer}>
        <Link to="/" style={styles.link} className="nav-link">Home</Link>
        <Link to="/about-us" style={styles.link} className="nav-link">About Us</Link>
        <Link to="/contact-us" style={styles.link} className="nav-link">Contact Us</Link>
        <Link to="/sign-up" style={styles.link} className="nav-link">Sign up</Link>
        <Link to="/login" style={styles.link} className="nav-link">Login</Link>
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    display: 'flex',
    justifyContent: 'space-between', 
    alignItems: 'center',
    padding: '10px 30px',
    background: '#121212',
    position: 'fixed',
    width: '100%',
    top: '0',
    zIndex: '10',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.8)',
  },
  logo: {
    fontSize: '22px',
    fontWeight: '700',
    color: '#fff',
  },
  logoLink: {
    textDecoration: 'none',
    color: '#00bcd4', 
    fontWeight: 'bold',
  },
  linksContainer: {
    display: 'flex',
    gap: '35px', 
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
      transform: scale(1.05); 
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
