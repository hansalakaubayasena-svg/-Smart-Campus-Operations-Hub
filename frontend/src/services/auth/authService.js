import api from '../api';

export const login = (credentials) => api.post('/auth/login', credentials);
// Member 4 add security/notifications logic here
