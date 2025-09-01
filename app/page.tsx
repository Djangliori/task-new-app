'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from './components/layout/Sidebar';
import { MainContent } from './components/layout/MainContent';
import { useTranslation } from './components/hooks/useTranslation';
import dynamic from 'next/dynamic';

// Lazy load modals to reduce initial bundle size
const ProjectModal = dynamic(
  () =>
    import('./components/forms/ProjectModal').then((mod) => ({
      default: mod.ProjectModal,
    })),
  {
    ssr: false,
  }
);

const ConfirmationModal = dynamic(
  () =>
    import('./components/forms/ConfirmationModal').then((mod) => ({
      default: mod.ConfirmationModal,
    })),
  {
    ssr: false,
  }
);

const AddTaskModal = dynamic(
  () =>
    import('./components/forms/AddTaskModal').then((mod) => ({
      default: mod.AddTaskModal,
    })),
  {
    ssr: false,
  }
);
import type { Project, Task, User } from './lib/supabase';
import { getSupabaseClient } from './lib/supabase';
import { logger } from './lib/logger';

export default function TaskManager() {
  // React State Management
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeNavItem, setActiveNavItem] = useState('homeNav');
  const [currentLanguage, setCurrentLanguage] = useState<'ka' | 'en'>('ka');
  const [isProjectsOpen, setIsProjectsOpen] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);
  const [newProjectName, setNewProjectName] = useState('');
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Load language from localStorage on component mount
  useEffect(() => {
    const savedLanguage =
      (localStorage.getItem('language') as 'ka' | 'en') || 'ka';
    setCurrentLanguage(savedLanguage);
  }, []);

  // Save UI preferences to localStorage (debounced)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      localStorage.setItem('task-manager-nav', activeNavItem);
      localStorage.setItem(
        'task-manager-projects-open',
        JSON.stringify(isProjectsOpen)
      );
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [activeNavItem, isProjectsOpen]);

  // Authentication check and load data from Supabase
  useEffect(() => {
    const checkUser = async () => {
      try {
        const supabase = getSupabaseClient();
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session) {
          // Immediate redirect to login - no loading screen
          router.replace('/login');
          return;
        }

        // Get user profile from users table
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (userError || !userData) {
          logger.error('Error loading user profile:', userError);
          router.replace('/login');
          return;
        }

        setUser(userData);
        await loadUserData(session.user.id);
        setLoading(false);
      } catch (error) {
        logger.error('Auth error:', error);
        router.replace('/login');
      }
    };

    checkUser();
  }, [router]);

  // Load user data from Supabase - parallel queries for better performance
  const loadUserData = async (userId: string) => {
    try {
      const supabase = getSupabaseClient();

      // Load projects and tasks in parallel for faster loading
      const [projectsResult, tasksResult] = await Promise.all([
        supabase
          .from('projects')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: true }),
        supabase
          .from('tasks')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false }),
      ]);

      if (projectsResult.error) throw projectsResult.error;
      if (tasksResult.error) throw tasksResult.error;

      // Update state with loaded data
      setProjects(projectsResult.data || []);
      setTasks(tasksResult.data || []);

      // Load UI preferences from localStorage
      const savedNav = localStorage.getItem('task-manager-nav');
      if (savedNav) {
        setActiveNavItem(savedNav);
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
    } catch (error) {
      logger.error('Error loading user data:', error);
    }
  };

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
      setSelectedProject(null);
    }
  };

  const deleteProject = (projectId: string) => {
    setProjectToDelete(projectId);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (projectToDelete && user) {
      try {
        const supabase = getSupabaseClient();
        const { error } = await supabase
          .from('projects')
          .delete()
          .eq('id', projectToDelete)
          .eq('user_id', user.id);

        if (error) throw error;

        setProjects(projects.filter((p) => p.id !== projectToDelete));
        setProjectToDelete(null);
      } catch (error) {
        logger.error('Error deleting project:', error);
      }
    }
    setShowDeleteModal(false);
  };

  const cancelDelete = () => {
    setProjectToDelete(null);
    setShowDeleteModal(false);
  };

  // Logout function
  const handleLogout = async () => {
    try {
      const supabase = getSupabaseClient();
      await supabase.auth.signOut();

      // Clear local state
      setUser(null);
      setProjects([]);
      setTasks([]);

      // Redirect to login
      router.push('/login');
    } catch (error) {
      logger.error('Logout error:', error);
    }
  };

  const createProject = async () => {
    if (newProjectName.trim() && user) {
      try {
        const supabase = getSupabaseClient();
        const { data, error } = await supabase
          .from('projects')
          .insert([
            {
              name: newProjectName.trim(),
              user_id: user.id as string,
              is_open: false,
            },
          ])
          .select()
          .single();

        if (error) throw error;

        setProjects([...projects, data]);
        setNewProjectName('');
        setShowCreateModal(false);
        setIsProjectsOpen(true);
      } catch (error) {
        logger.error('Error creating project:', error);
      }
    }
  };

  const cancelCreate = () => {
    setNewProjectName('');
    setShowCreateModal(false);
  };

  const handleProjectClick = async (project: Project) => {
    // Set activeNavItem to project ID (like other nav buttons)
    setActiveNavItem(`project-${project.id}`);
    // Set selected project to show in main content
    setSelectedProject({ id: project.id, name: project.name });

    // Toggle the project open state in sidebar and update in database
    const updatedIsOpen = !project.is_open;

    try {
      const supabase = getSupabaseClient();
      const { error } = await supabase
        .from('projects')
        .update({ is_open: updatedIsOpen })
        .eq('id', project.id)
        .eq('user_id', user?.id);

      if (error) throw error;

      setProjects(
        projects.map((p) =>
          p.id === project.id ? { ...p, is_open: updatedIsOpen } : p
        )
      );
    } catch (error) {
      logger.error('Error updating project:', error);
    }
  };

  const handleAddTask = async (
    taskName: string,
    priority: 'high' | 'medium' | 'low',
    dueDate?: Date | null
  ) => {
    if (!user) return;

    try {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase
        .from('tasks')
        .insert([
          {
            name: taskName,
            priority: priority,
            completed: false,
            user_id: user.id,
            user_first_name: user.first_name,
            user_last_name: user.last_name,
            project_id: selectedProject?.id || null,
            due_date: dueDate ? dueDate.toISOString() : null,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      setTasks([data, ...tasks]);
    } catch (error) {
      logger.error('Error adding task:', error);
    }
  };

  const handleAddProjectTask = async (
    projectId: string,
    taskName: string,
    priority: 'high' | 'medium' | 'low',
    dueDate?: Date | null
  ) => {
    if (!user) return;

    try {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase
        .from('tasks')
        .insert([
          {
            name: taskName,
            priority: priority,
            completed: false,
            user_id: user.id,
            user_first_name: user.first_name,
            user_last_name: user.last_name,
            project_id: projectId,
            due_date: dueDate ? dueDate.toISOString() : null,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      setTasks([data, ...tasks]);
    } catch (error) {
      logger.error('Error adding project task:', error);
    }
  };

  // Task management functions
  const handleEditTask = async (
    taskId: string,
    newName: string,
    newPriority: 'high' | 'medium' | 'low'
  ) => {
    if (!user) return;

    try {
      const supabase = getSupabaseClient();
      const { error } = await supabase
        .from('tasks')
        .update({ name: newName, priority: newPriority })
        .eq('id', taskId)
        .eq('user_id', user.id);

      if (error) throw error;

      setTasks(
        tasks.map((task) =>
          task.id === taskId
            ? { ...task, name: newName, priority: newPriority }
            : task
        )
      );
    } catch (error) {
      logger.error('Error editing task:', error);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!user) return;

    try {
      const supabase = getSupabaseClient();
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId)
        .eq('user_id', user.id);

      if (error) throw error;

      setTasks(tasks.filter((task) => task.id !== taskId));
    } catch (error) {
      logger.error('Error deleting task:', error);
    }
  };

  const handleToggleTask = async (taskId: string, completed: boolean) => {
    if (!user) return;

    try {
      const supabase = getSupabaseClient();
      const { error } = await supabase
        .from('tasks')
        .update({ completed: !completed })
        .eq('id', taskId)
        .eq('user_id', user.id);

      if (error) throw error;

      setTasks(
        tasks.map((task) =>
          task.id === taskId ? { ...task, completed: !completed } : task
        )
      );
    } catch (error) {
      logger.error('Error toggling task:', error);
    }
  };

  // Only show loading if we have a user but data is still loading
  if (loading || !user) {
    return null; // Don't render anything while checking auth/redirecting
  }

  return (
    <>
      <Sidebar
        activeNavItem={activeNavItem}
        currentLanguage={currentLanguage}
        sidebarCollapsed={sidebarCollapsed}
        isProjectsOpen={isProjectsOpen}
        projects={projects}
        userEmail={user?.email}
        onNavClick={handleNavClick}
        onToggleLanguage={toggleLanguage}
        onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
        onToggleProjects={() => setIsProjectsOpen(!isProjectsOpen)}
        onProjectClick={handleProjectClick}
        onCreateProject={() => setShowCreateModal(true)}
        onDeleteProject={deleteProject}
        onLogout={handleLogout}
        t={t}
      />

      {/* Main Content */}
      <div
        className={`main-content ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}
      >
        <MainContent
          tasks={tasks.filter((task) =>
            selectedProject
              ? task.project_id === selectedProject.id
              : task.project_id === null
          )}
          currentLanguage={currentLanguage}
          activeNavItem={activeNavItem}
          selectedProject={selectedProject}
          onAddProjectTask={handleAddProjectTask}
          onEditTask={handleEditTask}
          onDeleteTask={handleDeleteTask}
          onToggleTask={handleToggleTask}
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
