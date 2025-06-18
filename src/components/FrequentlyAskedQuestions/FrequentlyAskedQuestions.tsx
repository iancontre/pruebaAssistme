import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './FrequentlyAskedQuestions.css';

interface FAQ {
  id: number;
  question: string;
  answer: string;
}

const faqData: FAQ[] = [
  {
    id: 1,
    question: "What types of calls can your virtual assistants handle?",
    answer: `Our virtual assistants are equipped to handle a wide variety of calls, including but not limited to:

• Customer service inquiries
• Order and appointment scheduling
• Lead generation and follow-up
• Technical support and troubleshooting
• General inquiries and information requests
• Emergency or after-hours calls

We can adapt to any specific needs or industry requirements, ensuring that every call is handled professionally and efficiently, based on your business goals.`
  },
  {
    id: 2,
    question: "Do you offer follow-up service to potential clients?",
    answer: "Yes, ASSIST-ME provides follow-up services to potential clients. Our virtual assistants can handle tasks such as scheduling follow-up calls, sending reminder emails, and ensuring that no lead is forgotten, all while maintaining a professional and personalized approach."
  },
  {
    id: 3,
    question: "Can Assist-Me Customer Service associates respond to emails and messages in addition to calls?",
    answer: "Absolutely. Our team is trained to handle not only calls but also emails and instant messages. We ensure that all forms of communication are managed efficiently, offering a seamless experience for your clients across multiple channels."
  },
  {
    id: 4,
    question: "Is the service available 24/7 or only during specific times?",
    answer: "ASSIST-ME offers 24/7 availability, meaning we are always ready to support your business, whether it's during regular business hours or outside of them. Our service can also be customized to meet your specific scheduling needs, ensuring coverage when it matters most."
  },
  {
    id: 5,
    question: "Do the virtual assistants speak English and Spanish?",
    answer: "Yes, our virtual assistants are bilingual in both English and Spanish, providing effective and professional communication with a diverse range of clients. We ensure that language is never a barrier to delivering top-quality service."
  },
  {
    id: 6,
    question: "How does Assist-Me handle high call volumes for its customers?",
    answer: "ASSIST-ME utilizes a robust system designed to manage high call volumes without compromising service quality. Our team is equipped to handle an influx of calls, ensuring each one is answered promptly and efficiently. We can scale our resources to match demand, ensuring no call goes unanswered."
  },
  {
    id: 7,
    question: "Do you charge per call or is there a fixed monthly fee?",
    answer: "At ASSIST-ME, we offer flexible pricing models to suit your needs. You can choose between a fixed monthly fee for comprehensive service or a per-call pricing option, depending on the level of support required. Our goal is to provide cost-effective solutions tailored to your business."
  },
  {
    id: 8,
    question: "Can I customize attendee scripts and responses?",
    answer: "Yes, we allow you to fully customize the scripts and responses our virtual assistants use when handling calls, messages, or emails. This ensures that the communication aligns perfectly with your brand's voice and meets your specific business requirements."
  },
  {
    id: 9,
    question: "How can I forward calls to my phone?",
    answer: "Forwarding calls to your phone is simple with ASSIST-ME. We provide easy-to-follow instructions and support to ensure calls are seamlessly redirected to your phone, allowing you to stay connected with your clients whenever you need, no matter where you are."
  }
];

const FrequentlyAskedQuestions: React.FC = () => {
  const [openQuestion, setOpenQuestion] = useState<number | null>(1); // Primera pregunta abierta por defecto

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
            Frequently <br />asked questions
          </motion.h2>
          
          <div className="faq-list">
            {faqData.map((faq, index) => (
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
            <h3>Do you have more questions?</h3>
            <p>End-to-end payments and financial management in a single solution. Meet the right platform to help realize.</p>
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
            }}>Contact me</button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default FrequentlyAskedQuestions; 