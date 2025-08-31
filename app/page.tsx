'use client';

import { useState, useEffect } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { MainContent } from './components/layout/MainContent';
import { ProjectModal } from './components/forms/ProjectModal';
import { ConfirmationModal } from './components/forms/ConfirmationModal';
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
      dueDate?: string;
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
      dueDate?: string;
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
    priority: 'high' | 'medium' | 'low',
    dueDate?: Date | null
  ) => {
    const newTask = {
      id: Date.now(),
      name: taskName,
      priority: priority,
      completed: false,
      createdAt: new Date().toISOString(),
      dueDate: dueDate ? dueDate.toISOString() : undefined,
    };
    setTasks([...tasks, newTask]);
  };

  const handleAddProjectTask = (
    projectId: number,
    taskName: string,
    priority: 'high' | 'medium' | 'low',
    dueDate?: Date | null
  ) => {
    const newProjectTask = {
      id: Date.now(),
      name: taskName,
      priority: priority,
      completed: false,
      createdAt: new Date().toISOString(),
      projectId: projectId,
      dueDate: dueDate ? dueDate.toISOString() : undefined,
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
      <Sidebar
        activeNavItem={activeNavItem}
        currentLanguage={currentLanguage}
        sidebarCollapsed={sidebarCollapsed}
        isProjectsOpen={isProjectsOpen}
        projects={projects}
        onNavClick={handleNavClick}
        onToggleLanguage={toggleLanguage}
        onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
        onToggleProjects={() => setIsProjectsOpen(!isProjectsOpen)}
        onProjectClick={handleProjectClick}
        onCreateProject={() => setShowCreateModal(true)}
        onDeleteProject={deleteProject}
        t={t}
      />

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

      <ProjectModal
        isOpen={showCreateModal}
        mode="create"
        projectName={newProjectName}
        currentLanguage={currentLanguage}
        onClose={cancelCreate}
        onSubmit={(e) => {
          e.preventDefault();
          createProject();
        }}
        onProjectNameChange={setNewProjectName}
        t={t}
      />

      <ConfirmationModal
        isOpen={showDeleteModal && projectToDelete !== null}
        title={currentLanguage === 'ka' ? 'პროექტის წაშლა' : 'Delete Project'}
        message={
          currentLanguage === 'ka'
            ? `დარწმუნებული ხარ რომ გინდა "${projects.find((p) => p.id === projectToDelete)?.name}" პროექტის წაშლა?`
            : `Are you sure you want to delete "${projects.find((p) => p.id === projectToDelete)?.name}" project?`
        }
        confirmText={currentLanguage === 'ka' ? 'წაშლა' : 'Delete'}
        cancelText={currentLanguage === 'ka' ? 'გაუქმება' : 'Cancel'}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        variant="danger"
      />

      <ProjectModal
        isOpen={showEditModal}
        mode="edit"
        projectName={editProjectName}
        currentLanguage={currentLanguage}
        onClose={cancelEdit}
        onSubmit={(e) => {
          e.preventDefault();
          confirmEdit();
        }}
        onProjectNameChange={setEditProjectName}
        t={t}
      />

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
