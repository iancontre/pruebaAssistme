import { useEffect } from 'react';
import { Navbar, Nav, NavDropdown, Container } from 'react-bootstrap';
import './Nav.css';
import logoNegro from '../../assets/images/LogoNegro.PNG';
import { useLanguage } from '../../context/LanguageContext';
import { useTranslation } from '../../hooks/useTranslation';


const CustomNav = () => {
  const { currentLanguage, changeLanguage } = useLanguage();
  const { t } = useTranslation();
  useEffect(() => {
    // Revisar si hay una sección pendiente de scroll cuando se carga la página
    const sectionToScroll = localStorage.getItem('scrollToSection');
    if (sectionToScroll && window.location.pathname === '/') {
      setTimeout(() => {
        const element = document.getElementById(sectionToScroll);
        if (element) {
          // Ajuste específico para la sección About
          if (sectionToScroll === 'about') {
            const elementPosition = element.offsetTop;
            const offsetPosition = elementPosition + 200; // 200px más abajo para mostrar About completo
            
            window.scrollTo({
              top: offsetPosition,
              behavior: 'smooth'
            });
          } else {
            // Comportamiento normal para el resto de secciones
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }
        localStorage.removeItem('scrollToSection');
      }, 500); // Esperamos un poco más para que la página se cargue completamente
    }
  }, []);
  const handleSectionNavigation = (sectionId: string) => {
    // Si estamos en la página principal
    if (window.location.pathname === '/') {
      const element = document.getElementById(sectionId);
      if (element) {
        // Ajuste específico para la sección About
        if (sectionId === 'about') {
          const elementPosition = element.offsetTop;
          const offsetPosition = elementPosition + 200; // 200px más abajo para mostrar About completo
          
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        } else {
          // Comportamiento normal para el resto de secciones
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    } else {
      // Si estamos en otra página, navegamos a la home
      window.location.href = '/';
      
      // Guardamos en localStorage qué sección queremos ver
      localStorage.setItem('scrollToSection', sectionId);
    }
  };
  return (
    <Navbar className="navbar" expand="md" fixed="top" bg="white" variant="light">
      <Container className="navbar-container">
        <Navbar.Brand href="/" className="navbar-logo">
          <img src={logoNegro} alt="Assist Me Logo" />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="main-navbar-nav" />
        <Navbar.Collapse id="main-navbar-nav">
          <Nav className="navbar-menu ms-auto">

            <NavDropdown title={t('nav.aboutUs')} id="about-dropdown" className="menu-item styled-dropdown-item">
              <NavDropdown.Item onClick={() => handleSectionNavigation('about')}>
                <i className="bi bi-chevron-right"></i> {t('nav.aboutUs')}
              </NavDropdown.Item>
              <NavDropdown.Item onClick={() => handleSectionNavigation('mission')}>
                <i className="bi bi-chevron-right"></i> {t('nav.ourMission')}
              </NavDropdown.Item>
              <NavDropdown.Item onClick={() => handleSectionNavigation('vision')}>
                <i className="bi bi-chevron-right"></i> {t('nav.ourVision')}
              </NavDropdown.Item>
              <NavDropdown.Item href="/blog">
                <i className="bi bi-chevron-right"></i> {t('nav.ourBlog')}
              </NavDropdown.Item>
            </NavDropdown>

            <Nav.Link onClick={() => handleSectionNavigation('choose')} className="menu-item" style={{ cursor: 'pointer' }}>{t('nav.whyChooseUs')}</Nav.Link>

            <NavDropdown title={t('nav.services')} id="services-dropdown" className="menu-item styled-dropdown-item">
              <NavDropdown.Item href="/faqs">
                <i className="bi bi-chevron-right"></i> {t('nav.faqsTestimonials')}
              </NavDropdown.Item>
              <NavDropdown.Item href="/customerService">
                <i className="bi bi-chevron-right"></i> {t('nav.customerService')}
              </NavDropdown.Item>
              <NavDropdown.Item onClick={() => handleSectionNavigation('pricing')}>
                <i className="bi bi-chevron-right"></i> {t('nav.pricingPlans')}
              </NavDropdown.Item>
            </NavDropdown>

            <Nav.Link href="/#tutorials" className="menu-item">{t('nav.tutorials')}</Nav.Link>

            <NavDropdown title={<span>🌐 {currentLanguage === 'en' ? 'En' : 'Es'}</span>} id="lang-dropdown" className="menu-item styled-dropdown-item">
              <NavDropdown.Item onClick={() => changeLanguage('en')}>
                <i className="bi bi-chevron-right"></i> 
                <span className="flag-icon flag-us"> </span> English
              </NavDropdown.Item>
              <NavDropdown.Item onClick={() => changeLanguage('es')}>
                <i className="bi bi-chevron-right"></i> 
                <span className="flag-icon flag-mx"> </span> Español
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>

          <div className="navbar-login">
            <button className="login-button" onClick={() => window.location.href = '/login'}>{t('nav.logIn')}</button>
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default CustomNav;
