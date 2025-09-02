'use client';

import { useState, useRef, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

interface DatePickerProps {
  value?: Date | null;
  onChange: (date: Date | null) => void;
  placeholder?: string;
  currentLanguage: 'ka' | 'en';
  label?: string;
}

export function DatePicker({
  value,
  onChange,
  placeholder,
  currentLanguage,
  label,
}: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(value || null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close calendar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDateChange = (value: any) => {
    const date = Array.isArray(value) ? value[0] : value;
    const selectedDate = date instanceof Date ? date : null;
    setSelectedDate(selectedDate);
    onChange(selectedDate);
    setIsOpen(false);
  };

  const formatDate = (date: Date | null) => {
    if (!date) return '';
    return currentLanguage === 'ka'
      ? date.toLocaleDateString('ka-GE')
      : date.toLocaleDateString('en-US');
  };

  const clearDate = () => {
    setSelectedDate(null);
    onChange(null);
  };

  return (
    <div ref={containerRef} style={{ position: 'relative', width: '100%' }}>
      {label && (
        <label
          style={{
            display: 'block',
            marginBottom: '8px',
            fontWeight: '600',
            color: '#2c3e50',
            fontSize: '14px',
          }}
        >
          {label}
        </label>
      )}

      <div
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '14px 16px',
          border: '2px solid #e9ecef',
          borderRadius: '10px',
          backgroundColor: 'white',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          fontSize: '16px',
          position: 'relative',
        }}
        onMouseEnter={(e) => {
          (e.target as HTMLElement).style.borderColor = '#4da8da';
        }}
        onMouseLeave={(e) => {
          if (!isOpen) {
            (e.target as HTMLElement).style.borderColor = '#e9ecef';
          }
        }}
      >
        <span
          style={{
            flex: 1,
            color: selectedDate ? '#2c3e50' : '#95a5a6',
          }}
        >
          {selectedDate
            ? formatDate(selectedDate)
            : placeholder ||
              (currentLanguage === 'ka' ? 'აირჩიეთ თარიღი' : 'Select date')}
        </span>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {selectedDate && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                clearDate();
              }}
              style={{
                background: 'none',
                border: 'none',
                color: '#95a5a6',
                cursor: 'pointer',
                fontSize: '18px',
                padding: '0',
                display: 'flex',
                alignItems: 'center',
              }}
              title={
                currentLanguage === 'ka' ? 'თარიღის გასუფთავება' : 'Clear date'
              }
            >
              ×
            </button>
          )}

          <span
            style={{
              color: '#4da8da',
              fontSize: '16px',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            📅
          </span>
        </div>
      </div>

      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: '100%',
            zIndex: 1000,
            marginLeft: '8px',
            background: 'white',
            borderRadius: '12px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
            border: '1px solid #e9ecef',
            overflow: 'hidden',
            minWidth: '300px',
          }}
        >
          <Calendar
            onChange={handleDateChange}
            value={selectedDate}
            locale={currentLanguage === 'ka' ? 'ka-GE' : 'en-US'}
            minDate={new Date()}
            className="custom-date-picker"
          />
        </div>
      )}

      <style jsx>{`
        .custom-date-picker {
          width: 100%;
          border: none !important;
          font-family: inherit;
        }
        .custom-date-picker .react-calendar__navigation {
          background: #4da8da;
          margin-bottom: 0;
          padding: 12px;
        }
        .custom-date-picker .react-calendar__navigation button {
          color: white !important;
          font-weight: 600;
          font-size: 14px;
          background: none;
          border: none;
          padding: 8px;
        }
        .custom-date-picker .react-calendar__navigation button:hover {
          background: rgba(255, 255, 255, 0.1) !important;
        }
        .custom-date-picker .react-calendar__month-view__weekdays {
          background: #f8f9fa;
          padding: 8px 0;
        }
        .custom-date-picker .react-calendar__month-view__weekdays__weekday {
          color: #6c757d !important;
          font-weight: 600;
          font-size: 12px;
          padding: 4px;
        }
        .custom-date-picker .react-calendar__tile {
          padding: 12px 8px;
          background: none;
          border: none;
          color: #2c3e50;
          font-size: 14px;
          transition: all 0.2s ease;
        }
        .custom-date-picker .react-calendar__tile:hover {
          background: #e3f2fd !important;
          color: #4da8da !important;
        }
        .custom-date-picker .react-calendar__tile--active {
          background: #4da8da !important;
          color: white !important;
        }
        .custom-date-picker .react-calendar__tile--now {
          background: #fff3cd;
          font-weight: 600;
        }
        .custom-date-picker .react-calendar__month-view__days__day--weekend {
          color: #e74c3c;
        }
      `}</style>
    </div>
  );
}
