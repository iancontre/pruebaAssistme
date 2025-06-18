import React from 'react';
import { motion } from 'framer-motion';
import './Intersection.css';
import imagenIntersection from "../../assets/images/imageintersection.png";
import userinterfaceIcon from "../../assets/images/icons/userinterface.png";

const fadeInUp = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.4, 0, 0.2, 1],
    },
  },
};

const slideInLeft = {
  hidden: { opacity: 0, x: -100 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.8,
      ease: [0.4, 0, 0.2, 1],
      delay: 0.2,
    },
  },
};

const slideInRight = {
  hidden: { opacity: 0, x: 100 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.8,
      ease: [0.4, 0, 0.2, 1],
      delay: 0.4,
    },
  },
};

const Intersection: React.FC = () => {
  return (
    <motion.section 
      className="intersection-container"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
      variants={fadeInUp}
    >
      <div className="intersection-content">
        <motion.div 
          className="intersection-image-section"
          variants={slideInLeft}
        >
          <div className="circular-image-container">
            {/* Imagen temporal - será reemplazada */}
                <img 
                src={imagenIntersection} 
              alt="Customer Service Representative" 
              className="intersection-image"
            />
          </div>
        </motion.div>

        <motion.div 
          className="intersection-text-section"
          variants={slideInRight}
        >
          <h2 className="intersection-title">
            Still Don't Know Our<br />
            Pricing And Plans?
          </h2>
          
          <motion.button 
            className="intersection-btn"
            whileHover={{ 
              scale: 1.05,
              transition: { duration: 0.2 }
            }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              if (window.location.pathname === '/') {
                const el = document.getElementById('pricing');
                if (el) {
                  el.scrollIntoView({ behavior: 'smooth' });
                }
              } else {
                localStorage.setItem('scrollToSection', 'pricing');
                window.location.href = '/';
              }
            }}
          >
            Pricing And Plans
            <img 
              src={userinterfaceIcon} 
              alt="User Interface" 
              className="btn-icon"
            />
          </motion.button>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default Intersection; 