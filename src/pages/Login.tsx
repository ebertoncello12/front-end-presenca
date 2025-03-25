import React, { useState } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { GraduationCap, Mail, Lock, Info } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLoading } from '../contexts/LoadingContext';
import toast from 'react-hot-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated, user } = useAuth();
  const { setIsLoading } = useLoading();

  const from = location.state?.from?.pathname || 
    (user?.role === 'professor' ? '/professor/dashboard' : '/dashboard');

  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await login(email, password);
      const redirectPath = email === 'professor@escola.com' ? '/professor/dashboard' : '/dashboard';
      navigate(redirectPath, { replace: true });
      toast.success('Login realizado com sucesso!');
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Credenciais inválidas');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="flex-1 flex items-center justify-center p-8 bg-white dark:bg-gray-800">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <div className="flex justify-center items-center space-x-2">
              <GraduationCap className="h-12 w-12 text-primary-600 dark:text-primary-400" />
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                UniPresença
              </h1>
            </div>
            <p className="mt-3 text-gray-600 dark:text-gray-400">
              Sistema de Gerenciamento Acadêmico
            </p>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg">
            <div className="flex items-start space-x-3">
              <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
              <div className="text-sm text-blue-700 dark:text-blue-300">
                <p className="font-medium mb-1">Credenciais de Acesso:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Professor: professor@escola.com / prof123</li>
                  <li>Aluno: aluno@escola.com / aluno123</li>
                </ul>
              </div>
            </div>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                             bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 
                             focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 
                             transition-colors duration-200"
                    placeholder="seu.email@escola.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Senha
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                             bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 
                             focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 
                             transition-colors duration-200"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent 
                         text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 
                         focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500
                         transition-colors duration-200 dark:bg-primary-500 dark:hover:bg-primary-600"
              >
                Entrar
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="hidden lg:block lg:w-1/2 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600/90 to-primary-800/90"></div>
        <img
          className="absolute inset-0 h-full w-full object-cover"
          src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-1.2.1&auto=format&fit=crop&q=80"
          alt="University Campus"
        />
        <div className="absolute inset-0 flex items-center justify-center p-12">
          <div className="max-w-xl text-center text-white space-y-8">
            <h2 className="text-4xl font-bold">Plataforma Educacional Integrada</h2>
            <p className="text-lg">
              Gerencie turmas, notas e frequência de forma eficiente com nossa plataforma completa.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;