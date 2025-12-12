import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ApplicationStatus } from '../types';
import { Check, X, Search, Filter, AlertTriangle, User, Calendar, Clock } from 'lucide-react';

export const Admin: React.FC = () => {
  const { applications, updateStatus } = useApp();
  const [confirmAction, setConfirmAction] = useState<{ id: string; status: ApplicationStatus } | null>(null);

  const handleActionClick = (id: string, status: ApplicationStatus) => {
    setConfirmAction({ id, status });
  };

  const executeAction = () => {
    if (confirmAction) {
      updateStatus(confirmAction.id, confirmAction.status);
      setConfirmAction(null);
    }
  };

  return (
    <div className="space-y-8 relative">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <div>
            <h1 className="text-2xl font-bold text-slate-900">Admissions Overview</h1>
            <p className="text-slate-500">Manage, review, and adjudicate student applications.</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
            <div className="relative flex-grow sm:flex-grow-0">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input type="text" placeholder="Search applicant..." className="w-full pl-9 pr-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all" />
            </div>
            <button className="p-2.5 border border-slate-300 rounded-lg hover:bg-slate-50 text-slate-600">
                <Filter size={18} />
            </button>
        </div>
      </div>

      <div className="bg-white shadow-soft border border-slate-200 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Applicant Details</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Academic Profile</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Submitted</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Last Updated</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Decision</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-100">
              {applications.map((app) => (
                <tr key={app.id} className="even:bg-slate-50/50 hover:bg-slate-100 transition-colors group">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 font-bold shrink-0">
                            {app.personal.firstName[0]}{app.personal.lastName[0]}
                        </div>
                        <div className="ml-4">
                            <div className="text-sm font-bold text-slate-900">{app.personal.firstName} {app.personal.lastName}</div>
                            <div className="text-xs text-slate-500 flex items-center gap-1">
                                {app.personal.email}
                            </div>
                        </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col text-sm">
                        <span className="font-medium text-slate-700">GPA: <span className="font-bold">{app.academic.gpa}</span></span>
                        <span className="text-slate-500 text-xs">{app.academic.testType}: {app.academic.testScore || 'N/A'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                     <div className="flex items-center text-xs text-slate-500 gap-1.5">
                        <Calendar size={14} />
                        {app.submittedAt ? new Date(app.submittedAt).toLocaleDateString() : 'Draft'}
                     </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-bold rounded-full border 
                      ${app.status === ApplicationStatus.Approved ? 'bg-green-50 text-green-700 border-green-200' : 
                        app.status === ApplicationStatus.Rejected ? 'bg-red-50 text-red-700 border-red-200' : 
                        'bg-yellow-50 text-yellow-700 border-yellow-200'}`}>
                      {app.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col text-xs text-slate-500">
                        {app.statusUpdatedAt ? (
                            <>
                                <span className="font-medium text-slate-700">{new Date(app.statusUpdatedAt).toLocaleDateString()}</span>
                                <span className="flex items-center gap-1"><Clock size={10} />{new Date(app.statusUpdatedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                            </>
                        ) : (
                            <span className="text-slate-400 italic">No updates</span>
                        )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {app.status === ApplicationStatus.Pending || app.status === ApplicationStatus.UnderReview ? (
                        <div className="flex justify-end gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                                onClick={() => handleActionClick(app.id, ApplicationStatus.Approved)}
                                className="flex items-center gap-1 px-3 py-1.5 bg-green-50 text-green-700 hover:bg-green-100 rounded-md border border-green-200 transition-colors text-xs font-bold uppercase tracking-wide"
                            >
                                <Check size={14} /> Approve
                            </button>
                            <button 
                                onClick={() => handleActionClick(app.id, ApplicationStatus.Rejected)}
                                className="flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-700 hover:bg-red-100 rounded-md border border-red-200 transition-colors text-xs font-bold uppercase tracking-wide"
                            >
                                <X size={14} /> Reject
                            </button>
                        </div>
                    ) : (
                        <span className="text-xs font-medium text-slate-400 italic">Decision Finalized</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirmation Modal */}
      {confirmAction && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-fadeIn">
            <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 transform transition-all scale-100 border border-white/20">
                <div className="flex flex-col items-center text-center">
                    <div className={`p-4 rounded-full mb-5 ${confirmAction.status === ApplicationStatus.Approved ? 'bg-green-100' : 'bg-red-100'}`}>
                        <AlertTriangle className={`h-8 w-8 ${confirmAction.status === ApplicationStatus.Approved ? 'text-green-600' : 'text-red-600'}`} />
                    </div>
                    
                    <h3 className="text-xl font-bold text-slate-900 mb-2">
                        {confirmAction.status === ApplicationStatus.Approved ? 'Confirm Approval' : 'Confirm Rejection'}
                    </h3>
                    
                    <p className="text-slate-600 mb-8 leading-relaxed text-sm">
                        {confirmAction.status === ApplicationStatus.Approved 
                            ? "Are you sure you want to approve this application? This action will notify the applicant immediately."
                            : "Are you sure you want to reject this application? This action cannot be undone efficiently."}
                    </p>
                    
                    <div className="grid grid-cols-2 gap-3 w-full">
                        <button 
                            onClick={() => setConfirmAction(null)}
                            className="w-full px-4 py-3 border border-slate-300 rounded-xl text-slate-700 font-bold hover:bg-slate-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={executeAction}
                            className={`w-full px-4 py-3 rounded-xl text-white font-bold shadow-lg transition-all transform hover:-translate-y-0.5
                                ${confirmAction.status === ApplicationStatus.Approved 
                                    ? 'bg-green-600 hover:bg-green-700 shadow-green-200' 
                                    : 'bg-red-600 hover:bg-red-700 shadow-red-200'
                                }`}
                        >
                            {confirmAction.status === ApplicationStatus.Approved ? 'Approve' : 'Reject'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};