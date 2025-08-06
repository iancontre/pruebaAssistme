import React from "react";
import { motion } from 'framer-motion';
import { useTranslation } from '../../hooks/useTranslation';

import './Choose.css';
import imageChoose from '../../assets/images/imagechoose.png';

const Choose: React.FC = () => {
  const { t } = useTranslation();
  
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
          <h1 className='tittle-choose'>{t('choose.title')}</h1>
          
          <ul>
          <p>{t('choose.valueProposition')}</p>
            <li>{t('choose.point1')}</li>
            <li>{t('choose.point2')}</li>
            <li>{t('choose.point3')}</li>
            <li>{t('choose.point4')}</li>
            <li>{t('choose.point5')}</li>
          </ul>
        </motion.div>
      </div>
    </motion.div>
  );
};
export default Choose;
