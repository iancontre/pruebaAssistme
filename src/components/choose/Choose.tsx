import React from "react";
import { motion } from 'framer-motion';

import './Choose.css';
import imageChoose from '../../assets/images/imagechoose.png';

const Choose: React.FC = () => {
  const containerVariants = {
    visible: { 
      transition: { 
        staggerChildren: 0.5
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 1.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.div 
      className="choose-fullscreen"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-150px" }}
      variants={containerVariants}
    >
      <div className="choose-content">
        <motion.img 
          src={imageChoose} 
          alt="Encabezado" 
          className="choose-image"
          variants={itemVariants}
        />
        <motion.div 
          className="choose-text"
          variants={itemVariants}
        >
          <h1 className='tittle-choose'>Why choose us ?</h1>
          
          <ul>
          <p>Value Proposition</p>
            <li>We offer personalized attention to incoming calls through our specialized advisors.</li>
            <li>We answer 100% of the calls received by our clients.</li>
            <li>We deliver excellence in service quality, as well as the tools provided to our clients (web portal, customized reports, and client satisfaction follow-ups).</li>
            <li>We collect caller information to build a call history, avoiding the need to request the same details again—saving time and improving the caller experience on future interactions with Assist-Me.</li>
            <li>A dedicated account manager is assigned to VIP clients who pay an additional fee for this premium service.</li>
          </ul>
        </motion.div>
      </div>
    </motion.div>
  );
};
export default Choose;
