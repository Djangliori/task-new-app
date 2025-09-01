'use client';

import { SimpleDropdown } from '../ui/SimpleDropdown';
import type { Project } from '../../lib/supabase';

interface SidebarProps {
  activeNavItem: string;
  currentLanguage: 'ka' | 'en';
  sidebarCollapsed: boolean;
  isProjectsOpen: boolean;
  projects: Project[];
  onNavClick: (navId: string) => void;
  onToggleLanguage: () => void;
  onToggleSidebar: () => void;
  onToggleProjects: () => void;
  onProjectClick: (project: Project) => void;
  onCreateProject: () => void;
  onDeleteProject: (projectId: string) => void;
  t: (key: string) => string;
}

export function Sidebar({
  activeNavItem,
  currentLanguage,
  sidebarCollapsed,
  isProjectsOpen,
  projects,
  onNavClick,
  onToggleLanguage,
  onToggleSidebar,
  onToggleProjects,
  onProjectClick,
  onCreateProject,
  onDeleteProject,
  t,
}: SidebarProps) {
  return (
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
          <div className="language-button" onClick={onToggleLanguage}>
            <span>{currentLanguage.toUpperCase()}</span>
          </div>
        </div>
        <button className="collapse-btn" onClick={onToggleSidebar}>
          {sidebarCollapsed ? '→' : '←'}
        </button>
      </div>

      <div className="sidebar-content">
        <nav className="sidebar-nav">
          <div
            className={`nav-item ${activeNavItem === 'homeNav' ? 'active' : ''}`}
            onClick={() => onNavClick('homeNav')}
          >
            <span className="nav-icon">⌂</span>
            <span>{t('home')}</span>
          </div>
          <div
            className={`nav-item ${activeNavItem === 'addTaskNav' ? 'active' : ''}`}
            onClick={() => onNavClick('addTaskNav')}
          >
            <span className="nav-icon">⊕</span>
            <span>{t('addTask')}</span>
          </div>
          <div
            className={`nav-item ${activeNavItem === 'searchNav' ? 'active' : ''}`}
            onClick={() => onNavClick('searchNav')}
          >
            <span className="nav-icon">⌕</span>
            <span>{t('search')}</span>
          </div>
          <div
            className={`nav-item ${activeNavItem === 'todayNav' ? 'active' : ''}`}
            onClick={() => onNavClick('todayNav')}
          >
            <span className="nav-icon">☰</span>
            <span>{t('today')}</span>
          </div>
          <div
            className={`nav-item ${activeNavItem === 'upcomingNav' ? 'active' : ''}`}
            onClick={() => onNavClick('upcomingNav')}
          >
            <span className="nav-icon">⧗</span>
            <span>{t('upcoming')}</span>
          </div>
          <div
            className={`nav-item ${activeNavItem === 'completedNav' ? 'active' : ''}`}
            onClick={() => onNavClick('completedNav')}
          >
            <span className="nav-icon">☑</span>
            <span>{t('completed')}</span>
          </div>
        </nav>

        {/* Projects Section */}
        <div className="action-buttons">
          <button className="create-project-btn" onClick={onCreateProject}>
            <span className="btn-icon">+</span>
            <span>{t('createProject')}</span>
          </button>
        </div>

        <div className="projects-section" id="projectsSection">
          <div className="section-header" onClick={onToggleProjects}>
            <h3>{t('myProjects')}</h3>
            <span className={`dropdown-arrow ${isProjectsOpen ? 'open' : ''}`}>
              ▼
            </span>
          </div>
          {isProjectsOpen && (
            <ul className="projects-list" id="projectsList">
              {projects.map((project) => (
                <li
                  key={project.id}
                  className={`project-item ${
                    activeNavItem === `project-${project.id}` ? 'active' : ''
                  }`}
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
                      onClick={() => onProjectClick(project)}
                    >
                      <span style={{ marginRight: '8px', fontSize: '12px' }}>
                        {project.is_open ? '📁' : '📁'}
                      </span>
                      <span className="project-name">{project.name}</span>
                    </div>
                    <SimpleDropdown
                      projectId={project.id}
                      projectName={project.name}
                      onDelete={onDeleteProject}
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
  );
}
