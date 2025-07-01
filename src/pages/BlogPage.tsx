import { Container } from '@mui/material';
import { motion } from 'framer-motion';
import Nav from '../components/nav/Nav';
import Header from '../components/header/Header';
import ContentBlog from '../components/contentBlog/ContentBlog';
import Footer from '../components/footer/Footer';
import ZendeskWidget from '../components/ZendeskWidget/ZendeskWidget';

// Animaciones (las mismas que en HomePage)
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

const Blog = () => {
  return (
    <>
      <Nav />
      
      <Container maxWidth="lg" sx={{ mt: '100px', mb: 4 }}>
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
          variants={slideInLeft}
        >
          <ContentBlog />
        </motion.div>
      </Container>

      {/* Footer */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
        variants={fadeInUp}
      >
        <Footer />
      </motion.div>

      <ZendeskWidget />
    </>
  );
};

export default Blog; 