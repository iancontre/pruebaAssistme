import React from 'react';
import { Container } from '@mui/material';
import { motion } from 'framer-motion';
import Nav from '../components/nav/Nav';
import Header from '../components/header/Header';
import Footer from '../components/footer/Footer';
import ZendeskWidget from '../components/ZendeskWidget/ZendeskWidget';
import TeamsCustomer from '../components/teamsCustomer/TeamsCustomer';
import BenefitCustomer from '../components/benefitCustomer/BenefitCustomer';
import AdvantagesCustomer from '../components/advantagesCustomer/AdvantagesCustomer';

import './CustomerService.css';

const CustomerService: React.FC = () => {
  return (
    <>
      <Nav />
      
      <Container maxWidth="lg" sx={{ mt: '100px', mb: 4 }}>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-150px' }}
          variants={{
            hidden: { opacity: 0, y: 100 },
            visible: {
              opacity: 1,
              y: 0,
              transition: {
                duration: 1.2,
                ease: [0.4, 0, 0.2, 1],
              },
            },
          }}
        >
          <Header />
        </motion.div>

        <TeamsCustomer />
        <BenefitCustomer />
        <AdvantagesCustomer />
       

        <div className="customer-service-content">
          {/* Add your customer service page content here */}
        </div>
      </Container>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
        variants={{
          hidden: { opacity: 0, y: 100 },
          visible: {
            opacity: 1,
            y: 0,
            transition: {
              duration: 1.2,
              ease: [0.4, 0, 0.2, 1],
            },
          },
        }}
      >
        <Footer />
      </motion.div>

      <ZendeskWidget />
    </>
  );
};

export default CustomerService; 