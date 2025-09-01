// Development logger utility
export const logger = {
  log: (message: string, ...args: unknown[]) => {
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.log(message, ...args);
    }
  },
  error: (message: string, ...args: unknown[]) => {
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.error(message, ...args);
    }
  },
  warn: (message: string, ...args: unknown[]) => {
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.warn(message, ...args);
    }
  },
};
