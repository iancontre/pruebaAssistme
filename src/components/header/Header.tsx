import React, { useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import "./Header.css";

// Importar imágenes directamente
import imagenHome from "../../assets/images/imagenPrincipal.png";
import imagenBlog from "../../assets/images/blog.png";
import imagenFaqs from "../../assets/images/imageFaqs.png";
import imagenCustomerService from "../../assets/images/imageCostomer.png";
import iconDown from "../../assets/images/icons/iconDown.png";

// Definir correctamente el objeto con una firma de índice
const headersData: Record<string, { title: string; description: string; image: string; showButtons: boolean }> = {
  "/": {
    title: "Never Miss An Important Call",
    description: "24/7 Virtual receptionist & business answering services",
    image: imagenHome,
    showButtons: true,
  },
  "/blog": {
    title: "OUR BLOG",
    description: "Be part of our blog and posts about our progress in our commitment to customer service.",
    image: imagenBlog,
    showButtons: false,
  },
  "/faqs": {
    title: "FAQ'S",
    description: "Too many calls and not enough hands to answer them? ASSIST-ME ensures your business always remains responsive and professional. Our 24/7 virtual receptionist service answers every call with precision and care when your internal team is unavailable. Partner with ASSIST-ME to maintain consistent, high-quality client communication—so you can stay focused on strategic growth.",
    image: imagenFaqs ,
    showButtons: false,
  },
  "/customerService": {
    title: "Customer Service",
    description: "Due to the growing number of Spanish-speaking Americans, it can be very useful to have a 24/7 bilingual answering service for your business or practice. At Assist-me, we'll make sure that you don't miss out on any important calls or lose potential clients because of language barriers. Contact us today to learn more about the many benefits of using Assist-me virtual services.",
    image: imagenCustomerService, // Using imagenHome temporarily as requested
    showButtons: true,
  },
};

interface HeaderProps {
  title?: string;
  description?: string;
  image?: string;
  showButtons?: boolean;
  isWizard?: boolean;
}

const Header: React.FC<HeaderProps> = (props) => {
  const location = useLocation();
  const headerData = headersData[location.pathname] || headersData["/"];
  const title = props.title ?? headerData.title;
  const description = props.description ?? headerData.description;
  const image = props.image ?? headerData.image;
  const showButtons = props.showButtons ?? headerData.showButtons;
  const isWizard = props.isWizard ?? false;

  // Detectar si estamos en el blog, FAQs o Customer Service
  const isBlog = location.pathname === "/blog";
  const isFaqs = location.pathname === "/faqs";
  const isCustomerService = location.pathname === "/customerService";

  useEffect(() => {
    // Revisar si hay una sección pendiente de scroll cuando se carga la página
    const sectionToScroll = localStorage.getItem('scrollToSection');
    if (sectionToScroll && window.location.pathname === '/') {
      setTimeout(() => {
        const element = document.getElementById(sectionToScroll);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
        localStorage.removeItem('scrollToSection');
      }, 500);
    }
  }, []);

  // Función de navegación igual que en Nav.tsx
  const handleSectionNavigation = (sectionId: string) => {
    // Si estamos en la página principal
    if (window.location.pathname === '/') {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // Si estamos en otra página, navegamos a la home
      window.location.href = '/';
      
      // Guardamos en localStorage qué sección queremos ver
      localStorage.setItem('scrollToSection', sectionId);
    }
  };

  return (
    <header className={`header-fullscreen ${showButtons ? "" : "header-no-background"} ${isFaqs ? "header-faqs" : ""} ${isCustomerService ? "header-no-background" : ""}`}>
      <div className="header-content">
        <img src={image} alt="Encabezado" className="header-image" />
        <div className={`header-text ${isBlog ? "center-blog" : ""} ${isFaqs ? "faqs-text" : ""} ${isCustomerService ? "faqs-text" : ""}`}>
          <h1 className={`tittle-header ${isFaqs ? "faqs-title" : ""} ${isCustomerService ? "faqs-title" : ""} ${isWizard ? "wizard-title" : ""}`}>
            {title}
            {isWizard && (
              <div className="wizard-icon-container">
                <img src={iconDown} alt="Down Icon" className="wizard-down-icon" />
              </div>
            )}
          </h1>
          <p className={isFaqs || isCustomerService ? "faqs-description" : ""}>{description}</p>
          {showButtons && (
            <div className="header-buttons">
              <button
                className={`btn ${isCustomerService ? "customer-service" : "primary"}`}
                onClick={() => handleSectionNavigation('contact')}
              >
                Contact us
              </button>
              <Link to="/compra" className={`btn ${isCustomerService ? "customer-service-blue" : "secondary"}`}>
                Pricing and Plans
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
