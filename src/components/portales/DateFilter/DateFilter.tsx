import React, { useState, useEffect } from 'react';
import { PiCalendar, PiArrowRight, PiCaretLeft, PiCaretRight } from 'react-icons/pi';
import './DateFilter.css';

interface DateFilterProps {
  onDateChange?: (startDate: string, endDate: string) => void;
  initialStartDate?: string;
  initialEndDate?: string;
}

const DateFilter: React.FC<DateFilterProps> = ({ 
  onDateChange, 
  initialStartDate, 
  initialEndDate 
}) => {
  // Calcular fechas por defecto si no se proporcionan
  const getDefaultDates = () => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 30);
    
    return {
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0]
    };
  };

  const defaultDates = getDefaultDates();
  
  const [startDate, setStartDate] = useState(initialStartDate || defaultDates.startDate);
  const [endDate, setEndDate] = useState(initialEndDate || defaultDates.endDate);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date(startDate));
  const [selectedDate, setSelectedDate] = useState(new Date(startDate));

  console.log('DateFilter component is rendering!');

  // Efecto para actualizar fechas cuando cambien las props iniciales
  useEffect(() => {
    if (initialStartDate && initialEndDate) {
      setStartDate(initialStartDate);
      setEndDate(initialEndDate);
      setCurrentMonth(new Date(initialStartDate));
      setSelectedDate(new Date(initialStartDate));
    }
  }, [initialStartDate, initialEndDate]);

  // Efecto para llamar onDateChange al montar el componente
  useEffect(() => {
    if (onDateChange) {
      onDateChange(startDate, endDate);
    }
  }, []); // Solo al montar

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();

    const days = [];
    
    // Días del mes anterior
    const prevMonth = new Date(year, month - 1, 0);
    const daysInPrevMonth = prevMonth.getDate();
    for (let i = startingDay - 1; i >= 0; i--) {
      days.push({
        day: daysInPrevMonth - i,
        month: month - 1,
        year: year,
        isCurrentMonth: false
      });
    }

    // Días del mes actual
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        day: i,
        month: month,
        year: year,
        isCurrentMonth: true
      });
    }

    // Días del mes siguiente
    const remainingDays = 42 - days.length; // 6 semanas * 7 días
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        day: i,
        month: month + 1,
        year: year,
        isCurrentMonth: false
      });
    }

    return days;
  };

  const handleDateSelect = (day: number, month: number, year: number) => {
    const newDate = new Date(year, month, day);
    setSelectedDate(newDate);
    
    const dateString = newDate.toISOString().split('T')[0];
    
    if (showStartPicker) {
      setStartDate(dateString);
      if (onDateChange) {
        onDateChange(`${dateString} 00:00`, `${endDate} 23:59`);
      }
      setShowStartPicker(false);
    } else if (showEndPicker) {
      setEndDate(dateString);
      if (onDateChange) {
        onDateChange(`${startDate} 00:00`, `${dateString} 23:59`);
      }
      setShowEndPicker(false);
    }
  };

  const isSelectedDate = (day: number, month: number, year: number) => {
    const currentDate = new Date(year, month, day);
    return currentDate.toDateString() === selectedDate.toDateString();
  };

  const formatDisplayDate = (date: string, time: string) => {
    const dateObj = new Date(`${date} ${time}`);
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const month = months[dateObj.getMonth()];
    const day = dateObj.getDate();
    const year = dateObj.getFullYear();
    const hours = dateObj.getHours().toString().padStart(2, '0');
    const minutes = dateObj.getMinutes().toString().padStart(2, '0');
    const seconds = dateObj.getSeconds().toString().padStart(2, '0');

    return `${month} ${day} ${year} - ${hours}:${minutes}:${seconds}`;
  };

  const handleStartFieldClick = () => {
    setShowStartPicker(true);
    setShowEndPicker(false);
    setSelectedDate(new Date(startDate));
    setCurrentMonth(new Date(startDate));
  };

  const handleEndFieldClick = () => {
    setShowEndPicker(true);
    setShowStartPicker(false);
    setSelectedDate(new Date(endDate));
    setCurrentMonth(new Date(endDate));
  };

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newMonth = parseInt(e.target.value);
    setCurrentMonth(new Date(currentMonth.getFullYear(), newMonth, 1));
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newYear = parseInt(e.target.value);
    setCurrentMonth(new Date(newYear, currentMonth.getMonth(), 1));
  };

  const days = getDaysInMonth(currentMonth);

  return (
    <div className="date-filter-container">
      <div className="date-filter-horizontal">
        {/* Botón izquierdo con icono de calendario */}
        <button className="date-filter-btn date-filter-btn-left">
          <PiCalendar className="date-filter-icon" />
        </button>

        {/* Campo de fecha/hora de inicio - CLICKEABLE */}
        <div className="date-display-field" onClick={handleStartFieldClick}>
          <span className="date-display-text">
            {formatDisplayDate(startDate, '00:00')}
          </span>
        </div>

        {/* Separador con flecha */}
        <div className="date-separator">
          <PiArrowRight className="date-separator-icon" />
        </div>

        {/* Campo de fecha/hora de fin - CLICKEABLE */}
        <div className="date-display-field" onClick={handleEndFieldClick}>
          <span className="date-display-text">
            {formatDisplayDate(endDate, '23:59')}
          </span>
        </div>

        {/* Botón derecho con flecha */}
        <button className="date-filter-btn date-filter-btn-right">
          <PiArrowRight className="date-filter-icon" />
        </button>
      </div>

      {/* Calendario personalizado para fecha de inicio */}
      {showStartPicker && (
        <div className="date-picker-modal">
          <div className="calendar-container">
            {/* Header del calendario */}
            <div className="calendar-header">
              <button className="calendar-nav-btn" onClick={handlePrevMonth}>
                <PiCaretLeft />
              </button>
              <div className="calendar-title">
                <select 
                  value={currentMonth.getMonth()} 
                  onChange={handleMonthChange}
                  className="calendar-select"
                >
                  {months.map((month, index) => (
                    <option key={index} value={index}>{month}</option>
                  ))}
                </select>
                <select 
                  value={currentMonth.getFullYear()} 
                  onChange={handleYearChange}
                  className="calendar-select"
                >
                  {Array.from({length: 10}, (_, i) => 2020 + i).map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
              <button className="calendar-nav-btn" onClick={handleNextMonth}>
                <PiCaretRight />
              </button>
            </div>

            {/* Días de la semana */}
            <div className="calendar-weekdays">
              {daysOfWeek.map(day => (
                <div key={day} className="calendar-weekday">{day}</div>
              ))}
            </div>

            {/* Días del calendario */}
            <div className="calendar-grid">
              {days.map((dayInfo, index) => (
                <div
                  key={index}
                  className={`calendar-day ${
                    !dayInfo.isCurrentMonth ? 'other-month' : ''
                  } ${
                    isSelectedDate(dayInfo.day, dayInfo.month, dayInfo.year) ? 'selected' : ''
                  }`}
                  onClick={() => handleDateSelect(dayInfo.day, dayInfo.month, dayInfo.year)}
                >
                  {dayInfo.day}
                </div>
              ))}
            </div>

            {/* Footer con fecha seleccionada */}
            <div className="calendar-footer">
              <div className="calendar-footer-content">
                <PiArrowRight className="calendar-footer-icon" />
                <span className="calendar-footer-text">
                  {formatDisplayDate(startDate, '00:00')}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Calendario personalizado para fecha de fin */}
      {showEndPicker && (
        <div className="date-picker-modal">
          <div className="calendar-container">
            {/* Header del calendario */}
            <div className="calendar-header">
              <button className="calendar-nav-btn" onClick={handlePrevMonth}>
                <PiCaretLeft />
              </button>
              <div className="calendar-title">
                <select 
                  value={currentMonth.getMonth()} 
                  onChange={handleMonthChange}
                  className="calendar-select"
                >
                  {months.map((month, index) => (
                    <option key={index} value={index}>{month}</option>
                  ))}
                </select>
                <select 
                  value={currentMonth.getFullYear()} 
                  onChange={handleYearChange}
                  className="calendar-select"
                >
                  {Array.from({length: 10}, (_, i) => 2020 + i).map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
              <button className="calendar-nav-btn" onClick={handleNextMonth}>
                <PiCaretRight />
              </button>
            </div>

            {/* Días de la semana */}
            <div className="calendar-weekdays">
              {daysOfWeek.map(day => (
                <div key={day} className="calendar-weekday">{day}</div>
              ))}
            </div>

            {/* Días del calendario */}
            <div className="calendar-grid">
              {days.map((dayInfo, index) => (
                <div
                  key={index}
                  className={`calendar-day ${
                    !dayInfo.isCurrentMonth ? 'other-month' : ''
                  } ${
                    isSelectedDate(dayInfo.day, dayInfo.month, dayInfo.year) ? 'selected' : ''
                  }`}
                  onClick={() => handleDateSelect(dayInfo.day, dayInfo.month, dayInfo.year)}
                >
                  {dayInfo.day}
                </div>
              ))}
            </div>

            {/* Footer con fecha seleccionada */}
            <div className="calendar-footer">
              <div className="calendar-footer-content">
                <PiArrowRight className="calendar-footer-icon" />
                <span className="calendar-footer-text">
                  {formatDisplayDate(endDate, '23:59')}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DateFilter; 