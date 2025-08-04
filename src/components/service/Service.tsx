import React from "react";
import { motion } from 'framer-motion';

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
                <h1 className="service-tittle">Services</h1>
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
                    Main Services
                  </h2>
                  <p className="section-description">
                    In our virtual assistant company, we offer comprehensive and flexible solutions so you can focus on what matters most: growing your business. Our team of highly trained professionals handles phone support, call management, administrative tasks, customer service, and much more, always with efficiency, closeness, and a deep understanding of your needs. Whether you need support during business hours or full 24/7 coverage, we are here to optimize your time, improve the customer experience, and keep your operation running smoothly, wherever you are.
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
                                                                   <h5 className="card-title">Personalized Phone Support</h5>
                  <p className="card-description">
                    We answer each call on behalf of your company, following the tone and protocol you prefer. Our goal is to provide a professional and friendly first impression that reinforces your brand and builds trust with each customer.
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
                                 <h5 className="card-title">Message Taking and Instant Delivery</h5>
                 <p className="card-description">
                   We accurately record each call—name, reason, and contact details—and send them to you immediately via email or messaging app, so you're always informed, even if you can't answer.
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
                                 <h5 className="card-title">Bilingual Support (English and Spanish)</h5>
                 <p className="card-description">
                   Our bilingual team facilitates smooth communication in English and Spanish, helping you connect with a broader audience and ensuring each person feels understood and attended to.
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
                                 <h5 className="card-title">24/7 Coverage or Custom Hours</h5>
                 <p className="card-description">
                   Need full coverage or just during specific hours? We adapt to your business needs, ensuring continuous availability or custom scheduling, so you never miss an opportunity.
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
                         <h2 className="section-title">Unique Features</h2>
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
                                 <h5 className="card-title">Plan Details Visualization Platform</h5>
                 <p className="card-description">
                   Access our online platform anytime to check your plan status, minute usage, call history, reports, and more. Everything in one place, clear, secure, and easy to navigate, so you have total control of your service in real time.
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
                                 <h5 className="card-title">Personalized Phone Support</h5>
                 <p className="card-description">
                   We provide professional and personalized phone support on your behalf or your company's behalf, adapting to the protocol you prefer. Our team handles receiving and managing calls efficiently, ensuring a warm and effective experience for your clients, regardless of volume or time.
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
                                 <h5 className="card-title">Call Summaries by Email and SMS</h5>
                 <p className="card-description">
                   Receive a clear and concise summary of each call handled, directly to your email or via text message. Includes key data such as contact name, call reason, and actions taken or pending, so you're always informed, even when you can't answer in real time.
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
                                 <h5 className="card-title">Call History Reports</h5>
                 <p className="card-description">
                   We offer detailed and periodic reports of all calls received, including date, time, duration, and reason. This information allows you to have total control over communication with your clients, identify patterns, and make strategic decisions based on real data.
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
