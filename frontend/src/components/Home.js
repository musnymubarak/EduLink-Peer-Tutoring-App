import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom'; 
import banner from '../images/banner.jpg';
import Navbar from './Navbar';

const Home = () => {
  const navigate = useNavigate(); 

  const handleNavigate = () => {
    navigate('/about-us'); 
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.8 }}
      className="relative h-screen w-full bg-cover bg-center bg-no-repeat flex flex-col"
      style={{ 
        backgroundImage: `url(${banner})`,
        backgroundBlendMode: 'overlay'
      }}
    >
      <Navbar />

      <div className="flex flex-col justify-center items-center text-center flex-grow px-4">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 max-w-3xl"
        >
          Welcome to Our Website
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="text-xl md:text-2xl text-white mb-8 max-w-xl"
        >
          Your journey to excellence starts here
        </motion.p>
        
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleNavigate}
          className="px-6 py-3 bg-blue-600 text-white rounded-full text-lg font-semibold 
                     hover:bg-blue-700 transition-all duration-300 ease-in-out 
                     shadow-lg hover:shadow-xl transform hover:-translate-y-1"
        >
          More Info
        </motion.button>
      </div>
    </motion.div>
  );
};

export default Home;
