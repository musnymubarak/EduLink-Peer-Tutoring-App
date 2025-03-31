import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from './Navbar';

const AboutUs = () => {
  useEffect(() => {
    // Apply hover effects for interactive elements
    const styleTag = document.createElement('style');
    styleTag.innerHTML = `
      .content-card {
        transition: transform 0.3s ease, box-shadow 0.3s ease;
      }
      .content-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 15px 30px rgba(0, 0, 0, 0.8);
      }
      .list-item {
        position: relative;
        transition: color 0.3s ease, transform 0.3s ease;
        padding-left: 10px;
        margin-bottom: 12px;
      }
      .list-item:hover {
        color: #00bcd4;
        transform: translateX(5px);
      }
      .highlight {
        color: #00bcd4;
        font-weight: 600;
      }
    `;
    document.head.appendChild(styleTag);
    
    return () => {
      document.head.removeChild(styleTag);
    };
  }, []);

  const contentVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: i => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.2,
        duration: 0.8,
        ease: "easeOut"
      }
    })
  };

  return (
    <div style={styles.container}>
      <Navbar />
      
      {/* Background Video */}
      <div style={styles.videoBackground}>
        <video
          src="https://res.cloudinary.com/dhgyagjqw/video/upload/v1743398144/About-us_a1gnag.mp4"
          autoPlay
          loop
          muted
          style={styles.backgroundVideo}
        />
      </div>
      
      {/* Content Section */}
      <div style={styles.contentWrapper}>
        <motion.div 
          className="content-card"
          style={styles.contentCard}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
        >
          <motion.h1 
            custom={0}
            initial="hidden"
            animate="visible"
            variants={contentVariants}
            style={styles.header}
          >
            About <span className="highlight">EduLink</span>
          </motion.h1>
          
          <motion.p 
            custom={1}
            initial="hidden"
            animate="visible"
            variants={contentVariants}
            style={styles.text}
          >
            Welcome to <span className="highlight">EduLink</span>, the ultimate peer tutoring platform designed to bridge the gap between students and tutors through personalized learning experiences. We believe in the power of collaboration and aim to create an innovative educational ecosystem that enhances knowledge sharing and academic growth.
          </motion.p>
          
          <motion.div
            custom={2}
            initial="hidden"
            animate="visible"
            variants={contentVariants}
          >
            <h2 style={styles.subHeader}>Our Mission</h2>
            <p style={styles.text}>
              At <span className="highlight">EduLink</span>, our mission is to empower students with easy access to quality peer tutoring, fostering a supportive learning community where knowledge flows freely. We strive to make education more engaging, interactive, and accessible for everyone.
            </p>
          </motion.div>
          
          <motion.div
            custom={3}
            initial="hidden"
            animate="visible"
            variants={contentVariants}
          >
            <h2 style={styles.subHeader}>What We Offer</h2>
            <ul style={styles.list}>
              <li className="list-item"><span className="highlight">Seamless Collaboration:</span> Enroll in courses, access learning materials, and receive personalized support from tutors.</li>
              <li className="list-item"><span className="highlight">Interactive Learning Dashboards:</span> Manage courses, enrollments, and requests effectively.</li>
              <li className="list-item"><span className="highlight">Community Engagement:</span> A built-in discussion forum for idea exchange and resource sharing.</li>
              <li className="list-item"><span className="highlight">Secure and Scalable Platform:</span> Robust authentication ensures a safe learning environment.</li>
            </ul>
          </motion.div>
          
          <motion.div
            custom={4}
            initial="hidden"
            animate="visible"
            variants={contentVariants}
          >
            <h2 style={styles.subHeader}>Join Us</h2>
            <p style={styles.text}>
              Whether you're a student looking for guidance or a tutor eager to share your expertise, <span className="highlight">EduLink</span> is here to connect you with the right learning opportunities. Together, let's make learning more accessible and rewarding!
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    position: 'relative',
    minHeight: '100vh',
    width: '100%',
    overflow: 'hidden',
    backgroundColor: '#121212',
    color: '#ffffff',
  },
  videoBackground: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 0,
  },
  backgroundVideo: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    minWidth: '100%',
    minHeight: '100%',
    width: 'auto',
    height: 'auto',
    transform: 'translateX(-50%) translateY(-50%)',
    objectFit: 'cover',
  },
  contentWrapper: {
    position: 'relative',
    zIndex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '100px 20px',
    boxSizing: 'border-box',
    minHeight: '100vh',
  },
  contentCard: {
    maxWidth: '800px',
    width: '100%',
    padding: '40px',
    backgroundColor: 'rgba(30, 30, 30, 0.60)',
    borderRadius: '12px',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.6)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
  },
  header: {
    fontSize: '3rem',
    fontWeight: '700',
    marginBottom: '25px',
    borderBottom: '2px solid #00bcd4',
    paddingBottom: '10px',
    color: '#ffffff',
  },
  subHeader: {
    fontSize: '2rem',
    color: '#ffffff',
    marginTop: '30px',
    marginBottom: '15px',
    position: 'relative',
    paddingLeft: '15px',
    borderLeft: '4px solid #00bcd4',
  },
  text: {
    fontSize: '1.1rem',
    color: '#f0f0f0',
    lineHeight: '1.8',
    marginBottom: '20px',
    textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
  },
  list: {
    fontSize: '1.1rem',
    color: '#f0f0f0',
    lineHeight: '1.6',
    listStyleType: 'none',
    padding: '0',
    margin: '20px 0',
  },
};

export default AboutUs;