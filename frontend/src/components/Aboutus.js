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
      <div style={styles.videoSection}>
        <video
          src="https://www.w3schools.com/html/mov_bbb.mp4" 
          autoPlay
          loop
          muted
          style={styles.video}
        />
      </div>

      <div style={styles.contentSection}>
        <h1 style={styles.header}>About Us</h1>
        <p style={styles.text}>
          At <b>EDULink</b>, we believe in empowering individuals through education and technology.
          Our mission is to deliver innovative solutions that make learning accessible,
          engaging, and effective for everyone.
        </p>
        <ul style={styles.list}>
          <li className="list-item">Personalized Learning Experiences</li>
          <li className="list-item">Innovative Technology Integration</li>
          <li className="list-item">Global Community of Learners</li>
          <li className="list-item">Commitment to Excellence</li>
        </ul>
      </div>
    </motion.div>
  );
};

const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '50px',
    height: '100vh',
    gap: '20px',
    backgroundColor: '#121212', 
    color: '#ffffff',
  },
  videoSection: {
    flex: 1,
  },
  video: {
    width: '100%',
    borderRadius: '8px',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.5)', 
  },
  contentSection: {
    flex: 1,
    textAlign: 'left',
    padding: '20px',
    backgroundColor: '#1e1e1e', 
    borderRadius: '8px',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.8)',
    transition: 'transform 0.3s ease, box-shadow 0.1s ease', 
  },
  header: {
    fontSize: '2.5rem',
    color: '#00bcd4', 
    marginBottom: '20px',
  },
  text: {
    fontSize: '1.2rem',
    color: '#ddd',
    lineHeight: '1.6',
    marginBottom: '20px',
  },
  list: {
    fontSize: '1rem',
    color: '#ddd',
    lineHeight: '1.8',
    listStyleType: 'disc',
    paddingLeft: '20px',
  },
};


const addHoverStyles = () => {
  const styleTag = document.createElement('style');
  styleTag.innerHTML = `
    /* Hover effect for the content section */
    div[style*='contentSection']:hover {
      transform: scale(1.03);
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.9);
    }

    /* Hover effect for list items */
    .list-item {
      position: relative;
      transition: color 0.3s ease, transform 0.3s ease;
    }
    .list-item:hover {
      color: #00bcd4;
      transform: translateX(10px); 
    }
    .list-item::before {
      content: '→'; 
      position: absolute;
      left: -20px;
      opacity: 0;
      transition: opacity 0.3s ease, left 0.3s ease;
    }
    .list-item:hover::before {
      opacity: 1;
      left: -30px;
    }
  `;
  document.head.appendChild(styleTag);
};


addHoverStyles();

export default AboutUs;
