import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from '../../hooks/useTranslation';

import './Testimonials.css';
import quote from '../../assets/images/icons/comillas.png';
import lineaFondo from '../../assets/images/LineasFondo.svg';

interface Testimonial {
  id: number;
  name: string;
  position: string;
  avatar: string;
  text: string;
  rating: number;
}

const Testimonials: React.FC = () => {
  const { t } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const testimonialsData: Testimonial[] = [
    {
      id: 1,
      name: "Carlos L.",
      position: t('testimonials.testimonial1.position'),
      avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face",
      text: t('testimonials.testimonial1.text'),
      rating: 5
    },
    {
      id: 2,
      name: "Ana G.",
      position: t('testimonials.testimonial2.position'),
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face",
      text: t('testimonials.testimonial2.text'),
      rating: 5
    },
    {
      id: 3,
      name: "Luis R.",
      position: t('testimonials.testimonial3.position'),
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      text: t('testimonials.testimonial3.text'),
      rating: 5
    },
    {
      id: 4,
      name: "María P.",
      position: t('testimonials.testimonial4.position'),
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face",
      text: t('testimonials.testimonial4.text'),
      rating: 5
    },
    {
      id: 5,
      name: "Roberto M.",
      position: t('testimonials.testimonial5.position'),
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      text: t('testimonials.testimonial5.text'),
      rating: 5
    },
    {
      id: 6,
      name: "Elena T.",
      position: t('testimonials.testimonial6.position'),
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      text: t('testimonials.testimonial6.text'),
      rating: 5
    }
  ];
  
  // Duplicar testimonios para loop infinito
  const extendedTestimonials = [...testimonialsData, ...testimonialsData];
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const nextIndex = prevIndex + 1;
        // Resetear cuando llegue al final del primer set
        if (nextIndex >= testimonialsData.length) {
          setTimeout(() => setCurrentIndex(0), 50); // Reset rápido
          return prevIndex;
        }
        return nextIndex;
      });
    }, 3000); // Cambia cada 3 segundos

    return () => clearInterval(interval);
  }, []);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span key={index} className={`star ${index < rating ? 'filled' : ''}`}>
        ★
      </span>
    ));
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        delay: i * 0.15,
        duration: 0.6,
        ease: [0.4, 0, 0.2, 1],
      },
    }),
  };

  return (
    <section className="testimonials-section">
      <div className="testimonials-container">
        {/* Header */}
        <div className="testimonials-header">
          <div className="header-bg-decoration">
            <img 
              src={lineaFondo} 
              alt="Decorative line" 
              className="linea-fondo-bg"
            />
          </div>
          <p className="testimonials-subtitle">{t('testimonials.subtitle')}</p>
          <h2 className="testimonials-title">{t('testimonials.title')}</h2>
        </div>

        {/* Testimonials Carousel */}
        <div className="testimonials-carousel-container">
          <div 
            className="testimonials-carousel-track"
            style={{
              transform: `translateX(-${currentIndex * 53}vh)` // 50vh (tarjeta) + 3vh (gap)
            }}
          >
            {extendedTestimonials.map((testimonial, index) => (
              <motion.div
                key={`${testimonial.id}-${Math.floor(index / testimonialsData.length)}`}
                className="testimonial-card"
                custom={index % 4}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={cardVariants}
              >
                <div className="testimonial-content">
                  <div className="quote-section">
                    <div className="quote-circle">
                      <img 
                        src={quote} 
                        alt="quote" 
                        className="quote-icon"
                      />
                    </div>
                  </div>
                  <div className="stars-rating">
                    {renderStars(testimonial.rating)}
                  </div>
                  <p className="testimonial-text">{testimonial.text}</p>
                  <div className="testimonial-author">
                    <div className="author-avatar">
                      <img 
                        src={testimonial.avatar} 
                        alt={testimonial.name}
                        className="avatar-image"
                      />
                    </div>
                    <div className="author-info">
                      <h4 className="author-name">{testimonial.name}</h4>
                      <p className="author-position">{testimonial.position}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials; 