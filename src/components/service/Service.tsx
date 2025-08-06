import React from "react";
import { motion } from 'framer-motion';
import { useTranslation } from '../../hooks/useTranslation';

import './Service.css';
import requiesticon from '../../assets/images/icons/requestService.png';
import callMaleicon from '../../assets/images/icons/callMale.png';
import openEmailicon from '../../assets/images/icons/openEmail.png';
import chatBubbleicon from '../../assets/images/icons/chatBubble.png';
import lenguageicon from '../../assets/images/icons/lenguage.png';
import lastHoursicon from '../../assets/images/icons/last24Hours.png';
import callinicon from '../../assets/images/icons/calling.png';
import popupicon from '../../assets/images/icons/popup.png';
import videoMeicon from '../../assets/images/icons/VideoMessage.png';
import supporticon from '../../assets/images/icons/OnlineSupport.png';
import receivedicon from '../../assets/images/icons/Received.png';
import pushNotificaicon from '../../assets/images/icons/PushNotifications.png';
import checkFileicon from '../../assets/images/icons/CheckFile.png';
import orderFileicon from '../../assets/images/icons/OrderHistory.png';

const Service: React.FC = () => {
  const { t } = useTranslation();
  
  // Variantes para las cards
  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 100,
      scale: 0.95
    },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        delay: i * 0.4,
        duration: 1.2,
        ease: [0.4, 0, 0.2, 1],
        opacity: {
          duration: 1.5
        },
        y: {
          duration: 1.2
        },
        scale: {
          duration: 1.2
        }
      }
    })
  };

  return (
    <div className="services-container">
                <h1 className="service-tittle">{t('service.title')}</h1>
      {/* Sección 01 - Main Services */}
      <section className="main-services-section">
        <div className="section-header">
          <div className="section-number-container">
            <span className="section-number">01</span>
            <div className="vertical-lines">
              {[...Array(22)].map((_, i) => (
                <div key={i} className="vertical-line"></div>
              ))}
            </div>
          </div>
          <div className="title-and-description">
            <div className="text-and-card-container">
              <div className="text-content">
                                                   <h2 className="section-title">
                    {t('service.mainServices.title')}
                  </h2>
                  <p className="section-description">
                    {t('service.mainServices.description')}
                  </p>
              </div>

              <motion.div 
                className="service-card"
                custom={0}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-150px" }}
                variants={cardVariants}
              >
                                                                   <h5 className="card-title">{t('service.mainServices.service1.title')}</h5>
                  <p className="card-description">
                    {t('service.mainServices.service1.description')}
                  </p>
                <div className="container-card">
                  <img src={requiesticon} className="icon-requiest" />
                  <img src={callMaleicon} alt="icon-call" />
                </div>
              </motion.div>

              <motion.div 
                className="service-card"
                custom={1}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-150px" }}
                variants={cardVariants}
              >
                                 <h5 className="card-title">{t('service.mainServices.service2.title')}</h5>
                 <p className="card-description">
                   {t('service.mainServices.service2.description')}
                 </p>
                <div className="container-cardmedial">
                  <img src={openEmailicon} className="icon-email" />
                  <img src={chatBubbleicon} alt="icon-bubble" />
                </div>
              </motion.div>

              <motion.div 
                className="service-carddos"
                custom={2}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-150px" }}
                variants={cardVariants}
              >
                                 <h5 className="card-title">{t('service.mainServices.service3.title')}</h5>
                 <p className="card-description">
                   {t('service.mainServices.service3.description')}
                 </p>
                <div className="container-ligt">
                  <img src={lenguageicon} className="icon-requies" />
                </div>
              </motion.div>

              <motion.div 
                className="service-carddos"
                custom={3}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-150px" }}
                variants={cardVariants}
              >
                                 <h5 className="card-title">{t('service.mainServices.service4.title')}</h5>
                 <p className="card-description">
                   {t('service.mainServices.service4.description')}
                 </p>
                <div className="container-ligt">
                  <img src={lastHoursicon} className="icon-requies" />
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Sección 02 - Unique Features */}
      <section className="main-services-section">
        <div className="section-header no-margin-top">
          <div className="section-number-container">
            <span className="section-number">02</span>
            <div className="vertical-lines">
              {[...Array(22)].map((_, i) => (
                <div key={i} className="vertical-line"></div>
              ))}
            </div>
          </div>
          <div className="title-and-description">
                         <h2 className="section-title">{t('service.uniqueFeatures.title')}</h2>
            <div className="text-and-card-container" style={{flexWrap: "wrap"}}>
              <motion.div 
                className="service-card"
                style={{width: "45%"}}
                custom={0}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-150px" }}
                variants={cardVariants}
              >
                                 <h5 className="card-title">{t('service.uniqueFeatures.feature1.title')}</h5>
                 <p className="card-description">
                   {t('service.uniqueFeatures.feature1.description')}
                 </p>
                <div className="container-towcard">
                  <img src={callinicon} className="icon-calling" />
                  <img src={popupicon} alt="icon-popupin" />
                </div>
              </motion.div>

              <motion.div 
                className="service-card"
                style={{width: "45%"}}
                custom={1}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-150px" }}
                variants={cardVariants}
              >
                                 <h5 className="card-title">{t('service.uniqueFeatures.feature2.title')}</h5>
                 <p className="card-description">
                   {t('service.uniqueFeatures.feature2.description')}
                 </p>
                <div className="container-towcard-c">
                  <img src={videoMeicon} className="icon-videoMe" />
                  <img src={supporticon} alt="icon-support" />
                </div>
              </motion.div>

              <motion.div 
                className="service-card"
                style={{width: "45%"}}
                custom={2}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-150px" }}
                variants={cardVariants}
              >
                                 <h5 className="card-title">{t('service.uniqueFeatures.feature3.title')}</h5>
                 <p className="card-description">
                   {t('service.uniqueFeatures.feature3.description')}
                 </p>
                <div className="container-towcard-c">
                  <img src={receivedicon} className="icon-received" />
                  <img src={pushNotificaicon} alt="icon-push" />
                </div>
              </motion.div>

              <motion.div 
                className="service-card"
                style={{width: "45%"}}
                custom={3}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-150px" }}
                variants={cardVariants}
              >
                                 <h5 className="card-title">{t('service.uniqueFeatures.feature4.title')}</h5>
                 <p className="card-description">
                   {t('service.uniqueFeatures.feature4.description')}
                 </p>
                <div className="container-towcard-c">
                  <img src={checkFileicon} className="icon-requies" />
                  <img src={orderFileicon} alt="icon-orderFile" />
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Service;
