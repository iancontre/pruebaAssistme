import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { PiChartPie, PiShoppingCart, PiHouse } from 'react-icons/pi';
import { redirectToStripeBillingPortal } from '../../../services/stripeService';
import { getUserStripeCustomerId } from '../../../services/apiService';
import logowhite from '../../../assets/images/logowhite.png';
import './SidebarPortal.css';

const SidebarPortal: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const handleBillingClick = async () => {
    try {
      setIsLoading(true);
      
      // Obtener el ID del usuario desde localStorage
      const userInfo = localStorage.getItem('user_info');
      if (!userInfo) {
        throw new Error('Información del usuario no encontrada');
      }
      
      const user = JSON.parse(userInfo);
      const userId = user.id;
      
      if (!userId) {
        throw new Error('ID del usuario no encontrado');
      }
      
      console.log('🔍 Usuario ID:', userId);
      
      // Obtener el stripe_customer_id del usuario
      const stripeCustomerId = await getUserStripeCustomerId(userId);
      
      console.log('✅ Stripe Customer ID obtenido:', stripeCustomerId);
      
      // Redirigir al portal de facturación de Stripe
      await redirectToStripeBillingPortal(stripeCustomerId);
      
    } catch (error) {
      console.error('❌ Error al acceder al portal de facturación:', error);
      
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Error al acceder al portal de facturación. Por favor, inténtalo de nuevo.';
      
      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <aside className="sidebar-portal">
      <div className="sidebar-logo">
        <img src={logowhite} alt="ASSIST-ME Logo" className="sidebar-logo-img" />
        <span className="logo-text">ASSIST-ME</span>
      </div>
      <nav className="sidebar-nav">
        <ul>
          <li 
            className={isActive('/dashboard') ? 'active' : ''}
            onClick={() => handleNavigation('/dashboard')}
          >
            <PiHouse className="sidebar-icon" /> Dashboard
          </li>
          <li 
            className={isActive('/reporte-llamadas') ? 'active' : ''}
            onClick={() => handleNavigation('/reporte-llamadas')}
          >
            <PiChartPie className="sidebar-icon" /> Reports
          </li>
          <li 
            className="billing-item"
            onClick={handleBillingClick}
            style={{ position: 'relative' }}
          >
            <PiShoppingCart className="sidebar-icon" /> Billing
            {isLoading && (
              <div className="billing-loading">
                <span>🔄</span>
              </div>
            )}
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default SidebarPortal; 