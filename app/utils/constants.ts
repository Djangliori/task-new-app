export const PRIORITY_COLORS = {
  high: '#e74c3c',
  medium: '#f1c40f',
  low: '#ffffff',
} as const;

export const PRIORITY_ICONS = {
  high: '●',
  medium: '●',
  low: '●',
} as const;

export type Priority = keyof typeof PRIORITY_COLORS;

export const getPriorityColor = (priority: Priority) => {
  return PRIORITY_COLORS[priority] || '#95a5a6';
};

export const getPriorityIcon = (priority: Priority) => {
  return PRIORITY_ICONS[priority] || '';
};
