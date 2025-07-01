import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import "./AdvantagesCustomer.css";
import customerA from "../../assets/images/customerA.png";

const advantages = [
  {
    title: "1. Cost Savings",
    desc: "Save money on hiring and training in-house staff. A virtual assistant answering service is much more cost-effective than maintaining a full-time receptionist.",
  },
  {
    title: "2. 24/7 Availability",
    desc: "With a virtual assistant, your business can be available around the clock, ensuring that no call goes unanswered, whether it's during the day, night, or weekends.",
  },
  {
    title: "3. Bilingual Support",
    desc: "Access to bilingual assistants (English/Spanish) ensures that you can serve a diverse clientele, improving communication and customer satisfaction.",
  },
  {
    title: "4. Improved Customer Experience",
    desc: "Having a professional answering service creates a positive impression, ensuring that each caller feels valued and their needs are addressed promptly and efficiently.",
  },
  {
    title: "5. Increased Efficiency and Productivity",
    desc: "With a virtual assistant handling calls, you and your team can focus on core business activities, improving overall productivity and allowing you to better manage time.",
  },
  {
    title: "6. Scalability",
    desc: "Easily scale your answering service to match the growth of your business. A virtual assistant can quickly adapt to increased call volumes without the need to hire additional personnel.",
  },
  {
    title: "7. Reduced Stress for Business Owners",
    desc: "You no longer have to worry about missed calls or interruptions during critical tasks. The virtual assistant ensures that your communication is streamlined and managed efficiently.",
  },
  {
    title: "8. Professional Image",
    desc: "A virtual assistant gives your business a polished, professional appearance, handling calls with professionalism and representing your brand in the best light.",
  },
  {
    title: "9. Lead Capture and Management",
    desc: "Virtual assistants can capture important lead information, ensuring that you never miss an opportunity and can follow up with potential clients or customers.",
  },
  {
    title: "10. Flexibility in Services",
    desc: "Virtual assistants can handle various tasks beyond just answering calls, such as appointment scheduling, taking messages, call forwarding, and more, providing comprehensive support tailored to your business needs.",
  },
  {
    title: "11. No Overhead Costs",
    desc: "Unlike hiring full-time employees, virtual assistants don't require office space, equipment, or other overhead costs. They work remotely, saving your business on infrastructure expenses.",
  },
  {
    title: "12. Customizable Scripts and Services",
    desc: "You can personalize the call scripts and services according to your specific business needs, ensuring that every interaction aligns with your company's brand and voice.",
  },
];

const AdvantagesCustomer = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleIndex = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className="advantages-customer-section">
      <h2 className="advantages-customer-title">
        Advantages of<br />Having a Virtual Answering Service
      </h2>
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