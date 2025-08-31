'use client';

import { useState, useEffect } from 'react';
import { SimpleModal } from './components/ui/SimpleModal';
import { SimpleDropdown } from './components/ui/SimpleDropdown';
import { MainContent } from './components/layout/MainContent';
import { useTranslation } from './components/hooks/useTranslation';
import { AddTaskModal } from './components/forms/AddTaskModal';

export default function TaskManager() {
  // React State Management
  const [activeNavItem, setActiveNavItem] = useState('homeNav');
  const [currentLanguage, setCurrentLanguage] = useState<'ka' | 'en'>('ka');
  const [isProjectsOpen, setIsProjectsOpen] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<number | null>(null);
  const [newProjectName, setNewProjectName] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [projectToEdit, setProjectToEdit] = useState<number | null>(null);
  const [editProjectName, setEditProjectName] = useState('');
  const [projects, setProjects] = useState<
    Array<{ id: number; name: string; isOpen: boolean }>
  >([]);
  const [tasks, setTasks] = useState<
    Array<{
      id: number;
      name: string;
      priority: 'high' | 'medium' | 'low';
      completed: boolean;
      createdAt: string;
    }>
  >([]);
  const [projectTasks, setProjectTasks] = useState<
    Array<{
      id: number;
      name: string;
      priority: 'high' | 'medium' | 'low';
      completed: boolean;
      createdAt: string;
      projectId: number;
    }>
  >([]);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<{
    id: number;
    name: string;
  } | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Load language from localStorage on component mount
  useEffect(() => {
    const savedLanguage =
      (localStorage.getItem('language') as 'ka' | 'en') || 'ka';
    setCurrentLanguage(savedLanguage);
  }, []);

  // Save data to localStorage (debounced)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      localStorage.setItem('task-manager-projects', JSON.stringify(projects));
      localStorage.setItem('task-manager-tasks', JSON.stringify(tasks));
      localStorage.setItem(
        'task-manager-project-tasks',
        JSON.stringify(projectTasks)
      );
      localStorage.setItem('task-manager-nav', activeNavItem);
      localStorage.setItem(
        'task-manager-projects-open',
        JSON.stringify(isProjectsOpen)
      );
    }, 100); // Reduced delay from 300ms to 100ms

    return () => clearTimeout(timeoutId);
  }, [projects, tasks, projectTasks, activeNavItem, isProjectsOpen]);

  // Authentication check and load data from localStorage after hydration
  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');

    // If not authenticated, redirect to login
    if (!isAuthenticated || isAuthenticated !== 'true') {
      window.location.href = '/login';
      return;
    }

    const savedNav = localStorage.getItem('task-manager-nav');
    if (savedNav) {
      setActiveNavItem(savedNav);
    }

    const savedProjects = localStorage.getItem('task-manager-projects');
    if (savedProjects) {
      try {
        const parsed = JSON.parse(savedProjects);
        setProjects(parsed);
      } catch {
        // Keep empty array if parsing fails
        setProjects([]);
      }
    }

    const savedTasks = localStorage.getItem('task-manager-tasks');
    if (savedTasks) {
      try {
        const parsed = JSON.parse(savedTasks);
        setTasks(parsed);
      } catch {
        // Keep empty array if parsing fails
        setTasks([]);
      }
    }

    const savedProjectTasks = localStorage.getItem(
      'task-manager-project-tasks'
    );
    if (savedProjectTasks) {
      try {
        const parsed = JSON.parse(savedProjectTasks);
        setProjectTasks(parsed);
      } catch {
        // Keep empty array if parsing fails
        setProjectTasks([]);
      }
    }

    const savedProjectsOpen = localStorage.getItem(
      'task-manager-projects-open'
    );
    if (savedProjectsOpen) {
      try {
        setIsProjectsOpen(JSON.parse(savedProjectsOpen));
      } catch {
        // Keep default false
      }
    }
  }, []);

  // Translation hook
  const { t } = useTranslation(currentLanguage);

  // Language switch handler
  const toggleLanguage = () => {
    const newLanguage = currentLanguage === 'ka' ? 'en' : 'ka';
    setCurrentLanguage(newLanguage);
    localStorage.setItem('language', newLanguage);
  };

  // Navigation handler
  const handleNavClick = (navId: string) => {
    if (navId === 'addTaskNav') {
      setShowAddTaskModal(true);
    } else {
      setActiveNavItem(navId);
      // Clear selected project when navigating to other sections
      setSelectedProject(null);
    }
  };

  // Project menu handlers

  const confirmEdit = () => {
    if (projectToEdit && editProjectName.trim()) {
      setProjects(
        projects.map((p) =>
          p.id === projectToEdit ? { ...p, name: editProjectName.trim() } : p
        )
      );
      setProjectToEdit(null);
      setEditProjectName('');
    }
    setShowEditModal(false);
  };

  const cancelEdit = () => {
    setProjectToEdit(null);
    setEditProjectName('');
    setShowEditModal(false);
  };

  const deleteProject = (projectId: number) => {
    setProjectToDelete(projectId);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (projectToDelete) {
      setProjects(projects.filter((p) => p.id !== projectToDelete));
      setProjectToDelete(null);
    }
    setShowDeleteModal(false);
  };

  const cancelDelete = () => {
    setProjectToDelete(null);
    setShowDeleteModal(false);
  };

  const createProject = () => {
    if (newProjectName.trim()) {
      const newProject = {
        id: Date.now(),
        name: newProjectName.trim(),
        isOpen: false,
      };
      setProjects([...projects, newProject]);
      setNewProjectName('');
      setShowCreateModal(false);
      // Automatically open projects section after creating new project
      setIsProjectsOpen(true);
    }
  };

  const cancelCreate = () => {
    setNewProjectName('');
    setShowCreateModal(false);
  };

  const handleProjectClick = (project: {
    id: number;
    name: string;
    isOpen: boolean;
  }) => {
    // Set activeNavItem to project ID (like other nav buttons)
    setActiveNavItem(`project-${project.id}`);
    // Set selected project to show in main content
    setSelectedProject({ id: project.id, name: project.name });
    // Also toggle the project open state in sidebar
    setProjects(
      projects.map((p) =>
        p.id === project.id ? { ...p, isOpen: !p.isOpen } : p
      )
    );
  };

  const handleAddTask = (
    taskName: string,
    priority: 'high' | 'medium' | 'low'
  ) => {
    const newTask = {
      id: Date.now(),
      name: taskName,
      priority: priority,
      completed: false,
      createdAt: new Date().toISOString(),
    };
    setTasks([...tasks, newTask]);
  };

  const handleAddProjectTask = (
    projectId: number,
    taskName: string,
    priority: 'high' | 'medium' | 'low'
  ) => {
    const newProjectTask = {
      id: Date.now(),
      name: taskName,
      priority: priority,
      completed: false,
      createdAt: new Date().toISOString(),
      projectId: projectId,
    };
    setProjectTasks([...projectTasks, newProjectTask]);
  };

  // Task management functions
  const handleEditTask = (
    taskId: number,
    newName: string,
    newPriority: 'high' | 'medium' | 'low'
  ) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId
          ? { ...task, name: newName, priority: newPriority }
          : task
      )
    );
  };

  const handleDeleteTask = (taskId: number) => {
    setTasks(tasks.filter((task) => task.id !== taskId));
  };

  // Project task management functions
  const handleEditProjectTask = (
    taskId: number,
    newName: string,
    newPriority: 'high' | 'medium' | 'low'
  ) => {
    setProjectTasks(
      projectTasks.map((task) =>
        task.id === taskId
          ? { ...task, name: newName, priority: newPriority }
          : task
      )
    );
  };

  const handleDeleteProjectTask = (taskId: number) => {
    setProjectTasks(projectTasks.filter((task) => task.id !== taskId));
  };

  return (
    <>
      {/* Sidebar */}
      <div
        className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}
        id="sidebar"
      >
        <div className="sidebar-header">
          <div className="header-controls">
            <div className="profile-container">
              <div className="profile-button" id="profileBtn">
                <span className="profile-initials">👤</span>
              </div>
            </div>
            <div className="language-button" onClick={toggleLanguage}>
              <span>{currentLanguage.toUpperCase()}</span>
            </div>
          </div>
          <button
            className="collapse-btn"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          >
            {sidebarCollapsed ? '→' : '←'}
          </button>
        </div>

        <div className="sidebar-content">
          <nav className="sidebar-nav">
            <div
              className={`nav-item ${activeNavItem === 'homeNav' ? 'active' : ''}`}
              onClick={() => handleNavClick('homeNav')}
            >
              <span className="nav-icon">🏠</span>
              <span>{t('home')}</span>
            </div>
            <div
              className={`nav-item ${activeNavItem === 'addTaskNav' ? 'active' : ''}`}
              onClick={() => handleNavClick('addTaskNav')}
            >
              <span>{t('addTask')}</span>
            </div>
            <div
              className={`nav-item ${activeNavItem === 'searchNav' ? 'active' : ''}`}
              onClick={() => handleNavClick('searchNav')}
            >
              <span>{t('search')}</span>
            </div>
            <div
              className={`nav-item ${activeNavItem === 'todayNav' ? 'active' : ''}`}
              onClick={() => handleNavClick('todayNav')}
            >
              <span>{t('today')}</span>
            </div>
            <div
              className={`nav-item ${activeNavItem === 'upcomingNav' ? 'active' : ''}`}
              onClick={() => handleNavClick('upcomingNav')}
            >
              <span>{t('upcoming')}</span>
            </div>
            <div
              className={`nav-item ${activeNavItem === 'completedNav' ? 'active' : ''}`}
              onClick={() => handleNavClick('completedNav')}
            >
              <span>{t('completed')}</span>
            </div>
          </nav>

          {/* Projects Section */}
          <div className="action-buttons">
            <button
              className="create-project-btn"
              onClick={() => setShowCreateModal(true)}
            >
              <span className="btn-icon">+</span>
              <span>{t('createProject')}</span>
            </button>
          </div>

          <div className="projects-section" id="projectsSection">
            <div
              className="section-header"
              onClick={() => setIsProjectsOpen(!isProjectsOpen)}
            >
              <h3>{t('myProjects')}</h3>
              <span
                className={`dropdown-arrow ${isProjectsOpen ? 'open' : ''}`}
              >
                ▼
              </span>
            </div>
            {isProjectsOpen && (
              <ul className="projects-list" id="projectsList">
                {projects.map((project) => (
                  <li
                    key={project.id}
                    className={`project-item ${activeNavItem === `project-${project.id}` ? 'active' : ''}`}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        width: '100%',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          cursor: 'pointer',
                          flex: 1,
                        }}
                        onClick={() => handleProjectClick(project)}
                      >
                        <span style={{ marginRight: '8px', fontSize: '12px' }}>
                          {project.isOpen ? '📂' : '📁'}
                        </span>
                        <span className="project-name">{project.name}</span>
                      </div>
                      <SimpleDropdown
                        projectId={project.id}
                        projectName={project.name}
                        onDelete={deleteProject}
                        currentLanguage={currentLanguage}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div
        className={`main-content ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}
      >
        <MainContent
          tasks={tasks}
          projectTasks={projectTasks}
          currentLanguage={currentLanguage}
          activeNavItem={activeNavItem}
          selectedProject={selectedProject}
          onAddProjectTask={handleAddProjectTask}
          onEditTask={handleEditTask}
          onDeleteTask={handleDeleteTask}
          onEditProjectTask={handleEditProjectTask}
          onDeleteProjectTask={handleDeleteProjectTask}
          t={t}
        />
      </div>

      {/* Create Project Modal */}
      <SimpleModal
        isOpen={showCreateModal}
        onClose={cancelCreate}
        title={t('createProject')}
      >
        <div>
          <label
            style={{
              display: 'block',
              marginBottom: '8px',
              fontWeight: '600',
              color: '#2c3e50',
            }}
          >
            {currentLanguage === 'ka' ? 'პროექტის სახელი:' : 'Project Name:'}
          </label>
          <input
            type="text"
            value={newProjectName}
            onChange={(e) => setNewProjectName(e.target.value)}
            placeholder={
              currentLanguage === 'ka'
                ? 'შეიყვანეთ პროექტის სახელი'
                : 'Enter project name'
            }
            autoFocus
            onKeyPress={(e) => e.key === 'Enter' && createProject()}
            style={{
              width: '100%',
              padding: '12px',
              border: '2px solid #e9ecef',
              borderRadius: '8px',
              fontSize: '16px',
              marginBottom: '20px',
            }}
          />
          <div
            style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}
          >
            <button
              onClick={cancelCreate}
              style={{
                padding: '10px 20px',
                background: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
              }}
            >
              {currentLanguage === 'ka' ? 'გაუქმება' : 'Cancel'}
            </button>
            <button
              onClick={createProject}
              disabled={!newProjectName.trim()}
              style={{
                padding: '10px 20px',
                background: newProjectName.trim() ? '#27ae60' : '#ccc',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: newProjectName.trim() ? 'pointer' : 'not-allowed',
              }}
            >
              {currentLanguage === 'ka' ? 'შექმნა' : 'Create'}
            </button>
          </div>
        </div>
      </SimpleModal>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && projectToDelete && (
        <div
          className="modal-overlay"
          onClick={(e) => e.target === e.currentTarget && cancelDelete()}
        >
          <div className="modal">
            <div className="modal-header">
              <h3>
                {currentLanguage === 'ka' ? 'პროექტის წაშლა' : 'Delete Project'}
              </h3>
            </div>
            <div className="modal-body">
              <p>
                {currentLanguage === 'ka'
                  ? `დარწმუნებული ხარ რომ გინდა "${projects.find((p) => p.id === projectToDelete)?.name}" პროექტის წაშლა?`
                  : `Are you sure you want to delete "${projects.find((p) => p.id === projectToDelete)?.name}" project?`}
              </p>
            </div>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={cancelDelete}>
                {currentLanguage === 'ka' ? 'გაუქმება' : 'Cancel'}
              </button>
              <button className="btn-danger" onClick={confirmDelete}>
                {currentLanguage === 'ka' ? 'წაშლა' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Project Modal */}
      {showEditModal && projectToEdit && (
        <div
          className="modal-overlay"
          onClick={(e) => e.target === e.currentTarget && cancelEdit()}
        >
          <div className="modal">
            <div className="modal-header">
              <h3>{t('edit')}</h3>
            </div>
            <div className="modal-body">
              <div className="input-group">
                <label>
                  {currentLanguage === 'ka'
                    ? 'პროექტის სახელი:'
                    : 'Project Name:'}
                </label>
                <input
                  type="text"
                  value={editProjectName}
                  onChange={(e) => setEditProjectName(e.target.value)}
                  placeholder={
                    currentLanguage === 'ka'
                      ? 'შეიყვანეთ პროექტის სახელი'
                      : 'Enter project name'
                  }
                  autoFocus
                  onKeyPress={(e) => e.key === 'Enter' && confirmEdit()}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={cancelEdit}>
                {currentLanguage === 'ka' ? 'გაუქმება' : 'Cancel'}
              </button>
              <button
                className="btn-primary"
                onClick={confirmEdit}
                disabled={!editProjectName.trim()}
              >
                {currentLanguage === 'ka' ? 'შენახვა' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Task Modal */}
      <AddTaskModal
        isOpen={showAddTaskModal}
        onClose={() => setShowAddTaskModal(false)}
        onSubmit={handleAddTask}
        currentLanguage={currentLanguage}
      />
    </>
  );
}
