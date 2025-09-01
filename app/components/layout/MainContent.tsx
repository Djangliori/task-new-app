'use client';

import { useState } from 'react';
import { AddTaskModal } from '../forms/AddTaskModal';
import { TaskDropdown } from '../ui/TaskDropdown';
import { getPriorityColor } from '../../utils/constants';
import type { Task } from '../../lib/supabase';

interface MainContentProps {
  tasks: Task[];
  currentLanguage: 'ka' | 'en';
  activeNavItem: string;
  selectedProject: { id: string; name: string } | null;
  onAddProjectTask: (
    projectId: string,
    taskName: string,
    priority: 'high' | 'medium' | 'low',
    dueDate?: Date | null
  ) => void;
  onEditTask: (
    taskId: string,
    newName: string,
    newPriority: 'high' | 'medium' | 'low'
  ) => void;
  onDeleteTask: (taskId: string) => void;
  onToggleTask: (taskId: string, completed: boolean) => void;
  t: (key: string) => string;
}

export function MainContent({
  tasks,
  currentLanguage,
  activeNavItem,
  selectedProject,
  onAddProjectTask,
  onEditTask,
  onDeleteTask,
  onToggleTask,
  t,
}: MainContentProps) {
  const [showProjectTaskModal, setShowProjectTaskModal] = useState(false);

  const renderContent = () => {
    switch (activeNavItem) {
      case 'homeNav':
        return (
          <div className="welcome-card">
            {/* Tasks Display */}
            {tasks.length > 0 && (
              <div>
                <h3
                  style={{
                    color: '#2c3e50',
                    marginBottom: '20px',
                    fontSize: '20px',
                    fontFamily: 'system-ui, -apple-system, sans-serif',
                  }}
                >
                  {currentLanguage === 'ka' ? 'ჩემი დავალებები' : 'My Tasks'}
                </h3>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                  }}
                >
                  {tasks.map((task) => (
                    <div
                      key={task.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '16px',
                        background: 'white',
                        borderRadius: '8px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                        border: `3px solid ${getPriorityColor(task.priority)}`,
                        fontFamily: 'system-ui, -apple-system, sans-serif',
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => onToggleTask(task.id, task.completed)}
                        style={{
                          marginRight: '12px',
                          transform: 'scale(1.2)',
                        }}
                      />
                      <div
                        style={{
                          width: '20px',
                          height: '20px',
                          borderRadius: '50%',
                          background: getPriorityColor(task.priority),
                          marginRight: '12px',
                          flexShrink: 0,
                        }}
                      />
                      <div style={{ flex: 1 }}>
                        <div
                          style={{
                            fontSize: '16px',
                            fontWeight: '600',
                            color: '#2c3e50',
                            marginBottom: '4px',
                          }}
                        >
                          {task.name}
                        </div>
                        {task.user_first_name && task.user_last_name && (
                          <div
                            style={{
                              fontSize: '12px',
                              color: '#7f8c8d',
                              fontStyle: 'italic',
                            }}
                          >
                            {task.user_first_name} {task.user_last_name}
                          </div>
                        )}
                      </div>
                      <TaskDropdown
                        taskId={task.id}
                        taskName={task.name}
                        taskPriority={task.priority}
                        onDelete={onDeleteTask}
                        onEdit={onEditTask}
                        currentLanguage={currentLanguage}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      case 'completedNav':
        return (
          <div className="welcome-card">
            <h2
              style={{
                color: '#2c3e50',
                fontSize: '24px',
                fontFamily: 'system-ui, -apple-system, sans-serif',
                textAlign: 'center',
              }}
            >
              {currentLanguage === 'ka'
                ? 'დასრულებული დავალებები'
                : 'Completed Tasks'}
            </h2>
          </div>
        );

      case 'todayNav':
        const today = new Date();
        const todayTasks = tasks.filter((task) => {
          const taskDate = task.due_date
            ? new Date(task.due_date)
            : new Date(task.created_at);
          return taskDate.toDateString() === today.toDateString();
        });

        return (
          <div className="welcome-card">
            <h2
              style={{
                color: '#2c3e50',
                fontSize: '24px',
                fontFamily: 'system-ui, -apple-system, sans-serif',
                textAlign: 'center',
                marginBottom: '24px',
              }}
            >
              {currentLanguage === 'ka'
                ? 'დღევანდელი დავალებები'
                : "Today's Tasks"}
            </h2>

            {todayTasks.length > 0 ? (
              <div style={{ textAlign: 'left' }}>
                {todayTasks.map((task) => (
                  <div
                    key={task.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '12px 0',
                      borderBottom: '1px solid #f0f0f0',
                    }}
                  >
                    <div
                      style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        marginRight: '12px',
                        border: `1px solid ${getPriorityColor(task.priority)}`,
                        background: 'white',
                      }}
                    />
                    <span
                      style={{
                        flex: 1,
                        textDecoration: task.completed
                          ? 'line-through'
                          : 'none',
                        color: task.completed ? '#95a5a6' : '#2c3e50',
                      }}
                    >
                      {task.name}
                    </span>
                    {task.completed && (
                      <span style={{ color: '#27ae60' }}>✓</span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ textAlign: 'center', color: '#7f8c8d' }}>
                {currentLanguage === 'ka'
                  ? 'დღეს არ გაქვს დავალებები'
                  : 'No tasks for today'}
              </p>
            )}
          </div>
        );

      case 'upcomingNav':
        return (
          <div className="welcome-card">
            <h2
              style={{
                color: '#2c3e50',
                fontSize: '24px',
                fontFamily: 'system-ui, -apple-system, sans-serif',
                textAlign: 'center',
              }}
            >
              {currentLanguage === 'ka'
                ? 'მომავალი დავალებები'
                : 'Upcoming Tasks'}
            </h2>
          </div>
        );

      case 'searchNav':
        return (
          <div className="welcome-card">
            <h2
              style={{
                color: '#2c3e50',
                fontSize: '24px',
                fontFamily: 'system-ui, -apple-system, sans-serif',
                textAlign: 'center',
              }}
            >
              {currentLanguage === 'ka' ? 'ძიება' : 'Search'}
            </h2>
          </div>
        );

      default:
        // Handle project-specific navigation
        if (activeNavItem.startsWith('project-') && selectedProject) {
          const currentProjectTasks = tasks.filter(
            (task) => task.project_id === selectedProject.id
          );

          return (
            <div className="welcome-card">
              <h2
                style={{
                  color: '#2c3e50',
                  fontSize: '24px',
                  fontFamily: 'system-ui, -apple-system, sans-serif',
                  textAlign: 'center',
                  marginBottom: '30px',
                }}
              >
                📂 {selectedProject.name}
              </h2>

              {/* Create New Task Button */}
              {currentProjectTasks.length === 0 && (
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '200px',
                  }}
                >
                  <button
                    onClick={() => setShowProjectTaskModal(true)}
                    style={{
                      background: 'none',
                      border: '2px solid #27ae60',
                      color: '#27ae60',
                      padding: '16px 24px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '18px',
                      fontWeight: '600',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      transition: 'all 0.2s',
                    }}
                    onMouseOver={(e) => {
                      (e.target as HTMLButtonElement).style.background =
                        '#27ae60';
                      (e.target as HTMLButtonElement).style.color = 'white';
                    }}
                    onMouseOut={(e) => {
                      (e.target as HTMLButtonElement).style.background = 'none';
                      (e.target as HTMLButtonElement).style.color = '#27ae60';
                    }}
                  >
                    <span>+</span>
                    <span>
                      {currentLanguage === 'ka'
                        ? 'ახალი დავალება'
                        : 'Create New Task'}
                    </span>
                  </button>
                </div>
              )}

              {/* Project Tasks Display */}
              {currentProjectTasks.length > 0 && (
                <div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '20px',
                    }}
                  >
                    <h3
                      style={{
                        color: '#2c3e50',
                        fontSize: '20px',
                        fontFamily: 'system-ui, -apple-system, sans-serif',
                        margin: 0,
                      }}
                    >
                      {currentLanguage === 'ka' ? 'დავალებები' : 'Tasks'}
                    </h3>
                    <button
                      onClick={() => setShowProjectTaskModal(true)}
                      style={{
                        background: 'none',
                        border: '1px solid #27ae60',
                        color: '#27ae60',
                        padding: '8px 12px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: '500',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      <span>+</span>
                      <span>{currentLanguage === 'ka' ? 'ახალი' : 'Add'}</span>
                    </button>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px',
                    }}
                  >
                    {currentProjectTasks.map((task) => (
                      <div
                        key={task.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          padding: '16px',
                          background: 'white',
                          borderRadius: '8px',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                          border: `3px solid ${getPriorityColor(task.priority)}`,
                          fontFamily: 'system-ui, -apple-system, sans-serif',
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={task.completed}
                          onChange={() => onToggleTask(task.id, task.completed)}
                          style={{
                            marginRight: '12px',
                            transform: 'scale(1.2)',
                          }}
                        />
                        <div
                          style={{
                            width: '20px',
                            height: '20px',
                            borderRadius: '50%',
                            background: getPriorityColor(task.priority),
                            marginRight: '12px',
                            flexShrink: 0,
                          }}
                        />
                        <div style={{ flex: 1 }}>
                          <div
                            style={{
                              fontSize: '16px',
                              fontWeight: '600',
                              color: '#2c3e50',
                              marginBottom: '4px',
                            }}
                          >
                            {task.name}
                          </div>
                          {task.user_first_name && task.user_last_name && (
                            <div
                              style={{
                                fontSize: '12px',
                                color: '#7f8c8d',
                                fontStyle: 'italic',
                              }}
                            >
                              {task.user_first_name} {task.user_last_name}
                            </div>
                          )}
                        </div>
                        <TaskDropdown
                          taskId={task.id}
                          taskName={task.name}
                          taskPriority={task.priority}
                          onDelete={onDeleteTask}
                          onEdit={onEditTask}
                          currentLanguage={currentLanguage}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        }

        return (
          <div className="welcome-card">
            <h2
              style={{
                color: '#2c3e50',
                fontSize: '24px',
                fontFamily: 'system-ui, -apple-system, sans-serif',
                textAlign: 'center',
              }}
            >
              {currentLanguage === 'ka' ? 'სუფთა გვერდი' : 'Clean Page'}
            </h2>
          </div>
        );
    }
  };

  return (
    <>
      <header className="app-header">
        <h1>{t('appTitle')}</h1>
        <div className="current-project" id="currentProjectName"></div>
      </header>

      <div className="welcome-section" id="welcomeSection">
        {renderContent()}
      </div>

      {/* Project Task Modal */}
      {selectedProject && (
        <AddTaskModal
          isOpen={showProjectTaskModal}
          onClose={() => setShowProjectTaskModal(false)}
          onSubmit={(taskName, priority, dueDate) => {
            onAddProjectTask(selectedProject.id, taskName, priority, dueDate);
            setShowProjectTaskModal(false);
          }}
          currentLanguage={currentLanguage}
        />
      )}
    </>
  );
}
