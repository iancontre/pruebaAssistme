import React, { useEffect, useState } from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { fetchCallSummary, CallData, isAuthenticated } from '../../../services/apiService';
import './CallSummaryChart.css';

interface CallSummaryChartProps {
  userId: string;
  startDate: string;
  endDate: string;
}

const CallSummaryChart: React.FC<CallSummaryChartProps> = ({ userId, startDate, endDate }) => {
  const [data, setData] = useState<CallData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalValue, setTotalValue] = useState<string>('0');

  console.log('CallSummaryChart - Props:', { userId, startDate, endDate });

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('CallSummaryChart - Fetching data...');
        setLoading(true);
        setError(null);
        
        // Verificar si el usuario está autenticado
        if (!isAuthenticated()) {
          setError('Please log in to view call data');
          setLoading(false);
          return;
        }

        // Verificar si tenemos un userId válido
        if (!userId || userId === 'demo-user') {
          setError('User ID not available');
          setLoading(false);
          return;
        }

        // Obtener datos reales de la API
        const response = await fetchCallSummary(userId, startDate, endDate);
        console.log('CallSummaryChart - API Response:', response);
        setData(response.chart_data || []);
        
        // Calcular el valor total
        if (response.chart_data && response.chart_data.length > 0) {
          const totalMinutes = response.chart_data.reduce((sum, item) => sum + item.minutes, 0);
          setTotalValue(formatValue(totalMinutes));
        } else {
          setTotalValue('0');
        }
      } catch (err: any) {
        console.error('CallSummaryChart - Error:', err);
        
        // Manejar diferentes tipos de errores
        if (err.message?.includes('JWT token')) {
          setError('Session expired. Please log in again.');
        } else if (err.message?.includes('No JWT token')) {
          setError('Please log in to view call data');
        } else if (err.response?.status === 404) {
          setError('No call data found for the selected period');
        } else if (err.response?.status === 403) {
          setError('Access denied. Please check your permissions');
        } else {
          setError('Error loading call data. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId, startDate, endDate]);

  const formatValue = (value: number): string => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)} Mill`;
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(1)} K`;
    }
    return value.toString();
  };

  const formatMonth = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
  };

  // Transformar datos para Recharts
  const chartData = data.map(item => ({
    date: formatMonth(item.date),
    minutes: item.minutes,
    calls: item.calls
  }));

  // Filtrar meses únicos para evitar repeticiones
  const uniqueMonths = Array.from(new Set(chartData.map(item => item.date)));
  const filteredChartData = chartData.filter((item, index, array) => {
    // Mantener solo la primera aparición de cada mes
    return array.findIndex(d => d.date === item.date) === index;
  });

  console.log('CallSummaryChart - Render state:', { loading, error, dataLength: data.length, totalValue, uniqueMonths });

  if (loading) {
    return (
      <div className="call-summary-chart">
        <div className="chart-loading">Loading call data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="call-summary-chart">
        <div className="chart-error">
          <div style={{ fontSize: '14px', marginBottom: '8px' }}>⚠️</div>
          {error}
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="call-summary-chart">
        <div className="chart-error">
          <div style={{ fontSize: '14px', marginBottom: '8px' }}>📊</div>
          No call data available for the selected period
        </div>
      </div>
    );
  }

  return (
    <div className="call-summary-chart">
      <div className="chart-header">
        <div className="chart-title">
          <div className="chart-value">{totalValue}</div>
          <div className="chart-label">Call summary</div>
        </div>
      </div>
      <div className="chart-container">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={filteredChartData}
            margin={{
              top: 10,
              right: 30,
              left: 0,
              bottom: 30,
            }}
          >
            <defs>
              <linearGradient id="colorMinutes" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.02}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="0" stroke="transparent" />
            <XAxis 
              dataKey="date" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#6b7280' }}
              tickMargin={10}
              interval="preserveStartEnd" // Solo mostrar etiquetas al inicio y final
            />
            <YAxis 
              hide={true}
              domain={['dataMin - 20', 'dataMax + 20']} // Más espacio para las ondulaciones
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'white', 
                border: 'none', 
                borderRadius: '8px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
              }}
              labelStyle={{ color: '#6b7280', fontWeight: 'bold' }}
              formatter={(value: any) => [`${value} minutes`, 'Minutes']}
            />
            <Area
              type="natural" // Cambiar a 'natural' para curvas más ondulantes
              dataKey="minutes"
              stroke="#3b82f6"
              strokeWidth={4}
              fill="url(#colorMinutes)"
              fillOpacity={1}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CallSummaryChart; 