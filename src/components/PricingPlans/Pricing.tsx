import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './Pricing.css';
import PlanButton from './PlanButton';
import { fetchAllPlans, Plan } from '../../services/apiService';
import { toast } from 'react-toastify';

const Plans = () => {
  const navigate = useNavigate();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loadingPlans, setLoadingPlans] = useState(true);

  // Cargar planes al montar el componente
  useEffect(() => {
    const loadPlans = async () => {
      try {
        console.log('🚀 Pricing: Starting to load plans...');
        setLoadingPlans(true);
        
        const plansData = await fetchAllPlans();
        console.log('📋 Pricing: Plans loaded successfully:', plansData);
        setPlans(plansData);
      } catch (error) {
        console.error('❌ Pricing: Error loading plans:', error);
        
        // Mostrar información más específica del error
        if (error instanceof Error) {
          if (error.message.includes('not found')) {
            console.warn('⚠️ Pricing: Plans endpoint not found. This endpoint might not be implemented yet.');
            // No mostrar toast de error - es normal si el endpoint no existe
          } else {
            toast.error(`Error loading plans: ${error.message}`);
          }
        } else {
          toast.error('Error loading plans. Please try again.');
        }
        
        setPlans([]);
      } finally {
        setLoadingPlans(false);
        console.log('🏁 Pricing: Plans loading finished');
      }
    };

    loadPlans();
  }, []);

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

  const goToWizard = (plan: Plan) => {
    navigate('/compra', { 
      state: { 
        selectedPlan: plan 
      } 
    });
  };

  // Función para renderizar una card de plan
  const renderPlanCard = (plan: Plan, index: number, isFeatured: boolean = false) => {
    const cardVariants = isFeatured ? proCardVariants : normalCardHover;
    const animationType = isFeatured ? "bounce" : "rest";
    
    return (
      <motion.div 
        className="col-md-4"
        custom={index}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-150px" }}
        variants={cardVariants}
      >
        <motion.div 
          className={`card pricing-card shadow-sm border-0 ${isFeatured ? 'bg-light featured-card' : ''}`}
          initial="rest"
          whileHover="hover"
          animate={animationType}
          variants={cardVariants}
        >
          <div className="card-body text-center">
            <h5 className="plan-title fw-bold">{plan.name.toUpperCase()}</h5>
            <div className={isFeatured ? 'price-container' : 'container-pricetwo'}>
              <h2 className={`plan-price ${isFeatured ? 'fw-bold' : ''}`}>
                ${plan.price ? Math.floor(plan.price) : 'N/A'}
              </h2>
              <p className={`plan-sub ${isFeatured ? 'fw-bold' : ''}`}>
                {plan.duration || 'Per Month'}
              </p>
            </div>
            <p className="plan-minutes">{plan.included_minutes || 50} MINUTES</p>
            <p className="plan-rate fw-bold">${plan.additional_minute_price || 1.89} Add Minutes</p>
            <ul className="list-unstyled text-start mt-4">
              {plan.features && plan.features.length > 0 ? (
                plan.features.map((feature, idx) => (
                  <li key={idx}>
                    <i className="bi bi-check2-circle me-2"></i>{feature}
                  </li>
                ))
              ) : (
                // Features por defecto si no vienen del API
                <>
                  <li><i className="bi bi-check2-circle me-2"></i>No Setup Fees</li>
                  <li><i className="bi bi-check2-circle me-2"></i>No Contacts</li>
                  <li><i className="bi bi-check2-circle me-2"></i>100% Bilingual</li>
                  <li><i className="bi bi-check2-circle me-2"></i>24/7/365 Answering</li>
                  <li><i className="bi bi-check2-circle me-2"></i>Advanced Features</li>
                </>
              )}
            </ul>
            <PlanButton 
              text="Sign Up" 
              variant={isFeatured ? "warning" : "dark"} 
              onClick={() => goToWizard(plan)} 
            />
          </div>
        </motion.div>
      </motion.div>
    );
  };

  return (
    <section className="pricing-section container">
      <div className="row justify-content-center g-5">
        {loadingPlans ? (
          // Mostrar loading mientras cargan los planes
          <div className="col-12 text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading plans...</span>
            </div>
            <p className="mt-3">Loading plans...</p>
          </div>
        ) : plans.length > 0 ? (
          // Ordenar planes: STARTER, PRO, BUSINESS
          (() => {
            const sortedPlans = [...plans].sort((a, b) => {
              const order: { [key: string]: number } = { 'STARTER': 0, 'PRO': 1, 'BUSINESS': 2 };
              const aOrder = order[a.name.toUpperCase()] ?? 999;
              const bOrder = order[b.name.toUpperCase()] ?? 999;
              return aOrder - bOrder;
            });
            
            return sortedPlans.map((plan, index) => {
              // El segundo plan (índice 1) será el destacado - PRO
              const isFeatured = index === 1;
              return renderPlanCard(plan, index, isFeatured);
            });
          })()
        ) : (
          // Mostrar mensaje si no hay planes disponibles
          <div className="col-12 text-center">
            <p>No plans available at the moment. Please try again later.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Plans;