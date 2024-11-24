import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav style={styles.nav}>
      <Link to="/" style={styles.link}>Home</Link>
      <Link to="/about-us" style={styles.link}>About Us</Link>
      <Link to="/contact-us" style={styles.link}>Contact Us</Link>
      <Link to="/sign-up" style={styles.link}>Sign up</Link>
    </nav>
  );
};

const styles = {
  nav: {
    display: 'flex',
    justifyContent: 'space-around',
    padding: '10px 20px',
    background: '#333',
    color: '#fff',
  },
  link: {
    color: '#fff',
    textDecoration: 'none',
    fontSize: '18px',
  },
};

export default Navbar;
