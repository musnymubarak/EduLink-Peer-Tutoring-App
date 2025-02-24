import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom'; 
import banner from '../images/banner.jpg';
import Navbar from './Navbar';

const Home = () => {
  const navigate = useNavigate(); 

  const handleNavigate = () => {
    navigate('/explore'); 
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.8 }}
      className="relative h-screen w-full bg-cover bg-center flex flex-col"
      style={{ 
        backgroundImage: `url(${banner})`,
        backgroundBlendMode: 'overlay',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
      }}
    >
      <Navbar />

      <div className="flex flex-col justify-center items-center text-center flex-grow px-6 space-y-6">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white leading-tight"
        >
          Welcome To Edu-Link 
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="text-lg md:text-2xl text-gray-200 max-w-2xl"
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
