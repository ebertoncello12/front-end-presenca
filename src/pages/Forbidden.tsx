import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

const Forbidden = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="text-center">
        <div className="flex justify-center">
          <ShieldAlert className="h-24 w-24 text-red-500 dark:text-red-400" />
        </div>
        <h1 className="mt-6 text-3xl font-bold text-gray-900 dark:text-white">
          Acesso Negado
        </h1>
        <p className="mt-3 text-gray-600 dark:text-gray-400 max-w-md">
          Você não tem permissão para acessar esta página. Por favor, verifique suas credenciais ou entre em contato com o suporte.
        </p>
        <div className="mt-6">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Voltar
          </button>
        </div>
      </div>
    </div>
  );
};

export default Forbidden;