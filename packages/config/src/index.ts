// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: '/api/auth/register',
    LOGIN: '/api/auth/login',
    ME: '/api/auth/me',
  },
  CATEGORIES: {
    LIST: '/api/categories',
    CREATE: '/api/categories',
    UPDATE: (id: string) => `/api/categories/${id}`,
    DELETE: (id: string) => `/api/categories/${id}`,
  },
  PRODUCTS: {
    LIST: '/api/products',
    CREATE: '/api/products',
    UPDATE: (id: string) => `/api/products/${id}`,
    DELETE: (id: string) => `/api/products/${id}`,
  },
  BRANCHES: {
    LIST: '/api/branches',
    CREATE: '/api/branches',
    UPDATE: (id: string) => `/api/branches/${id}`,
    DELETE: (id: string) => `/api/branches/${id}`,
  },
  ORDERS: {
    LIST: '/api/orders',
    CREATE: '/api/orders',
    UPDATE: (id: string) => `/api/orders/${id}`,
    GET: (id: string) => `/api/orders/${id}`,
  },
};

// Constants
export const CONSTANTS = {
  JWT_EXPIRES_IN: '7d',
  BCRYPT_ROUNDS: 10,
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
};

// Validation Rules
export const VALIDATION = {
  PASSWORD_MIN_LENGTH: 6,
  PHONE_REGEX: /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
};
