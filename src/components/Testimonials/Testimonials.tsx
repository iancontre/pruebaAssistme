import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

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

const testimonialsData: Testimonial[] = [
  {
    id: 1,
    name: "Carlos L.",
    position: "Real Estate Agent, XYZ Real Estate Group",
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face",
    text: "As a real estate agent, responding quickly to client inquiries is key to my success. Thanks to ASSIST-ME, I can rest easy knowing that every call, whether from a potential client or an urgent buyer, is answered professionally. Their 24/7 personalized service has allowed me to offer better service and close more deals without worrying about missed calls.",
    rating: 5
  },
  {
    id: 2,
    name: "Ana G.",
    position: "Senior Banker, ABC Bank",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face",
    text: "In the banking world, every call counts. With ASSIST-ME, I can ensure that all my clients' inquiries are answered quickly and efficiently. Whether it's resolving questions about financial products or scheduling meetings, ASSIST-ME's call answering service has greatly improved our response time. It has definitely helped me provide a smoother, more professional experience for our clients!",
    rating: 5
  },
  {
    id: 3,
    name: "Luis R.",
    position: "Certified Public Accountant, DEF Accounting Firm",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    text: "As an accountant, time is precious and my schedule is always full. ASSIST-ME has become an extension of my office, handling client calls and messages flawlessly. This allows me to focus on the work that truly matters while knowing my clients are being taken care of professionally and efficiently. Their customer service is indispensable to my practice.",
    rating: 5
  },
  {
    id: 4,
    name: "Maria P.",
    position: "Real Estate Agent, GHI Real Estate",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face",
    text: "The flexibility offered by ASSIST-ME is unmatched. As a real estate agent, I often receive calls outside of business hours, and thanks to their 24/7 service, I never miss a business opportunity. The quality of service is excellent, and the detailed call reports help me follow up effectively with my clients.",
    rating: 5
  },
  {
    id: 5,
    name: "Roberto M.",
    position: "Branch Manager, XYZ Bank",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    text: "Banking is an industry where customer service must be impeccable and constant. With ASSIST-ME, we not only offer real-time support, but they also manage our appointments and urgent inquiries. Their ability to handle high call volumes during busy days has been critical in maintaining high-quality service at all times.",
    rating: 5
  },
  {
    id: 6,
    name: "Elena T.",
    position: "Senior Accountant, 123 Tax Consulting",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    text: "ASSIST-ME has been an essential partner for my accounting firm. They not only answer our clients' calls but also handle appointment scheduling and send reminders, which has helped us improve organization and efficiency in our daily operations. Their service has been professional and personalized, helping us optimize our client communication.",
    rating: 5
  },
  {
    id: 7,
    name: "Robert J",
    position: "Financial Advisor",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop&crop=face",
    text: "In financial services, trust and reliability are everything. ASSIST ME delivers both, handling client calls with the care and expertise that my business requires. I couldn't be happier with their service.",
    rating: 5
  },
  {
    id: 8,
    name: "Jennifer T",
    position: "Healthcare Manager",
    avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face",
    text: "Healthcare requires immediate response and compassionate communication. ASSIST ME understands this perfectly, ensuring our patients always receive the prompt, caring service they deserve.",
    rating: 5
  }
];

const Testimonials: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
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
          <p className="testimonials-subtitle">Discover why businesses choose Assist-Me for their virtual assistant needs</p>
          <h2 className="testimonials-title">What Our Clients Say</h2>
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