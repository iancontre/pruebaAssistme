import { Container } from '@mui/material';
import { motion } from 'framer-motion';
import Nav from '../components/nav/Nav';
import Header from '../components/header/Header';
import Pricing from '../components/PricingPlans/Pricing';
import About from '../components/about/About';
import Mission from '../components/mission/Mission';
import Vision from '../components/vision/Vision';
import Objetives from '../components/objetives/Objetives';
import Choose from '../components/choose/Choose';
import Service from '../components/service/Service';
import Contact from '../components/contact/Contact';
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

const HomePage = () => {
  return (
    <>
      <Nav />

      <Container maxWidth="lg" sx={{ mt: '100px', mb: 4 }}>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <Header />
        </motion.div>

        <div id="pricing">
          <Pricing />
        </div>

      <section id="about" style={{ paddingTop: '130px', marginTop: '-100px' }}>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={textReveal}
          >
            <About />
          </motion.div>
        </section>

        <section id="mission" style={{ paddingTop: '100px', marginTop: '-100px' }}>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={slideInLeft}
          >
            <Mission />
          </motion.div>
        </section>

        <section id="vision" style={{ paddingTop: '100px', marginTop: '-100px' }}>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={slideInRight}
          >
            <Vision />
          </motion.div>
        </section>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={textReveal}
        >
          <Objetives />
        </motion.div>

        <section id="choose" style={{ paddingTop: '100px', marginTop: '-100px' }}>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={slideInLeft}
        >
          <Choose />
        </motion.div>
        </section>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={slideInRight}
        >
          <Service />
        </motion.div>

      <section id="contact" style={{ paddingTop: '100px', marginTop: '-100px' }}>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <Contact />
        </motion.div>
        </section>
      </Container>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
      >
        <Footer />
      </motion.div>

      <ZendeskWidget />
    </>
  );
};

export default HomePage;
