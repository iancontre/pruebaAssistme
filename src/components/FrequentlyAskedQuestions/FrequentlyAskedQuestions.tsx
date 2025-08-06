import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '../../hooks/useTranslation';

import './FrequentlyAskedQuestions.css';

interface FAQ {
  id: number;
  question: string;
  answer: string;
}

const FrequentlyAskedQuestions: React.FC = () => {
  const { t } = useTranslation();
  const [openQuestion, setOpenQuestion] = useState<number | null>(1); // Primera pregunta abierta por defecto

  const getFaqData = (): FAQ[] => [
    {
      id: 1,
      question: t('header.faqs.questions.q1.question'),
      answer: t('header.faqs.questions.q1.answer')
    },
    {
      id: 2,
      question: t('header.faqs.questions.q2.question'),
      answer: t('header.faqs.questions.q2.answer')
    },
    {
      id: 3,
      question: t('header.faqs.questions.q3.question'),
      answer: t('header.faqs.questions.q3.answer')
    },
    {
      id: 4,
      question: t('header.faqs.questions.q4.question'),
      answer: t('header.faqs.questions.q4.answer')
    },
    {
      id: 5,
      question: t('header.faqs.questions.q5.question'),
      answer: t('header.faqs.questions.q5.answer')
    },
    {
      id: 6,
      question: t('header.faqs.questions.q6.question'),
      answer: t('header.faqs.questions.q6.answer')
    },
    {
      id: 7,
      question: t('header.faqs.questions.q7.question'),
      answer: t('header.faqs.questions.q7.answer')
    },
    {
      id: 8,
      question: t('header.faqs.questions.q8.question'),
      answer: t('header.faqs.questions.q8.answer')
    },
    {
      id: 9,
      question: t('header.faqs.questions.q9.question'),
      answer: t('header.faqs.questions.q9.answer')
    }
  ];

  const toggleQuestion = (id: number) => {
    setOpenQuestion(openQuestion === id ? null : id);
  };

  // Animaciones para scroll
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
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.8,
        ease: [0.4, 0, 0.2, 1],
      },
    },
  };

  const slideInRight = {
    hidden: { opacity: 0, x: 50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.8,
        ease: [0.4, 0, 0.2, 1],
      },
    },
  };

  return (
    <div className="faq-container">
      <div className="faq-content">
        <div className="faq-main">
          <motion.h2 
            className="faq-title"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={fadeInUp}
          >
            Frequently<br />asked questions
          </motion.h2>
          
          <div className="faq-list">
            {getFaqData().map((faq, index) => (
              <motion.div 
                key={faq.id} 
                className="faq-item"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-50px' }}
                variants={slideInLeft}
                transition={{ delay: index * 0.1 }} // Delay escalonado para cada pregunta
              >
                <button
                  className={`faq-question ${openQuestion === faq.id ? 'active' : ''}`}
                  onClick={() => toggleQuestion(faq.id)}
                >
                  <span className="question-text">{faq.question}</span>
                  <span className={`faq-icon ${openQuestion === faq.id ? 'open' : ''}`}>
                    +
                  </span>
                </button>
                
                <AnimatePresence>
                  {openQuestion === faq.id && (
                    <motion.div
                      className="faq-answer"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                    >
                      <div className="answer-content">
                        <p>{faq.answer}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div 
          className="faq-sidebar"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          variants={slideInRight}
        >
          <div className="contact-card">
            <div className="contact-icon">
              <svg width="60" height="60" viewBox="0 0 24 24" fill="none">
                <path d="M20 4H4C2.9 4 2.01 4.9 2.01 6L2 18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 8L12 13L4 8V6L12 11L20 6V8Z" fill="#0F384C"/>
              </svg>
            </div>
            <h3>{t('header.faqs.contactCard.title')}</h3>
            <p>{t('header.faqs.contactCard.description')}</p>
            <button className="contact-btn" onClick={() => {
              if (window.location.pathname === '/') {
                const el = document.getElementById('contact');
                if (el) {
                  el.scrollIntoView({ behavior: 'smooth' });
                }
              } else {
                localStorage.setItem('scrollToSection', 'contact');
                window.location.href = '/';
              }
            }}>{t('header.faqs.contactCard.button')}</button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default FrequentlyAskedQuestions; 