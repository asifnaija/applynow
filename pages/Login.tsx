import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { GraduationCap, ShieldCheck } from 'lucide-react';

export const Login: React.FC = () => {
  const { login } = useApp();
  const navigate = useNavigate();

  const handleLogin = (role: 'applicant' | 'admin') => {
    login(role);
    navigate(role === 'admin' ? '/admin' : '/dashboard');
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
            <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-brand-100 mb-4">
                <GraduationCap className="h-6 w-6 text-brand-600" />
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900">Welcome Back</h2>
            <p className="mt-2 text-sm text-slate-600">Select a role to continue the demo</p>
        </div>

        <div className="bg-white py-8 px-4 shadow-xl rounded-lg sm:px-10 border border-slate-100">
            <div className="space-y-4">
                <button 
                    onClick={() => handleLogin('applicant')}
                    className="w-full flex justify-center items-center py-4 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 transition-colors"
                >
                    Login as Applicant
                </button>
                
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-slate-300" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-slate-500">Or</span>
                    </div>
                </div>

                <button 
                    onClick={() => handleLogin('admin')}
                    className="w-full flex justify-center items-center gap-2 py-4 px-4 border border-slate-300 rounded-md shadow-sm text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 transition-colors"
                >
                    <ShieldCheck size={16} /> Login as Administrator
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};