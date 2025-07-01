import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './Pricing.css';
import PlanButton from './PlanButton';
import { pricingPlans, PricingPlan } from '../../services/taxService';

const Plans = () => {
  const navigate = useNavigate();

  // Variantes para las cards
  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.2,
        duration: 0.5,
        ease: "easeOut"
      }
    })
  };

  // Variantes para efectos hover de cards normales
  const normalCardHover = {
    rest: { 
      scale: 1, 
      y: 0,
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)"
    },
    hover: { 
      scale: 1.05, 
      y: -10,
      boxShadow: "0 20px 40px rgba(0, 0, 0, 0.2)",
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };

  // Variantes especiales para la card PRO con efecto zoom y rebote
  const proCardVariants = {
    rest: { 
      scale: 1,
      filter: "drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1))"
    },
    hover: { 
      scale: 1.1,
      filter: "drop-shadow(0 25px 50px rgba(141, 169, 201, 0.8))",
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    },
    // Efecto de rebote continuo para destacar
    bounce: {
      scale: [1, 1.06, 1],
      filter: [
        "drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1))",
        "drop-shadow(0 30px 60px rgba(141, 169, 201, 0.8)) drop-shadow(0 0 40px rgba(141, 169, 201, 0.6))",
        "drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1))"
      ],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        repeatType: "reverse" as const,
        ease: "easeInOut"
      }
    }
  };

  const goToWizard = (plan: PricingPlan) => {
    navigate('/compra', { 
      state: { 
        selectedPlan: plan 
      } 
    });
  };

  return (
    <section className="pricing-section container">
      <div className="row justify-content-center g-5">
        {/* STARTER */}
        <motion.div 
          className="col-md-4"
          custom={0}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-150px" }}
          variants={cardVariants}
        >
          <motion.div 
            className="card pricing-card shadow-sm border-0"
            initial="rest"
            whileHover="hover"
            animate="rest"
            variants={normalCardHover}
          >
            <div className="card-body text-center">
              <h5 className="plan-title fw-bold">STARTER</h5>
              <div className='container-pricetwo'>
                <h2 className="plan-price">$79</h2>
                <p className="plan-sub">Per Month</p>
              </div>
              <p className="plan-minutes">50 MINUTES</p>
              <p className="plan-rate fw-bold">$1.89 Add Minutes</p>
              <ul className="list-unstyled text-start mt-4">
                <li><i className="bi bi-check2-circle me-2"></i>No Setup Fees</li>
                <li><i className="bi bi-check2-circle me-2"></i>No Contacts</li>
                <li><i className="bi bi-check2-circle me-2"></i>100% Bilingual</li>
                <li><i className="bi bi-check2-circle me-2"></i>24/7/365 Answering</li>
                <li><i className="bi bi-check2-circle me-2"></i>Advanced Features</li>
              </ul>
              <PlanButton 
                text="Sign Up" 
                variant="dark" 
                onClick={() => goToWizard(pricingPlans[0])} 
              />
            </div>
          </motion.div>
        </motion.div>

        {/* PRO */}
        <motion.div 
          className="col-md-4"
          custom={1}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-150px" }}
          variants={cardVariants}
        >
          <motion.div 
            className="card pricing-card shadow-sm border-0 bg-light featured-card"
            initial="rest"
            whileHover="hover"
            animate="bounce"
            variants={proCardVariants}
          >
            <div className="card-body text-center">
              <h5 className="plan-title fw-bold">PRO</h5>
              <div className='price-container'>
                <h2 className="plan-price fw-bold">$279</h2>
                <p className="plan-sub fw-bold">Per Month</p>
              </div>
              <p className="plan-minutes">250 MINUTES</p>
              <p className="plan-rate fw-bold">$1.35 Add Minutes</p>
              <ul className="list-unstyled text-start mt-4">
                <li><i className="bi bi-check2-circle me-2"></i>No Contact</li>
                <li><i className="bi bi-check2-circle me-2"></i>No Setup Fees</li>
                <li><i className="bi bi-check2-circle me-2"></i>100% Bilingual</li>
                <li><i className="bi bi-check2-circle me-2"></i>24/7/365 Answering</li>
                <li><i className="bi bi-check2-circle me-2"></i>Advanced Features</li>
              </ul>
              <PlanButton 
                text="Sign Up" 
                variant="warning" 
                onClick={() => goToWizard(pricingPlans[1])} 
              />
            </div>
          </motion.div>
        </motion.div>

        {/* BUSINESS */}
        <motion.div 
          className="col-md-4"
          custom={2}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-150px" }}
          variants={cardVariants}
        >
          <motion.div 
            className="card pricing-card shadow-sm border-0"
            initial="rest"
            whileHover="hover"
            animate="rest"
            variants={normalCardHover}
          >
            <div className="card-body text-center">
              <h5 className="plan-title fw-bold">BUSINESS</h5>
              <div className='container-pricetwo'>
                <h2 className="plan-price">$499</h2>
                <p className="plan-sub">Per Month</p>
              </div>
              <p className="plan-minutes">1000 MINUTES</p>
              <p className="plan-rate fw-bold">$1.25 Add Minutes</p>
              <ul className="list-unstyled text-start mt-4">
                <li><i className="bi bi-check2-circle me-2"></i>No Setup Fees</li>
                <li><i className="bi bi-check2-circle me-2"></i>No Contacts</li>
                <li><i className="bi bi-check2-circle me-2"></i>100% Bilingual</li>
                <li><i className="bi bi-check2-circle me-2"></i>24/7/365 Answering</li>
                <li><i className="bi bi-check2-circle me-2"></i>Advanced Features</li>
              </ul>
              <PlanButton 
                text="Sign Up" 
                variant="dark" 
                onClick={() => goToWizard(pricingPlans[2])} 
              />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Plans;