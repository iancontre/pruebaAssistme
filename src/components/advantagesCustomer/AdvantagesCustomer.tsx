import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import "./AdvantagesCustomer.css";
import customerA from "../../assets/images/customerA.png";
import { useTranslation } from '../../hooks/useTranslation';

const AdvantagesCustomer = () => {
  const { t } = useTranslation();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const advantages = [
    {
      title: t('advantagesCustomer.advantages.advantage1.title'),
      desc: t('advantagesCustomer.advantages.advantage1.desc'),
    },
    {
      title: t('advantagesCustomer.advantages.advantage2.title'),
      desc: t('advantagesCustomer.advantages.advantage2.desc'),
    },
    {
      title: t('advantagesCustomer.advantages.advantage3.title'),
      desc: t('advantagesCustomer.advantages.advantage3.desc'),
    },
    {
      title: t('advantagesCustomer.advantages.advantage4.title'),
      desc: t('advantagesCustomer.advantages.advantage4.desc'),
    },
    {
      title: t('advantagesCustomer.advantages.advantage5.title'),
      desc: t('advantagesCustomer.advantages.advantage5.desc'),
    },
    {
      title: t('advantagesCustomer.advantages.advantage6.title'),
      desc: t('advantagesCustomer.advantages.advantage6.desc'),
    },
    {
      title: t('advantagesCustomer.advantages.advantage7.title'),
      desc: t('advantagesCustomer.advantages.advantage7.desc'),
    },
    {
      title: t('advantagesCustomer.advantages.advantage8.title'),
      desc: t('advantagesCustomer.advantages.advantage8.desc'),
    },
    {
      title: t('advantagesCustomer.advantages.advantage9.title'),
      desc: t('advantagesCustomer.advantages.advantage9.desc'),
    },
    {
      title: t('advantagesCustomer.advantages.advantage10.title'),
      desc: t('advantagesCustomer.advantages.advantage10.desc'),
    },
    {
      title: t('advantagesCustomer.advantages.advantage11.title'),
      desc: t('advantagesCustomer.advantages.advantage11.desc'),
    },
    {
      title: t('advantagesCustomer.advantages.advantage12.title'),
      desc: t('advantagesCustomer.advantages.advantage12.desc'),
    },
  ];

  const toggleIndex = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className="advantages-customer-section">
      <h2 
        className="advantages-customer-title"
        dangerouslySetInnerHTML={{ __html: t('advantagesCustomer.title') }}
      />
      <div className="advantages-customer-content">
        <div className="advantages-customer-image-wrapper">
          <img src={customerA} alt="Customer Service" className="advantages-customer-image" />
        </div>
        <div className="advantages-customer-list">
          {advantages.map((item, idx) => (
            <div className="advantage-item" key={item.title}>
              <button
                className={`advantage-header${openIndex === idx ? ' open' : ''}`}
                onClick={() => toggleIndex(idx)}
                aria-expanded={openIndex === idx}
                aria-controls={`advantage-desc-${idx}`}
              >
                <span>{item.title}</span>
                <span className={`plus-icon${openIndex === idx ? ' open' : ''}`}>+</span>
              </button>
              <AnimatePresence initial={false}>
                {openIndex === idx && item.desc && (
                  <motion.div
                    id={`advantage-desc-${idx}`}
                    className="advantage-desc"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                  >
                    <div>{item.desc}</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AdvantagesCustomer; 