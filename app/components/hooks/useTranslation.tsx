'use client';

const translations = {
  ka: {
    home: 'მთავარი',
    addTask: 'დავალების დამატება',
    search: 'ძებნა',
    today: 'დღევანდელი დავალება',
    upcoming: 'მომავალი დავალება',
    completed: 'დასრულებული დავალება',
    createProject: 'პროექტის შექმნა',
    myProjects: 'ჩემი პროექტები',
    welcomeMessage: 'კეთილი იყოს თქვენი მობრძანება Task Manager-ში',
    selectProjectMessage: 'დასაწყებად აირჩიეთ პროექტი sidebar-იდან',
    appTitle: 'Task Manager',
    edit: 'რედაქტირება',
    delete: 'წაშლა',
    addToFavorites: 'რჩეულებში დამატება',
    removeFromFavorites: 'რჩეულებიდან ამოღება',
  },
  en: {
    home: 'Home',
    addTask: 'Add Task',
    search: 'Search',
    today: 'Today',
    upcoming: 'Upcoming',
    completed: 'Completed',
    createProject: 'Create Project',
    myProjects: 'My Projects',
    welcomeMessage: 'Welcome to Task Manager',
    selectProjectMessage: 'Select a project from the sidebar to get started',
    appTitle: 'Task Manager',
    edit: 'Edit',
    delete: 'Delete',
    addToFavorites: 'Add to Favorites',
    removeFromFavorites: 'Remove from Favorites',
  },
};

export function useTranslation(currentLanguage: 'ka' | 'en') {
  const t = (key: string) => {
    return (
      translations[currentLanguage][key as keyof typeof translations.ka] || key
    );
  };

  return { t };
}
