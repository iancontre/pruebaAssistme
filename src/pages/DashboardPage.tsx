import React, { useEffect } from 'react';
import DateFilter from '../components/portales/DateFilter/DateFilter';
import CallSummaryChart from '../components/portales/CallSummaryChart/CallSummaryChart';
import ClientCallsChart from '../components/portales/ClientCallsChart/ClientCallsChart';
import SidebarPortal from '../components/portales/SidebarPortal/SidebarPortal';
import HeaderPortal from '../components/portales/HeaderPortal/HeaderPortal';
import './DashboardPage.css';

const DashboardPage: React.FC = () => {
  // Estilos organizados en objetos para mejor legibilidad
  const dashboardMainAreaStyles = {
    position: 'absolute' as const,
    top: '50px',
    left: '264px', // Al lado del sidebar
    right: '24px',
    bottom: '24px',
    background: 'transparent',
    padding: '10px',
    overflow: 'auto' as const,
    maxWidth: 'calc(100vw - 288px)',
    boxSizing: 'border-box' as const
  };

  const dateFilterWrapperStyles = {
    display: 'flex' as const,
    justifyContent: 'flex-end' as const,
    marginBottom: '20px',
    transform: 'scale(0.85)',
    transformOrigin: 'top right' as const
  };

  const chartsContainerStyles = {
    display: 'flex' as const,
    gap: '20px',
    justifyContent: 'space-between' as const,
    flexWrap: 'nowrap' as const,
    width: '100%',
    maxWidth: '100%',
    overflow: 'hidden' as const,
    boxSizing: 'border-box' as const
  };

  const chartWrapperStyles = {
    flex: '1',
    minWidth: '0',
    maxWidth: 'calc(50% - 10px)',
    overflow: 'hidden' as const
  };

  // Obtener el ID del usuario del localStorage
  const userId = localStorage.getItem('userId') || '';
  
  // Calcular fechas por defecto: últimos 30 días
  const getDefaultDateRange = () => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 30);
    
    return {
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0]
    };
  };
  
  const [dateRange, setDateRange] = React.useState(getDefaultDateRange());

  // Debug: Ver las fechas por defecto
  console.log('DashboardPage - Default date range:', dateRange);
  console.log('DashboardPage - Passing dates to charts:', { 
    startDate: dateRange.startDate, 
    endDate: dateRange.endDate 
  });

  useEffect(() => {
    // Agregar clase al html y body cuando se monta el componente
    document.documentElement.classList.add('dashboard-page');
    document.body.classList.add('dashboard-page');

    // Aplicar estilos inline directamente para forzar el color
    document.documentElement.style.backgroundColor = '#808080';
    document.documentElement.style.margin = '0';
    document.documentElement.style.padding = '0';
    document.documentElement.style.height = '100vh';
    document.documentElement.style.minHeight = '100vh';

    document.body.style.backgroundColor = '#808080';
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.body.style.height = '100vh';
    document.body.style.minHeight = '100vh';

    // Aplicar al root también
    const root = document.getElementById('root');
    if (root) {
      root.style.backgroundColor = '#808080';
      root.style.margin = '0';
      root.style.padding = '0';
      root.style.height = '100vh';
      root.style.minHeight = '100vh';
    }

    // Remover clase cuando se desmonta el componente
    return () => {
      document.documentElement.classList.remove('dashboard-page');
      document.body.classList.remove('dashboard-page');

      // Limpiar estilos inline
      document.documentElement.style.backgroundColor = '';
      document.documentElement.style.margin = '';
      document.documentElement.style.padding = '';
      document.documentElement.style.height = '';
      document.documentElement.style.minHeight = '';

      document.body.style.backgroundColor = '';
      document.body.style.margin = '';
      document.body.style.padding = '';
      document.body.style.height = '';
      document.body.style.minHeight = '';

      if (root) {
        root.style.backgroundColor = '';
        root.style.margin = '';
        root.style.padding = '';
        root.style.height = '';
        root.style.minHeight = '';
      }
    };
  }, []);

  const handleDateChange = (startDate: string, endDate: string) => {
    console.log('DashboardPage - Date filter changed:', { startDate, endDate });
    // Actualizar el rango de fechas para la gráfica
    const startDateObj = new Date(startDate);
    const endDateObj = new Date(endDate);
    
    const newDateRange = {
      startDate: startDateObj.toISOString().split('T')[0],
      endDate: endDateObj.toISOString().split('T')[0]
    };
    
    console.log('DashboardPage - Setting new date range:', newDateRange);
    setDateRange(newDateRange);
  };

  return (
    <div className="dashboard-layout">
      <SidebarPortal />
        <HeaderPortal />
      
      {/* Área principal del dashboard - ESTRUCTURA SIMPLIFICADA */}
      <div style={dashboardMainAreaStyles}>
        
        {/* DateFilter posicionado más hacia la derecha y más pequeño */}
        <div style={dateFilterWrapperStyles}>
          <DateFilter 
            onDateChange={handleDateChange}
            initialStartDate={dateRange.startDate}
            initialEndDate={dateRange.endDate}
          />
        </div>

        {/* Contenedor de gráficas lado a lado */}
        {userId && userId !== 'demo-user' ? (
          <div style={chartsContainerStyles}>
            {/* Gráfica de clientes (izquierda) */}
            <div style={chartWrapperStyles}>
              <ClientCallsChart 
                userId={userId}
                startDate={dateRange.startDate}
                endDate={dateRange.endDate}
              />
            </div>

            {/* Gráfica de resumen de llamadas (derecha) */}
            <div style={chartWrapperStyles}>
              <CallSummaryChart 
                userId={userId}
                startDate={dateRange.startDate}
                endDate={dateRange.endDate}
              />
            </div>
          </div>
        ) : (
          <div style={{
            color: 'white',
            fontSize: '16px',
            textAlign: 'center',
            background: 'rgba(255, 255, 255, 0.1)',
            padding: '40px',
            borderRadius: '10px',
            marginTop: '20px'
          }}>
            <div style={{ fontSize: '24px', marginBottom: '10px' }}>📊</div>
            Please log in to view your dashboard data
        </div>
        )}

      </div>
    </div>
  );
};

export default DashboardPage; 