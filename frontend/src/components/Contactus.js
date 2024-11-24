import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

const ContactUs = () => {
  useEffect(() => {
    // Apply gradient to the body when this component is rendered
    document.body.style.background = 'linear-gradient(135deg, #121212, #00bcd4)';
    document.body.style.margin = '0';
    document.body.style.height = '100vh';
  }, []);

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.8 }}
      style={styles.container}
    >
      <h1 style={styles.header}>Contact Us</h1>
      <p style={styles.text}>
        Have questions? We’d love to hear from you. Fill out the form below, and we’ll get back to you as soon as possible!
      </p>
      <form style={styles.form}>
        <input type="text" placeholder="Your Name" style={styles.input} />
        <input type="email" placeholder="Your Email" style={styles.input} />
        <textarea placeholder="Your Message" style={styles.textarea} />
        <button style={styles.button} className="contact-button">Submit</button>
      </form>
    </motion.div>
  );
};

const styles = {
  container: {
    textAlign: 'center',
    margin: '100px auto', 
    padding: '30px',
    background: 'rgba(0, 0, 0, 0.6)',  // Semi-transparent background to overlay on the gradient
    color: '#ffffff',
    borderRadius: '15px',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.8)',
    maxWidth: '600px',
    marginTop: '100px',
    zIndex: 2,
    position: 'relative',
    overflow: 'hidden',
  },
  header: {
    fontSize: '2.5rem',
    color: '#ffffff',
    marginBottom: '20px',
    zIndex: 2,
  },
  text: {
    fontSize: '1.2rem',
    color: '#ddd',
    marginBottom: '30px',
    zIndex: 2,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '15px',
    zIndex: 2,
  },
  input: {
    width: '100%',
    maxWidth: '400px',
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #555',
    backgroundColor: '#1e1e1e',
    color: '#fff',
    outline: 'none',
    transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
  },
  textarea: {
    width: '100%',
    maxWidth: '400px',
    height: '120px',
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #555',
    backgroundColor: '#1e1e1e',
    color: '#fff',
    outline: 'none',
    transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
  },
  button: {
    padding: '12px 25px',
    background: '#00bcd4',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease, transform 0.2s ease',
  },
};

const addHoverStyles = () => {
  const styleTag = document.createElement('style');
  styleTag.innerHTML = `
    /* Hover and focus effects for inputs and textarea */
    input:focus, textarea:focus {
      border-color: #00bcd4;
      box-shadow: 0 0 5px #00bcd4;
    }

    /* Button hover effect */
    .contact-button:hover {
      background-color: #0288d1;
      transform: scale(1.05);
    }

    /* Button active effect */
    .contact-button:active {
      transform: scale(0.98);
    }
  `;
  document.head.appendChild(styleTag);
};

// Apply hover styles
addHoverStyles();

export default ContactUs;
