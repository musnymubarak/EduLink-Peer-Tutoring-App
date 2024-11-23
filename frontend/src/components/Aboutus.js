import React from 'react';
import { motion } from 'framer-motion';

const AboutUs = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, x: -50 }} 
      animate={{ opacity: 1, x: 0 }} 
      transition={{ duration: 0.8 }}
      style={styles.container}
    >
      <h1 style={styles.header}>About Us</h1>
      <p style={styles.text}>
        We are committed to delivering the best experiences for our customers.
      </p>
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

export default AboutUs;
