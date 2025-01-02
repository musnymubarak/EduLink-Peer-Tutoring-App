import React from 'react';
import { motion } from 'framer-motion';
import Navbar from './Navbar';
import './css/ContactUs.css';

const ContactUs = () => {
  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <Navbar />
      <div className="contact-container">
        <div className="contact-form-container">
          <h1 className="contact-header">Contact Us</h1>
          <p className="contact-text">
            Have questions? We'd love to hear from you. Fill out the form below, and we'll get back to you as soon as possible!
          </p>
          <form className="flex flex-col items-center gap-4">
            <input 
              type="text" 
              placeholder="Your Name" 
              className="contact-input" 
            />
            <input 
              type="email" 
              placeholder="Your Email" 
              className="contact-input" 
            />
            <textarea 
              placeholder="Your Message" 
              className="contact-input contact-textarea" 
            />
            <button 
              type="submit" 
              className="contact-button"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </motion.div>
  );
};

export default ContactUs;