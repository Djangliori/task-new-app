'use client';

const translations = {
  ka: {
    // Sidebar and Navigation
    home: 'მთავარი',
    addTask: 'დავალების დამატება',
    search: 'ძებნა',
    today: 'დღევანდელი დავალება',
    upcoming: 'მომავალი დავალება',
    completed: 'დასრულებული დავალება',
    createProject: 'პროექტის შექმნა',
    myProjects: 'ჩემი პროექტები',
    welcomeMessage: 'კეთილი იყოს თქვენი მობრძანება Task Manager-ში',
    appTitle: 'Task Manager',
    edit: 'რედაქტირება',
    delete: 'წაშლა',
    logout: 'გასვლა',

    // Login Page
    login: 'შესვლა',
    taskManagerLogin: 'Task Manager-ში შესასვლელად',
    email: 'ელ-ფოსტა:',
    emailPlaceholder: 'შეიყვანეთ ელ-ფოსტა',
    password: 'პაროლი:',
    passwordPlaceholder: 'შეიყვანეთ პაროლი',
    loginButton: 'შესვლა',
    checking: 'შემოწმება...',
    createAccount: 'Create New Account',
    errorWrongCredentials: 'შეცდომა: არასწორი ელ-ფოსტა ან პაროლი',
    showPassword: 'პაროლის ჩვენება',

    // Register Page
    register: 'რეგისტრაცია',
    createNewAccount: 'ახალი ანგარიშის შექმნა',
    firstName: 'სახელი:',
    firstNamePlaceholder: 'სახელი',
    lastName: 'გვარი:',
    lastNamePlaceholder: 'გვარი',
    confirmPassword: 'პაროლის გამეორება:',
    confirmPasswordPlaceholder: 'გაიმეორეთ პაროლი',
    createButton: 'ანგარიშის შექმნა',
    registering: 'რეგისტრაცია...',
    alreadyHaveAccount: 'უკვე გაქვს ანგარიში?',
    signIn: 'შესვლა',
    errorAllFieldsRequired: 'ყველა ველის შევსება სავალდებულოა',
    errorPasswordsDontMatch: 'პაროლები არ ემთხვევა',
    errorPasswordTooShort: 'პაროლი უნდა იყოს მინიმუმ 6 სიმბოლო',
    errorEmailExists: 'ეს ელ-ფოსტა უკვე რეგისტრირებულია',

    // Task Modal
    addNewTask: 'დავალების დამატება',
    taskName: 'დავალების სახელი',
    taskNamePlaceholder: 'შეიყვანეთ დავალების სახელი',
    priority: 'პრიორიტეტი:',
    dueDate: 'ვადა:',
    selectDate: 'აირჩიეთ თარიღი',
    cancel: 'გაუქმება',
    add: 'დამატება',
    high: 'მაღალი',
    medium: 'საშუალო',
    low: 'დაბალი',
    
    // Email Confirmation
    emailConfirmation: 'ელ-ფოსტის დადასტურება',
    confirming: 'მიმდინარეობს დადასტურება...',
    emailConfirmed: '✅ ელ-ფოსტა წარმატებით დადასტურდა! ახლა შეგიძლიათ შემოხვიდეთ.',
    confirmationError: 'დადასტურების შეცდომა. გთხოვთ ისევ სცადოთ.',
    invalidLink: '❌ არასწორი დადასტურების ბმული.',
    redirectingToLogin: '3 წამში გადამისამართება შესვლის გვერდზე...',
    goToLogin: 'შესვლის გვერდზე გადასვლა',
  },
  en: {
    // Sidebar and Navigation
    home: 'Home',
    addTask: 'Add Task',
    search: 'Search',
    today: 'Today',
    upcoming: 'Upcoming',
    completed: 'Completed',
    createProject: 'Create Project',
    myProjects: 'My Projects',
    welcomeMessage: 'Welcome to Task Manager',
    appTitle: 'Task Manager',
    edit: 'Edit',
    delete: 'Delete',
    logout: 'Logout',

    // Login Page
    login: 'Login',
    taskManagerLogin: 'Sign in to Task Manager',
    email: 'Email:',
    emailPlaceholder: 'Enter your email',
    password: 'Password:',
    passwordPlaceholder: 'Enter your password',
    loginButton: 'Sign In',
    checking: 'Checking...',
    createAccount: 'Create New Account',
    errorWrongCredentials: 'Error: Invalid email or password',
    showPassword: 'Show Password',

    // Register Page
    register: 'Register',
    createNewAccount: 'Create New Account',
    firstName: 'First Name:',
    firstNamePlaceholder: 'First Name',
    lastName: 'Last Name:',
    lastNamePlaceholder: 'Last Name',
    confirmPassword: 'Confirm Password:',
    confirmPasswordPlaceholder: 'Confirm your password',
    createButton: 'Create Account',
    registering: 'Creating...',
    alreadyHaveAccount: 'Already have an account?',
    signIn: 'Sign In',
    errorAllFieldsRequired: 'All fields are required',
    errorPasswordsDontMatch: 'Passwords do not match',
    errorPasswordTooShort: 'Password must be at least 6 characters',
    errorEmailExists: 'This email is already registered',

    // Task Modal
    addNewTask: 'Add New Task',
    taskName: 'Task Name',
    taskNamePlaceholder: 'Enter task name',
    priority: 'Priority:',
    dueDate: 'Due Date:',
    selectDate: 'Select date',
    cancel: 'Cancel',
    add: 'Add',
    high: 'High',
    medium: 'Medium',
    low: 'Low',
    
    // Email Confirmation
    emailConfirmation: 'Email Confirmation',
    confirming: 'Confirming...',
    emailConfirmed: '✅ Email confirmed successfully! You can now sign in.',
    confirmationError: 'Confirmation error. Please try again.',
    invalidLink: '❌ Invalid confirmation link.',
    redirectingToLogin: 'Redirecting to login page in 3 seconds...',
    goToLogin: 'Go to Login',
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
