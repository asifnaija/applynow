import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { CheckCircle, ArrowRight, Copy, Edit } from 'lucide-react';

export const ApplicationSuccess: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { applications } = useApp();
  
  const state = location.state as { referenceId?: string };
  const referenceId = state?.referenceId || 'APP-ERROR';
  
  // Find the application details to potentially edit/pre-fill
  const appData = applications.find(app => app.id === referenceId);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referenceId);
    alert('Reference ID copied to clipboard!');
  };

  const handleEdit = () => {
    if (appData) {
        // Navigate back to apply with the data. 
        // Note: Submitting again will generate a NEW reference ID in the current implementation (creates a new entry)
        navigate('/apply', { state: { initialData: appData } });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 animate-slideUp">
      <div className="bg-green-50 p-6 rounded-full mb-6 ring-8 ring-green-50/50">
        <CheckCircle className="h-16 w-16 text-green-600" />
      </div>
      
      <h1 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">Application Submitted!</h1>
      <p className="text-lg text-slate-600 max-w-lg text-center mb-10 leading-relaxed">
        Thank you for choosing ApplyNow. Your application has been successfully queued for review by our admissions committee.
      </p>

      {/* Ticket Style Reference Card */}
      <div className="relative w-full max-w-md bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden mb-10 group hover:-translate-y-1 transition-transform duration-300">
        <div className="bg-slate-900 p-4 flex justify-between items-center text-white">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Official Receipt</span>
            <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
        </div>
        
        <div className="p-8 text-center border-b border-dashed border-slate-300 relative">
             {/* Ticket Cutouts */}
             <div className="absolute -left-3 bottom-[-12px] h-6 w-6 rounded-full bg-slate-50 border border-slate-200"></div>
             <div className="absolute -right-3 bottom-[-12px] h-6 w-6 rounded-full bg-slate-50 border border-slate-200"></div>

            <p className="text-xs text-slate-500 uppercase tracking-wide font-bold mb-2">Application Reference Number</p>
            <div className="flex items-center justify-center gap-3">
                <p className="text-4xl font-mono font-bold text-brand-600 tracking-wider">{referenceId}</p>
                <button onClick={copyToClipboard} className="text-slate-400 hover:text-brand-600 transition-colors" title="Copy ID">
                    <Copy size={20} />
                </button>
            </div>
            <p className="text-xs text-slate-400 mt-4 italic">Please save this ID for future tracking.</p>
        </div>
        
        <div className="p-4 bg-slate-50 text-center">
             <p className="text-sm font-medium text-slate-600">Status: <span className="text-yellow-600">Pending Review</span></p>
        </div>
      </div>

      <div className="flex gap-4">
        {appData && (
            <button 
              onClick={handleEdit}
              className="btn-secondary px-6 py-3 text-lg"
            >
              <Edit size={20} /> Edit Application
            </button>
        )}
        <button 
          onClick={() => navigate('/dashboard')}
          className="btn-primary px-8 py-3 text-lg shadow-glow"
        >
          Go to Dashboard <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
};