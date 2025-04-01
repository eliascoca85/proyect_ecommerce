const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const authService = {
  async login(email, password) {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ correo: email, clave: password }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Error al iniciar sesión');
      }
      
      if (data.token) {
        // Guardar datos en localStorage
        localStorage.setItem('user', JSON.stringify(data));
      }
      
      return data;
    } catch (error) {
      throw error;
    }
  },
  
  logout() {
    localStorage.removeItem('user');
  },
  
  getCurrentUser() {
    if (typeof window !== 'undefined') {
      const userString = localStorage.getItem('user');
      if (userString) {
        try {
          return JSON.parse(userString);
        } catch (error) {
          return null;
        }
      }
    }
    return null;
  },
  
  isAuthenticated() {
    const user = this.getCurrentUser();
    return !!user && !!user.token;
  }
};