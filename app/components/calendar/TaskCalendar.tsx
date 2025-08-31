'use client';

import { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

interface Task {
  id: number;
  name: string;
  priority: 'high' | 'medium' | 'low';
  completed: boolean;
  createdAt: string;
  dueDate?: string;
}

interface ProjectTask {
  id: number;
  name: string;
  priority: 'high' | 'medium' | 'low';
  completed: boolean;
  createdAt: string;
  projectId: number;
  dueDate?: string;
}

interface TaskCalendarProps {
  tasks: Task[];
  projectTasks: ProjectTask[];
  onDateSelect: (date: Date) => void;
  onAddTask?: (date: Date) => void;
  currentLanguage: 'ka' | 'en';
}

export function TaskCalendar({
  tasks,
  projectTasks,
  onDateSelect,
  onAddTask,
  currentLanguage,
}: TaskCalendarProps) {
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Get tasks for a specific date
  const getTasksForDate = (date: Date) => {
    const dateString = date.toDateString();

    const dayTasks = tasks.filter((task) => {
      const taskDate = task.dueDate
        ? new Date(task.dueDate)
        : new Date(task.createdAt);
      return taskDate.toDateString() === dateString;
    });

    const dayProjectTasks = projectTasks.filter((task) => {
      const taskDate = task.dueDate
        ? new Date(task.dueDate)
        : new Date(task.createdAt);
      return taskDate.toDateString() === dateString;
    });

    return [...dayTasks, ...dayProjectTasks];
  };

  // Handle date change
  const handleDateChange = (value: any) => {
    const date = Array.isArray(value) ? value[0] : value;
    setSelectedDate(date);
    onDateSelect(date);
  };

  // Custom tile content - show task indicators
  const tileContent = ({ date, view }: { date: Date; view: string }) => {
    if (view === 'month') {
      const dayTasks = getTasksForDate(date);
      if (dayTasks.length > 0) {
        const completedTasks = dayTasks.filter((task) => task.completed).length;
        const highPriorityTasks = dayTasks.filter(
          (task) => task.priority === 'high'
        ).length;

        return (
          <div className="task-indicators">
            {dayTasks.length > 0 && (
              <div
                className="task-count"
                style={{
                  background:
                    completedTasks === dayTasks.length ? '#27ae60' : '#4da8da',
                  color: 'white',
                  fontSize: '10px',
                  borderRadius: '10px',
                  padding: '1px 4px',
                  minWidth: '14px',
                  height: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: '2px',
                }}
              >
                {dayTasks.length}
              </div>
            )}
            {highPriorityTasks > 0 && (
              <div
                style={{
                  width: '4px',
                  height: '4px',
                  background: '#e74c3c',
                  borderRadius: '50%',
                  position: 'absolute',
                  top: '2px',
                  right: '2px',
                }}
              />
            )}
          </div>
        );
      }
    }
    return null;
  };

  // Selected date tasks
  const selectedDateTasks = getTasksForDate(selectedDate);

  return (
    <div
      className="task-calendar-container"
      style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
    >
      <div
        className="calendar-header"
        style={{ marginBottom: '20px', textAlign: 'center' }}
      >
        <h3
          style={{
            color: '#2c3e50',
            margin: '0 0 8px 0',
            fontSize: '20px',
            fontWeight: '700',
          }}
        >
          {currentLanguage === 'ka' ? 'კალენდარი' : 'Calendar'}
        </h3>
        <p style={{ color: '#7f8c8d', margin: 0, fontSize: '14px' }}>
          {currentLanguage === 'ka'
            ? 'აირჩიეთ თარიღი ტასკების სანახავად'
            : 'Select a date to view tasks'}
        </p>
      </div>

      <div
        className="calendar-wrapper"
        style={{
          background: 'white',
          borderRadius: '12px',
          padding: '20px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        }}
      >
        <Calendar
          onChange={handleDateChange}
          value={selectedDate}
          tileContent={tileContent}
          locale={currentLanguage === 'ka' ? 'ka-GE' : 'en-US'}
          className="custom-calendar"
        />
      </div>

      {selectedDateTasks.length > 0 && (
        <div
          className="selected-date-tasks"
          style={{
            marginTop: '20px',
            background: 'white',
            borderRadius: '12px',
            padding: '20px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          }}
        >
          <h4
            style={{
              color: '#2c3e50',
              margin: '0 0 16px 0',
              fontSize: '16px',
              fontWeight: '600',
            }}
          >
            {currentLanguage === 'ka'
              ? `${selectedDate.toLocaleDateString('ka-GE')}-ის ტასკები`
              : `Tasks for ${selectedDate.toLocaleDateString('en-US')}`}
          </h4>
          <div className="task-list">
            {selectedDateTasks.map((task) => (
              <div
                key={`${task.id}-${(task as ProjectTask).projectId || 'general'}`}
                className="task-item"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '8px 0',
                  borderBottom: '1px solid #f0f0f0',
                }}
              >
                <div
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    marginRight: '12px',
                    background:
                      task.priority === 'high'
                        ? '#e74c3c'
                        : task.priority === 'medium'
                          ? '#f1c40f'
                          : '#ffffff',
                    border:
                      task.priority === 'low' ? '2px solid #bdc3c7' : 'none',
                  }}
                />
                <span
                  style={{
                    flex: 1,
                    textDecoration: task.completed ? 'line-through' : 'none',
                    color: task.completed ? '#95a5a6' : '#2c3e50',
                    fontSize: '14px',
                  }}
                >
                  {task.name}
                </span>
                {task.completed && (
                  <span
                    style={{
                      color: '#27ae60',
                      fontSize: '12px',
                      marginLeft: '8px',
                    }}
                  >
                    ✓
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {onAddTask && (
        <div
          className="calendar-actions"
          style={{ marginTop: '16px', textAlign: 'center' }}
        >
          <button
            onClick={() => onAddTask(selectedDate)}
            style={{
              background: 'linear-gradient(135deg, #4da8da 0%, #80d8c3 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              padding: '12px 20px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: '0 4px 12px rgba(77, 168, 218, 0.3)',
            }}
            onMouseEnter={(e) => {
              (e.target as HTMLButtonElement).style.transform =
                'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLButtonElement).style.transform = 'translateY(0)';
            }}
          >
            {currentLanguage === 'ka'
              ? `${selectedDate.toLocaleDateString('ka-GE')}-ზე ტასკის დამატება`
              : `Add task for ${selectedDate.toLocaleDateString('en-US')}`}
          </button>
        </div>
      )}

      <style jsx>{`
        .custom-calendar {
          width: 100%;
          border: none !important;
          font-family: inherit;
        }
        .custom-calendar .react-calendar__navigation {
          background: #4da8da;
          margin-bottom: 16px;
          border-radius: 8px;
        }
        .custom-calendar .react-calendar__navigation button {
          color: white !important;
          font-weight: 600;
          font-size: 16px;
          background: none;
          border: none;
          padding: 12px;
        }
        .custom-calendar .react-calendar__navigation button:hover {
          background: rgba(255, 255, 255, 0.1) !important;
        }
        .custom-calendar .react-calendar__month-view__weekdays {
          background: #f8f9fa;
          border-radius: 6px;
          margin-bottom: 8px;
        }
        .custom-calendar .react-calendar__month-view__weekdays__weekday {
          color: #6c757d !important;
          font-weight: 600;
          font-size: 12px;
          padding: 8px;
          text-align: center;
        }
        .custom-calendar .react-calendar__tile {
          position: relative;
          padding: 8px 4px;
          background: none;
          border: 1px solid #f0f0f0;
          color: #2c3e50;
          font-size: 14px;
        }
        .custom-calendar .react-calendar__tile:hover {
          background: #e3f2fd !important;
        }
        .custom-calendar .react-calendar__tile--active {
          background: #4da8da !important;
          color: white !important;
        }
        .custom-calendar .react-calendar__tile--now {
          background: #fff3cd;
        }
        .task-indicators {
          position: absolute;
          bottom: 2px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          align-items: center;
          justify-content: center;
        }
      `}</style>
    </div>
  );
}
