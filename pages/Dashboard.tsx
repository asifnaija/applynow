import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ApplicationStatus, AdmissionChance } from '../types';
import { predictAdmissionChance } from '../services/geminiService';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { BrainCircuit, Loader2, FileText, Calendar, CheckCircle, XCircle, Clock, GraduationCap, Trophy, FileBarChart, AlertTriangle, RotateCw } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { currentUser, applications, updatePrediction } = useApp();
  const [loadingAi, setLoadingAi] = useState<string | null>(null);
  const [predictionError, setPredictionError] = useState<Record<string, string>>({});

  const myApps = applications.filter(app => app.userId === currentUser?.id);

  const handlePredict = async (appId: string, academicData: any) => {
    setLoadingAi(appId);
    setPredictionError(prev => ({...prev, [appId]: ''})); // Clear previous errors
    
    try {
      const result = await predictAdmissionChance(academicData);
      updatePrediction(appId, result);
    } catch (e) {
      console.error("AI Error", e);
      setPredictionError(prev => ({
        ...prev, 
        [appId]: "Unable to complete analysis. Please check your connection and try again."
      }));
    } finally {
      setLoadingAi(null);
    }
  };

  if (myApps.length === 0) {
    return (
        <div className="text-center py-20 bg-white rounded-2xl shadow-soft border border-slate-100">
            <h2 className="text-2xl font-bold text-slate-800 mb-2">No active applications</h2>
            <p className="text-slate-500 mb-8 max-w-sm mx-auto">Start your journey today by submitting a new application to our programs.</p>
            <a href="#/apply" className="btn-primary inline-flex px-8 py-3" style={{ borderRadius: '12px' }}>Start New Application</a>
        </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Application Dashboard</h1>
      
      <div className="grid gap-8">
        {myApps.map(app => {
            // Determine if we should show the "Active" AI view (Context + Loading/Result/Error) 
            // vs the "Start" view (Button only)
            const showAiView = app.aiPrediction || loadingAi === app.id || predictionError[app.id];

            return (
              <div key={app.id} className="bg-white rounded-2xl shadow-soft border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow duration-300">
                {/* Header */}
                <div className="bg-white px-6 py-5 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="font-mono text-xs font-bold text-slate-400 uppercase tracking-widest">Ref: {app.id}</span>
                            <span className="h-1.5 w-1.5 rounded-full bg-slate-300"></span>
                            <span className="text-xs text-brand-600 font-bold uppercase tracking-wider">Undergraduate</span>
                        </div>
                        <h3 className="text-xl font-bold text-slate-900">Computer Science B.S. Fall 2025</h3>
                    </div>
                    <StatusBadge status={app.status} />
                </div>

                <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
                    {/* Details Column */}
                    <div className="col-span-2 space-y-8">
                        <div className="grid grid-cols-2 gap-6">
                            <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
                                <div className="p-2 bg-white rounded-lg shadow-sm text-slate-500">
                                    <Calendar size={20} />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-400 uppercase font-bold tracking-wide mb-1">Submitted On</p>
                                    <p className="text-sm font-semibold text-slate-800">{app.submittedAt ? new Date(app.submittedAt).toLocaleDateString() : 'Draft'}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
                                <div className="p-2 bg-white rounded-lg shadow-sm text-slate-500">
                                    <FileText size={20} />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-400 uppercase font-bold tracking-wide mb-1">Documentation</p>
                                    <p className="text-sm font-semibold text-slate-800">Complete</p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                                Academic Profile <span className="h-px flex-grow bg-slate-100"></span>
                            </h4>
                            <div className="bg-slate-50 rounded-xl p-5 border border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-6">
                                 <div className="text-center sm:text-left">
                                    <span className="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">GPA</span>
                                    <span className="font-bold text-lg text-slate-900">{app.academic.gpa}</span>
                                 </div>
                                 <div className="text-center sm:text-left">
                                    <span className="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">{app.academic.testType}</span>
                                    <span className="font-bold text-lg text-slate-900">{app.academic.testScore || 'N/A'}</span>
                                 </div>
                                 <div className="col-span-2 text-center sm:text-left">
                                    <span className="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">High School</span>
                                    <span className="font-bold text-lg text-slate-900 truncate block">{app.academic.highSchool}</span>
                                 </div>
                            </div>
                        </div>
                    </div>

                    {/* AI Predictor Column */}
                    <div className="lg:border-l lg:border-slate-100 lg:pl-8 flex flex-col">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="p-1.5 bg-brand-100 rounded-lg text-brand-600">
                                <BrainCircuit size={20} />
                            </div>
                            <h4 className="font-bold text-slate-900">AI Chance Predictor</h4>
                        </div>

                        {!showAiView ? (
                             <div className="flex flex-col flex-grow justify-center text-center py-6 bg-slate-50/50 rounded-xl border border-dashed border-slate-200 px-4">
                                <p className="text-sm text-slate-500 mb-6 leading-relaxed">
                                    Get an instant admission probability estimate based on your profile data.
                                </p>
                                <button 
                                    onClick={() => handlePredict(app.id, app.academic)}
                                    className="w-full btn-secondary py-3 justify-center text-brand-600 hover:text-brand-700 hover:border-brand-300 shadow-sm"
                                    style={{ borderRadius: '12px' }}
                                >
                                    <BrainCircuit size={18} /> Run Analysis
                                </button>
                             </div>
                        ) : (
                            <div className="flex flex-col h-full animate-fadeIn">
                                {/* Context Section - Always visible in AI View */}
                                <div className="mb-6 bg-white rounded-xl p-4 border border-slate-200 shadow-sm relative overflow-hidden group">
                                    <div className="absolute top-0 left-0 w-1 h-full bg-brand-500"></div>
                                    <div className="flex items-center gap-2 mb-3 border-b border-slate-100 pb-2">
                                         <FileBarChart size={14} className="text-brand-500" />
                                         <span className="font-bold text-xs text-slate-400 uppercase tracking-widest">Analysis Inputs</span>
                                    </div>
                                    
                                    <div className="grid grid-cols-2 gap-3 mb-3">
                                        <div className="bg-slate-50 p-2.5 rounded-lg">
                                            <span className="text-[10px] text-slate-400 font-bold uppercase block mb-0.5">GPA</span>
                                            <span className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                                                {app.academic.gpa}
                                            </span>
                                        </div>
                                        <div className="bg-slate-50 p-2.5 rounded-lg">
                                            <span className="text-[10px] text-slate-400 font-bold uppercase block mb-0.5">{app.academic.testType}</span>
                                            <span className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                                                 {app.academic.testScore || 'N/A'}
                                            </span>
                                        </div>
                                    </div>
                                    
                                    <div className="bg-slate-50 p-2.5 rounded-lg">
                                        <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Key Profile Highlights</span>
                                        <div className="flex items-start gap-2">
                                            <Trophy size={14} className="text-yellow-500 mt-0.5 flex-shrink-0" />
                                            <span className="text-xs font-medium text-slate-700 line-clamp-2 leading-relaxed" title={app.academic.activities}>
                                                {app.academic.activities}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* States: Loading vs Error vs Result */}
                                {loadingAi === app.id ? (
                                    <div className="flex flex-col items-center justify-center py-6 flex-grow bg-slate-50/30 rounded-xl">
                                        <div className="relative mb-4">
                                            <div className="w-14 h-14 rounded-full border-4 border-slate-200 border-t-brand-600 animate-spin"></div>
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <BrainCircuit size={22} className="text-brand-600 animate-pulse" />
                                            </div>
                                        </div>
                                        <p className="text-sm font-bold text-slate-700 animate-pulse">Analyzing academic profile...</p>
                                        <p className="text-xs text-slate-400 mt-1">Comparing with admissions data</p>
                                    </div>
                                ) : predictionError[app.id] ? (
                                    <div className="flex flex-col items-center justify-center py-6 flex-grow bg-red-50/50 rounded-xl px-4 text-center border border-red-100">
                                        <div className="p-3 bg-red-100 rounded-full text-red-600 mb-3">
                                            <AlertTriangle size={24} />
                                        </div>
                                        <p className="text-sm font-bold text-slate-800 mb-1">Analysis Failed</p>
                                        <p className="text-xs text-slate-600 mb-4">{predictionError[app.id]}</p>
                                        <button 
                                            onClick={() => handlePredict(app.id, app.academic)}
                                            className="px-4 py-2 bg-white border border-red-200 text-red-700 text-xs font-bold hover:bg-red-50 transition-colors flex items-center gap-2 shadow-sm"
                                            style={{ borderRadius: '12px' }}
                                        >
                                            <RotateCw size={14} /> Try Again
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center animate-fadeIn">
                                        <div className="h-44 w-full relative">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <PieChart>
                                                    <Pie
                                                        data={[
                                                            { name: 'Chance', value: app.aiPrediction?.probability },
                                                            { name: 'Risk', value: 100 - (app.aiPrediction?.probability || 0) }
                                                        ]}
                                                        innerRadius={45}
                                                        outerRadius={65}
                                                        paddingAngle={4}
                                                        dataKey="value"
                                                        startAngle={90}
                                                        endAngle={-270}
                                                        stroke="none"
                                                    >
                                                        <Cell fill={getChanceColor(app.aiPrediction!.category)} />
                                                        <Cell fill="#f1f5f9" />
                                                    </Pie>
                                                </PieChart>
                                            </ResponsiveContainer>
                                            <div className="absolute left-0 right-0 top-[70px] text-center pointer-events-none flex flex-col items-center">
                                                <span className={`text-3xl font-extrabold ${getTextColor(app.aiPrediction!.category)}`}>
                                                    {app.aiPrediction!.probability}%
                                                </span>
                                            </div>
                                        </div>
                                        
                                        <div className="mt-[-10px] w-full relative z-10">
                                            <div className={`text-center mb-3 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide inline-block w-full shadow-sm ${getBgColor(app.aiPrediction!.category)} ${getTextColor(app.aiPrediction!.category)} border border-current/10`}>
                                                {app.aiPrediction!.category} Probability
                                            </div>
                                            <div className="bg-slate-50 p-3 rounded-lg border-l-4 border-slate-300">
                                                <p className="text-xs text-slate-600 italic leading-relaxed">
                                                    "{app.aiPrediction!.reasoning}"
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
              </div>
            );
        })}
      </div>
    </div>
  );
};

const StatusBadge = ({ status }: { status: ApplicationStatus }) => {
    const config = {
        [ApplicationStatus.Draft]: "bg-slate-100 text-slate-600 border-slate-200",
        [ApplicationStatus.Pending]: "bg-yellow-50 text-yellow-700 border-yellow-200",
        [ApplicationStatus.UnderReview]: "bg-blue-50 text-blue-700 border-blue-200",
        [ApplicationStatus.Approved]: "bg-green-50 text-green-700 border-green-200",
        [ApplicationStatus.Rejected]: "bg-red-50 text-red-700 border-red-200",
    };
    
    const icons = {
        [ApplicationStatus.Draft]: Clock,
        [ApplicationStatus.Pending]: Clock,
        [ApplicationStatus.UnderReview]: Loader2,
        [ApplicationStatus.Approved]: CheckCircle,
        [ApplicationStatus.Rejected]: XCircle,
    };

    const Icon = icons[status];

    return (
        <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${config[status]}`}>
            <Icon size={14} /> {status}
        </span>
    );
};

// Helpers for AI colors
const getChanceColor = (c: AdmissionChance) => {
    switch(c) {
        case AdmissionChance.High: return '#16a34a'; 
        case AdmissionChance.Moderate: return '#ca8a04'; 
        case AdmissionChance.Low: return '#dc2626'; 
        default: return '#94a3b8';
    }
};

const getTextColor = (c: AdmissionChance) => {
    switch(c) {
        case AdmissionChance.High: return 'text-green-600'; 
        case AdmissionChance.Moderate: return 'text-yellow-600'; 
        case AdmissionChance.Low: return 'text-red-600'; 
        default: return 'text-slate-500';
    }
};

const getBgColor = (c: AdmissionChance) => {
    switch(c) {
        case AdmissionChance.High: return 'bg-green-50'; 
        case AdmissionChance.Moderate: return 'bg-yellow-50'; 
        case AdmissionChance.Low: return 'bg-red-50'; 
        default: return 'bg-slate-50';
    }
};