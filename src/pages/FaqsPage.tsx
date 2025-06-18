import React from 'react';
import { motion } from 'framer-motion';
import Nav from '../components/nav/Nav';
import Header from '../components/header/Header';
import FrequentlyAskedQuestions from '../components/FrequentlyAskedQuestions/FrequentlyAskedQuestions';
import Intersection from '../components/Intersection/Intersection';
import Testimonials from '../components/Testimonials/Testimonials';
import Footer from '../components/footer/Footer';
import ZendeskWidget from '../components/ZendeskWidget/ZendeskWidget';

// Animaciones
const fadeInUp = {
  hidden: { opacity: 0, y: 100, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 1.2,
      ease: [0.4, 0, 0.2, 1],
    },
  },
};

const slideInLeft = {
  hidden: { opacity: 0, x: -100, scale: 0.9 },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      duration: 1.4,
      ease: [0.4, 0, 0.2, 1],
    },
  },
};

const slideInRight = {
  hidden: { opacity: 0, x: 100, scale: 0.9 },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      duration: 1.4,
      ease: [0.4, 0, 0.2, 1],
    },
  },
};

const textReveal = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 1,
      ease: [0.4, 0, 0.2, 1],
      staggerChildren: 0.1,
    },
  },
};

const FaqsPage: React.FC = () => {
  return (
    <>
      <Nav />
      
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-150px' }}
        variants={fadeInUp}
      >
        <Header />
      </motion.div>
      
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-150px' }}
        variants={textReveal}
      >
        <FrequentlyAskedQuestions />
      </motion.div>
      
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-150px' }}
        variants={slideInLeft}
      >
        <Intersection />
      </motion.div>
      
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-150px' }}
        variants={slideInRight}
      >
        <Testimonials />
      </motion.div>
      
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-150px' }}
        variants={fadeInUp}
      >
        <Footer />
      </motion.div>

      <ZendeskWidget />
    </>
  );
};

export default FaqsPage; 