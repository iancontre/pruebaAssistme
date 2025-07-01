import { motion } from 'framer-motion';
import './Objetives.css';
import objetivesImage from '../../assets/images/imageObjetives.png'; // Cambia esta ruta por la correcta


const ObjetivosEspecificos = () => {
    // Variantes para las cards
    const cardVariants = {
        hidden: {
            opacity: 0,
            y: 100,
            scale: 0.95
        },
        visible: (i: number) => ({
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                delay: i * 0.4,
                duration: 1.2,
                ease: [0.4, 0, 0.2, 1],
                opacity: {
                    duration: 1.5
                },
                y: {
                    duration: 1.2
                },
                scale: {
                    duration: 1.2
                }
            }
        })
    };

    // Variante para la imagen
    const imageVariant = {
        hidden: {
            opacity: 0,
            y: 50,
            scale: 0.9
        },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                duration: 1.5,
                ease: [0.4, 0, 0.2, 1]
            }
        }
    };

    return (
        <div className="objetivos-contenedor">
          <div className="contenedor-principal">

            <h1>Specific Objectives</h1>
            <motion.img 
              src={objetivesImage} 
              alt="Objetivos estratégicos" 
              className="imagen-principal"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-150px" }}
              variants={imageVariant}
            />
            
            <div className="lista-objetivos">
              {/* Objetivo 1 - Arriba a la izquierda */}
              <motion.div 
                className="objetivo-card objetivo-1"
                custom={0}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-150px" }}
                variants={cardVariants}
              >
                <p>Improve lead conversion through 24/7 call center support, ensuring a rapid response to interested parties,
                     proactive follow-up, and filtering qualified prospects to increase sales opportunities.</p>
                     <div className='figure'></div>
              </motion.div>
              
              {/* Objetivo 2 - Centro derecha */}
              <motion.div 
                className="objetivo-card objetivo-2"
                custom={1}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-150px" }}
                variants={cardVariants}
              >
                <p>Optimize customer service by implementing a virtual assistant service that answers calls in real time.</p>
                <div className='figure'></div>
              </motion.div>
              
              {/* Objetivo 3 - Abajo izquierda */}
              <motion.div 
                className="objetivo-card objetivo-3"
                custom={2}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-150px" }}
                variants={cardVariants}
              >
                <p>Increase the operational efficiency
                of companies by reducing their administrative workload by 30%, allowing them to focus on negotiating and closing sales.</p>
                <div className='figure'></div>
              </motion.div>
              
              {/* Objetivo 4 - Arriba derecha */}
              <motion.div 
                className="objetivo-card objetivo-4"
                custom={3}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-150px" }}
                variants={cardVariants}
              >
                <p>understanding and anticipating customer needs, 
                    tailoring our services to exceed their expectations and foster lasting relationships.</p>
                    <div className='figure'></div>
              </motion.div>
              
              {/* Objetivo 5 - Centro izquierda */}
              <motion.div 
                className="objetivo-card objetivo-5"
                custom={4}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-150px" }}
                variants={cardVariants}
              >
                <p>Promote responsible business practices that benefit both our customers and the environment, 
                    contributing to ethical and sustainable development in the sector.</p>
                    <div className='figure'></div>
              </motion.div>
            </div>
          </div>
        </div>
      );
};

export default ObjetivosEspecificos;