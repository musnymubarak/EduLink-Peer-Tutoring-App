import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom'; 
import banner from '../images/banner.jpg';
import Navbar from './Navbar';

const Home = () => {
  const navigate = useNavigate(); 

  const handleNavigate = () => {
    navigate('/aboutus'); 
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.8 }}
      style={styles.container}
    >
      <Navbar />
      <h1 style={styles.header}>Welcome to Our Website</h1>
      <p style={styles.text}>Your journey to excellence starts here.</p>
      <button 
        style={styles.button} 
        onClick={handleNavigate}
      >
        More Info
      </button>
    </motion.div>
  );
};

const styles = {
  container: {
    textAlign: 'center',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundImage: `url(${banner})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  },
  header: {
    fontSize: '2.5rem',
    color: 'white',
  },
  text: {
    fontSize: '1.2rem',
    color: 'white',
  },
  button: {
    marginTop: '20px',
    padding: '10px 20px',
    fontSize: '1rem',
    color: '#fff',
    backgroundColor: '#007BFF', 
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  buttonHover: {
    backgroundColor: '#0056b3', 
    transform: 'scale(1.05)', 
  },
};

export default Home;
