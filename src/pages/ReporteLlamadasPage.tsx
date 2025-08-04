import React, { useState, useEffect } from 'react';
import SidebarPortal from '../components/portales/SidebarPortal/SidebarPortal';
import HeaderPortal from '../components/portales/HeaderPortal/HeaderPortal';
import DateFilter from '../components/portales/DateFilter/DateFilter';
import CallSummaryChart from '../components/portales/CallSummaryChart/CallSummaryChart';
import DataTable from 'react-data-table-component';
import { PiMagnifyingGlass, PiCaretLeft, PiCaretRight, PiMinus, PiPlus, PiTable } from 'react-icons/pi';
import { fetchCallRecords, CallRecord, getJWTToken, isAuthenticated } from '../services/apiService';
import * as XLSX from 'xlsx';
import pdfIcon from '../assets/images/pdf.png';
import logoNegro from '../assets/images/LogoNegro.PNG';
import './ReporteLlamadasPage.css';

const ReporteLlamadasPage: React.FC = () => {
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [callRecords, setCallRecords] = useState<CallRecord[]>([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCall, setSelectedCall] = useState<CallRecord | null>(null);

  // Obtener el ID del usuario del localStorage
  const userId = localStorage.getItem('userId') || '';

  // Verificar token al cargar el componente
  useEffect(() => {
    const token = getJWTToken();
    const authenticated = isAuthenticated();
    
    console.log('ReporteLlamadasPage - Auth check:', {
      hasToken: !!token,
      isAuthenticated: authenticated,
      userId: userId,
      tokenLength: token?.length || 0
    });
  }, [userId]);

  // Función para formatear fecha
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  // Función para exportar a Excel
  const exportToExcel = () => {
    try {
      // Preparar los datos para exportar
      const exportData = filteredData.map(record => ({
        'Date': formatDate(record.fecha_llamada),
        'Agent': record.agente,
        'Client': record.cliente_nombre,
        'Phone': record.telefono_cliente,
        'Email': record.email_cliente,
        'Type': record.tipificacion,
        'Priority': record.prioridad,
        'Duration (min)': record.duracion_minutos.toFixed(1),
        'Transfer': record.es_transferencia ? 'Yes' : 'No',
        'Recording': 'Available',
        'Observations': record.observaciones,
        'Raw Date': record.fecha_llamada,
        'Duration (seconds)': record.duracion_segundos,
        'Type Level 1': record.tipificacion_nivel1,
        'Type Level 2': record.tipificacion_nivel2,
        'Type Level 3': record.tipificacion_nivel3,
        'Update Date': record.fecha_actualizacion
      }));

      // Crear el workbook y worksheet
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(exportData);

      // Ajustar el ancho de las columnas
      const columnWidths = [
        { wch: 12 }, // Date
        { wch: 15 }, // Agent
        { wch: 20 }, // Client
        { wch: 15 }, // Phone
        { wch: 25 }, // Email
        { wch: 12 }, // Type
        { wch: 10 }, // Priority
        { wch: 12 }, // Duration
        { wch: 8 },  // Transfer
        { wch: 12 }, // Recording
        { wch: 40 }, // Observations
        { wch: 20 }, // Raw Date
        { wch: 15 }, // Duration (seconds)
        { wch: 15 }, // Type Level 1
        { wch: 15 }, // Type Level 2
        { wch: 15 }, // Type Level 3
        { wch: 20 }  // Update Date
      ];
      worksheet['!cols'] = columnWidths;

      // Agregar el worksheet al workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Call Records');

      // Generar el nombre del archivo con fecha
      const now = new Date();
      const dateStr = now.toISOString().split('T')[0];
      const timeStr = now.toTimeString().split(' ')[0].replace(/:/g, '-');
      const fileName = `Call_Records_${dateStr}_${timeStr}.xlsx`;

      // Descargar el archivo
      XLSX.writeFile(workbook, fileName);

      console.log('Excel file exported successfully:', fileName);
    } catch (error) {
      console.error('Error exporting to Excel:', error);
      alert('Error exporting to Excel. Please try again.');
    }
  };

  // Función para cargar los datos de llamadas
  const loadCallRecords = async () => {
    if (!userId || userId === 'demo-user') {
      console.log('No valid userId, skipping call records load');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      console.log('Loading call records with:', {
        userId,
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
        currentPage,
        pageSize
      });
      
      const response = await fetchCallRecords(
        userId, 
        dateRange.startDate, 
        dateRange.endDate, 
        currentPage, 
        pageSize
      );

      setCallRecords(response.calls || []);
      setTotalRecords(response.total || 0);
      setTotalPages(response.totalPages || 0);
      
      console.log('Call records loaded successfully:', {
        callsCount: response.calls?.length || 0,
        total: response.total,
        totalPages: response.totalPages
      });
    } catch (err: any) {
      console.error('Error loading call records:', err);
      setError(`Error loading call records: ${err.message || 'Unknown error'}`);
      setCallRecords([]);
      setTotalRecords(0);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  };

  // Cargar datos cuando cambien las fechas o la página
  useEffect(() => {
    loadCallRecords();
  }, [userId, dateRange.startDate, dateRange.endDate, currentPage, pageSize]);

  // Configuración de columnas para la tabla
  const columns = [
    {
      name: '',
      selector: (row: CallRecord) => row.fecha_llamada,
      width: '50px',
      cell: (row: CallRecord) => (
        <input
          type="checkbox"
          checked={selectedRows.includes(row.fecha_llamada)}
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedRows([...selectedRows, row.fecha_llamada]);
            } else {
              setSelectedRows(selectedRows.filter(id => id !== row.fecha_llamada));
            }
          }}
          style={{ margin: 0 }}
        />
      ),
    },
    {
      name: 'Date',
      selector: (row: CallRecord) => row.fecha_llamada,
      sortable: true,
      width: '180px',
      cell: (row: CallRecord) => formatDate(row.fecha_llamada),
    },
    {
      name: 'Agent',
      selector: (row: CallRecord) => row.agente,
      sortable: true,
      width: '140px',
    },
    {
      name: 'Client',
      selector: (row: CallRecord) => row.cliente_nombre,
      sortable: true,
      width: '140px',
    },
    {
      name: 'Phone',
      selector: (row: CallRecord) => row.telefono_cliente,
      sortable: true,
      width: '130px',
    },
    {
      name: 'Email',
      selector: (row: CallRecord) => row.email_cliente,
      sortable: true,
      width: '180px',
      cell: (row: CallRecord) => (
        <span style={{ fontSize: '10px' }}>{row.email_cliente}</span>
      ),
    },
    {
      name: 'Type',
      selector: (row: CallRecord) => row.tipificacion,
      sortable: true,
      width: '100px',
    },
    {
      name: 'Priority',
      selector: (row: CallRecord) => row.prioridad,
      sortable: true,
      width: '80px',
      cell: (row: CallRecord) => (
        <span style={{
          padding: '2px 6px',
          borderRadius: '4px',
          fontSize: '9px',
          fontWeight: 'bold',
          backgroundColor: row.prioridad === 'ALTA' ? '#fee2e2' : 
                          row.prioridad === 'MEDIA' ? '#fef3c7' : '#d1fae5',
          color: row.prioridad === 'ALTA' ? '#dc2626' : 
                 row.prioridad === 'MEDIA' ? '#d97706' : '#059669'
        }}>
          {row.prioridad}
        </span>
      ),
    },
    {
      name: 'Duration',
      selector: (row: CallRecord) => row.duracion_minutos,
      sortable: true,
      width: '80px',
      cell: (row: CallRecord) => `${row.duracion_minutos.toFixed(1)}m`,
    },
    {
      name: 'Transfer',
      selector: (row: CallRecord) => row.es_transferencia,
      sortable: true,
      width: '80px',
      cell: (row: CallRecord) => (
        <span style={{
          padding: '2px 6px',
          borderRadius: '4px',
          fontSize: '9px',
          backgroundColor: row.es_transferencia ? '#dbeafe' : '#f3f4f6',
          color: row.es_transferencia ? '#1d4ed8' : '#6b7280'
        }}>
          {row.es_transferencia ? 'Yes' : 'No'}
        </span>
      ),
    },
    {
      name: 'Recording',
      selector: (_row: CallRecord) => 'Disponible',
      sortable: true,
      width: '100px',
      cell: () => (
        <span style={{
          padding: '2px 6px',
          borderRadius: '4px',
          fontSize: '9px',
          backgroundColor: '#d1fae5',
          color: '#059669'
        }}>
          Disponible
        </span>
      ),
    },
    {
      name: 'Observations',
      selector: (row: CallRecord) => row.observaciones,
      sortable: true,
      width: '200px',
      cell: (row: CallRecord) => (
        <span style={{ fontSize: '10px' }} title={row.observaciones}>
          {row.observaciones.length > 30 
            ? `${row.observaciones.substring(0, 30)}...` 
            : row.observaciones}
        </span>
      ),
    },
  ];

  // Filtrar datos basado en el término de búsqueda
  const filteredData = callRecords.filter(item =>
    item.agente.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.telefono_cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.tipificacion.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.cliente_nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.email_cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.observaciones.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.prioridad.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Estilos para la tabla
  const customStyles = {
    table: {
      style: {
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        fontFamily: 'Michroma, sans-serif',
      },
    },
    headRow: {
      style: {
        backgroundColor: '#f8f9fa',
        borderBottom: '1px solid #dee2e6',
        fontWeight: 'bold',
        fontFamily: 'Michroma, sans-serif',
      },
    },
    rows: {
      style: {
        borderBottom: '1px solid #f8f9fa',
        fontFamily: 'Michroma, sans-serif',
        '&:hover': {
          backgroundColor: '#f8f9fa',
        },
      },
    },
    headCells: {
      style: {
        fontFamily: 'Michroma, sans-serif',
        fontSize: '11px',
        fontWeight: 'bold',
      },
    },
    cells: {
      style: {
        fontFamily: 'Michroma, sans-serif',
        fontSize: '10px',
      },
    },
  };

  // Estilos organizados en objetos para mejor legibilidad
  const reporteMainAreaStyles = {
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

  const searchSectionStyles = {
    display: 'flex' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const,
    gap: '16px',
    marginBottom: '16px',
    padding: '16px',
    background: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  };

  const searchInputStyles = {
    display: 'flex' as const,
    alignItems: 'center' as const,
    gap: '12px',
    padding: '12px 20px',
    border: 'none',
    borderRadius: '50px', // Pill shape
    background: '#666666', // Medium-dark gray
    width: '300px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
  };

  const paginationStyles = {
    display: 'flex' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const,
    padding: '16px',
    background: 'white',
    borderRadius: '8px',
    marginTop: '16px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  };

  const pageSizeStyles = {
    display: 'flex' as const,
    alignItems: 'center' as const,
    gap: '8px'
  };

  useEffect(() => {
    // Agregar clase al html y body cuando se monta el componente
    document.documentElement.classList.add('reporte-llamadas-page');
    document.body.classList.add('reporte-llamadas-page');

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

    // Agregar estilos CSS para el placeholder del buscador
    const style = document.createElement('style');
    style.textContent = `
      .reporte-llamadas-page input::placeholder {
        color: #fff !important;
        opacity: 0.8 !important;
      }
    `;
    document.head.appendChild(style);

    // Remover clase cuando se desmonta el componente
    return () => {
      document.documentElement.classList.remove('reporte-llamadas-page');
      document.body.classList.remove('reporte-llamadas-page');

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

      // Remover estilos CSS agregados
      document.head.removeChild(style);
    };
  }, []);

  const handleDateChange = (startDate: string, endDate: string) => {
    console.log('ReporteLlamadasPage - Date filter changed:', { startDate, endDate });
    setDateRange({ startDate, endDate });
  };

  const openModal = (call: CallRecord) => {
    setSelectedCall(call);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCall(null);
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} min`;
    } else {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      return `${hours}h ${remainingMinutes}min`;
    }
  };

  return (
    <div className="reporte-layout">
      <SidebarPortal />
      <HeaderPortal />
      
      {/* Área principal del reporte */}
      <div style={reporteMainAreaStyles}>
        
        {/* DateFilter posicionado más hacia la derecha y más pequeño */}
        <div style={dateFilterWrapperStyles}>
          <DateFilter 
            onDateChange={handleDateChange}
            initialStartDate={dateRange.startDate}
            initialEndDate={dateRange.endDate}
          />
        </div>

        {/* Gráfica de resumen de llamadas */}
        {userId && userId !== 'demo-user' && (
          <div style={{ 
            marginBottom: '20px',
            width: '100%',
            height: '400px'
          }}>
            <CallSummaryChart 
              userId={userId}
              startDate={dateRange.startDate}
              endDate={dateRange.endDate}
            />
          </div>
        )}

        {/* Sección de búsqueda y tabla */}
        <div style={{ background: 'white', borderRadius: '8px', padding: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          
          {/* Barra de búsqueda */}
          <div style={searchSectionStyles}>
            <div style={searchInputStyles}>
              <PiMagnifyingGlass style={{ color: '#fff' }} />
              <input
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  border: 'none',
                  outline: 'none',
                  fontSize: '14px',
                  color: '#fff',
                  width: '100%',
                  background: 'transparent'
                }}
              />
            </div>
            
            {/* Botón de exportación a Excel */}
            <button
              onClick={exportToExcel}
              disabled={filteredData.length === 0}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 20px',
                backgroundColor: filteredData.length === 0 ? '#ccc' : '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: filteredData.length === 0 ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                fontWeight: 'bold',
                transition: 'background-color 0.2s',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
              onMouseEnter={(e) => {
                if (filteredData.length > 0) {
                  e.currentTarget.style.backgroundColor = '#218838';
                }
              }}
              onMouseLeave={(e) => {
                if (filteredData.length > 0) {
                  e.currentTarget.style.backgroundColor = '#28a745';
                }
              }}
            >
              <PiTable style={{ fontSize: '16px' }} />
              Export to Excel
            </button>
          </div>

          {/* Tabla de datos */}
          <DataTable
            title=""
            columns={columns}
            data={filteredData}
            pagination
            paginationServer
            paginationTotalRows={totalRecords}
            onChangePage={(page) => setCurrentPage(page)}
            onChangeRowsPerPage={(currentRowsPerPage) => setPageSize(currentRowsPerPage)}
            customStyles={customStyles}
            selectableRows={false}
            highlightOnHover
            pointerOnHover
            responsive
            progressPending={loading}
            progressComponent={<div style={{ padding: '20px', textAlign: 'center' }}>Loading call records...</div>}
            noDataComponent={error ? `Error: ${error}` : "No records found"}
            onRowClicked={(row) => openModal(row as CallRecord)}
          />

          {/* Paginación personalizada */}
          <div style={paginationStyles}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <PiCaretLeft 
                style={{ 
                  cursor: currentPage > 1 ? 'pointer' : 'not-allowed', 
                  color: currentPage > 1 ? '#666' : '#ccc' 
                }} 
                onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
              />
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = i + 1;
                return (
                  <span 
                    key={pageNum}
                    style={{ 
                      fontSize: '14px', 
                      color: pageNum === currentPage ? '#007bff' : '#666',
                      fontWeight: pageNum === currentPage ? 'bold' : 'normal',
                      cursor: 'pointer',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      backgroundColor: pageNum === currentPage ? '#e3f2fd' : 'transparent'
                    }}
                    onClick={() => setCurrentPage(pageNum)}
                  >
                    {pageNum}
                  </span>
                );
              })}
              {totalPages > 5 && (
                <>
                  <span style={{ fontSize: '14px' }}>...</span>
                  <span 
                    style={{ 
                      fontSize: '14px', 
                      cursor: 'pointer',
                      padding: '4px 8px',
                      borderRadius: '4px'
                    }}
                    onClick={() => setCurrentPage(totalPages)}
                  >
                    {totalPages}
                  </span>
                </>
              )}
              <PiCaretRight 
                style={{ 
                  cursor: currentPage < totalPages ? 'pointer' : 'not-allowed', 
                  color: currentPage < totalPages ? '#666' : '#ccc' 
                }} 
                onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
              />
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <PiCaretLeft style={{ cursor: 'pointer', color: '#666' }} />
                <span style={{ fontSize: '14px' }}>{selectedRows.length} File Selected</span>
                <PiCaretRight style={{ cursor: 'pointer', color: '#666' }} />
              </div>
              
              <div style={pageSizeStyles}>
                <span style={{ fontSize: '14px' }}>Page Size</span>
                <PiMinus 
                  style={{ cursor: 'pointer', color: '#666' }} 
                  onClick={() => setPageSize(Math.max(10, pageSize - 10))}
                />
                <span style={{ fontSize: '14px', fontWeight: 'bold' }}>{pageSize}</span>
                <PiPlus 
                  style={{ cursor: 'pointer', color: '#666' }} 
                  onClick={() => setPageSize(Math.min(100, pageSize + 10))}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de detalles de la llamada */}
      {isModalOpen && selectedCall && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'rgba(220, 220, 220, 0.95)',
            borderRadius: '8px',
            padding: '20px',
            width: '540px',
            maxHeight: '600px',
            overflow: 'auto',
            position: 'relative',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
          }}>
            {/* Logo de fondo con opacidad */}
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '400px',
              height: '400px',
              backgroundImage: `url(${logoNegro})`,
              backgroundSize: 'contain',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
              opacity: 0.05,
              pointerEvents: 'none',
              zIndex: 0
            }} />
            {/* Botón de cerrar */}
            <button
              onClick={closeModal}
              style={{
                position: 'absolute',
                top: '0px',
                right: '10px',
                background: 'none',
                border: 'none',
                fontSize: '20px',
                cursor: 'pointer',
                color: '#666',
                fontWeight: 'bold',
                zIndex: 10
              }}
            >
              ×
            </button>

            {/* Contenido del modal */}
            <div style={{ fontFamily: 'Michroma, sans-serif', paddingTop: '10px', fontSize: '11px', position: 'relative', zIndex: 1 }}>
              {/* Sección superior - ID y fechas */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '20px',
                paddingBottom: '15px',
                borderBottom: '1.5px solid #333',
                marginTop: '10px'
              }}>
                <div>
                  <h3 style={{ margin: '0', color: '#333', fontSize: '11px', fontWeight: 'bold' }}>
                    Call ID: {selectedCall.fecha_llamada.split('T')[0].replace(/-/g, '')}-{Math.floor(Math.random() * 10000)}
                  </h3>
                </div>
                <div style={{ textAlign: 'right', fontSize: '11px', color: '#333' }}>
                  <div style={{ marginBottom: '2px' }}>
                    Start Date: {formatDate(selectedCall.fecha_llamada)} {new Date(selectedCall.fecha_llamada).toLocaleTimeString()}
                  </div>
                  <div>
                    End Date: {formatDate(selectedCall.fecha_actualizacion)} {new Date(selectedCall.fecha_actualizacion).toLocaleTimeString()}
                  </div>
                </div>
              </div>

              {/* Sección media - Duración y usuario */}
              <div style={{
                marginBottom: '20px',
                paddingBottom: '15px',
                borderBottom: '1.5px solid #333'
              }}>
                <div style={{ marginBottom: '8px', fontSize: '11px', fontWeight: 'bold', color: '#333' }}>
                  Call Date
                </div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '8px'
                }}>
                  <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#333' }}>
                    Minutes Consumed: {selectedCall.duracion_minutos.toFixed(1)} Min
                  </div>
                  <div style={{ fontSize: '11px', color: '#333' }}>
                    Average: {formatDuration(selectedCall.duracion_minutos)}
                  </div>
                </div>
                <div style={{ marginBottom: '5px', fontSize: '11px', color: '#333' }}>
                  User Name: {selectedCall.agente}
                </div>
                <div style={{ fontSize: '11px', color: '#333' }}>
                  State/City: {selectedCall.cliente_nombre} - {selectedCall.telefono_cliente}
                </div>
              </div>

              {/* Sección inferior - Razón y script */}
              <div style={{ marginBottom: '40px' }}>
                <div style={{ marginBottom: '8px', fontSize: '11px', fontWeight: 'bold', color: '#333' }}>
                  Reason for Call:
                </div>
                <div style={{ 
                  marginBottom: '15px', 
                  fontSize: '11px', 
                  color: '#333',
                  lineHeight: '1.3',
                  padding: '8px'
                }}>
                  {selectedCall.observaciones || 'No specific reason provided for this call.'}
                </div>

                <div style={{ marginBottom: '8px', fontSize: '11px', fontWeight: 'bold', color: '#333' }}>
                  SCRIPT:
                </div>
                <div style={{ 
                  fontSize: '11px', 
                  color: '#333',
                  lineHeight: '1.3',
                  padding: '8px',
                  fontStyle: 'italic'
                }}>
                  "Thank you for the information. I will forward the appropriate personnel so they can contact you as soon as possible."
                </div>
              </div>

              {/* Botón de descarga PDF */}
              <div style={{
                position: 'absolute',
                bottom: '-30px',
                right: '20px'
              }}>
                <img 
                  src={pdfIcon} 
                  alt="PDF" 
                  style={{ 
                    width: '40px', 
                    height: '40px',
                    cursor: 'pointer',
                    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
                  }}
                  onClick={() => {
                    // Aquí puedes agregar la funcionalidad de descarga PDF
                    console.log('Download PDF clicked');
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReporteLlamadasPage; 