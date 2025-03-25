import api from '../config/api';
import { jwtDecode } from 'jwt-decode';

interface LoginCredentials {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    studentName: string;
    role: string;
    course: string;
    semester: number;
    registration: string;
  };
}
interface DecodedToken {
  id: string;
  name: string;
  studentName: string;
  course: string;
  semester: number;
  email: string;
  role: string;
  registration: string;
  exp: number;
}

class AuthService {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>('/auth/login', credentials);
    const { token } = response.data;
    
    if (token) {
      localStorage.setItem('token', token);
      const decoded = this.decodeToken(token);
      return {
        token,
        user: {
          id: decoded.id,
          name: decoded.name,
          studentName: decoded.studentName,
          email: decoded.email,
          role: decoded.role,
          course: decoded.course,
          semester: decoded.semester,
          registration: decoded.registration,
        },
      };
    }
    
    throw new Error('Token não encontrado na resposta');
  }

  logout(): void {
    localStorage.removeItem('token');
  }

  decodeToken(token: string): DecodedToken {
    return jwtDecode<DecodedToken>(token);
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    if (!token) return false;

    try {
      const decoded = this.decodeToken(token);
      const currentTime = Date.now() / 1000;
      return decoded.exp > currentTime;
    } catch {
      return false;
    }
  }

  getCurrentUser() {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
      const decoded = this.decodeToken(token);
      const currentTime = Date.now() / 1000;


      if (decoded.exp <= currentTime) {
        this.logout();
        return null;
      }
      return {
        id: decoded.id,
        name: decoded.name,
        email: decoded.email,
        role: decoded.role,
        studentName: decoded.studentName,
        semester: decoded.semester,
        course: decoded.course,
        registration: decoded.registration,
      };
    } catch {
      this.logout();
      return null;
    }
  }
}

export default new AuthService();