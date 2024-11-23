import React from 'react';
import { motion } from 'framer-motion';

const Home = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.8 }}
      style={styles.container}
    >
      <h1 style={styles.header}>Welcome to Our Website</h1>
      <p style={styles.text}>Your journey to excellence starts here.</p>
    </motion.div>
  );
};

const styles = {
  container: {
    textAlign: 'center',
    marginTop: '50px',
  },
  header: {
    fontSize: '2.5rem',
    color: '#333',
  },
  text: {
    fontSize: '1.2rem',
    color: '#555',
  },
};

export default Home;
