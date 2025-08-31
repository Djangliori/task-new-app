export const PRIORITY_COLORS = {
  high: '#e74c3c',    // წითელი
  medium: '#f1c40f',  // ყვითელი  
  low: '#ffffff',     // თეთრი
} as const;

export const PRIORITY_ICONS = {
  high: '●',    // წითელი წრე
  medium: '●',  // ყვითელი წრე
  low: '●',     // თეთრი წრე
} as const;

export type Priority = keyof typeof PRIORITY_COLORS;

export const getPriorityColor = (priority: Priority) => {
  return PRIORITY_COLORS[priority] || '#95a5a6';
};

export const getPriorityIcon = (priority: Priority) => {
  return PRIORITY_ICONS[priority] || '';
};
