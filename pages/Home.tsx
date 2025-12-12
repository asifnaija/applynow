import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, BookOpen, CheckCircle, TrendingUp, Users, Clock, Shield, Star, Award, Zap } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useApp();

  const handleStart = () => {
    if (currentUser) {
      navigate('/apply');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center py-16 lg:py-24 px-4 text-center">
        <div className="max-w-4xl mx-auto">
            <span className="inline-block py-1 px-3 rounded-full bg-brand-100 text-brand-700 text-sm font-bold tracking-wide mb-6 animate-fadeIn">
                Admissions Fall 2025 Now Open
            </span>
            <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight mb-6 leading-tight">
            Your Future Starts <span className="text-brand-600 bg-clip-text text-transparent bg-gradient-to-r from-brand-600 to-blue-500">Here</span>.
            </h1>
            <p className="text-lg md:text-2xl text-slate-600 mb-10 leading-relaxed max-w-2xl mx-auto">
            Experience the most seamless university application process. 
            Track your status in real-time and get instant AI-powered admission probabilities.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <button 
                onClick={handleStart}
                className="px-8 py-4 bg-brand-600 text-white rounded-full font-bold text-lg shadow-lg shadow-brand-500/30 hover:bg-brand-700 hover:shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-2"
            >
                Start Application <ArrowRight size={20} />
            </button>
            <button 
                onClick={() => navigate('/login')} 
                className="px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-full font-bold text-lg hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm"
            >
                Admin Demo
            </button>
            </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl px-4 relative z-10">
            <div className="bg-white p-8 rounded-2xl shadow-soft border border-slate-100 flex flex-col items-center text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                <div className="p-4 bg-blue-50 rounded-2xl mb-6 group-hover:bg-blue-100 transition-colors">
                    <BookOpen className="text-blue-600 h-8 w-8" />
                </div>
                <h3 className="font-bold text-xl mb-3 text-slate-900">Easy Application</h3>
                <p className="text-slate-500 leading-relaxed">Intuitive step-by-step wizard that saves your progress automatically so you never lose your work.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-soft border border-slate-100 flex flex-col items-center text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                <div className="p-4 bg-purple-50 rounded-2xl mb-6 group-hover:bg-purple-100 transition-colors">
                    <TrendingUp className="text-purple-600 h-8 w-8" />
                </div>
                <h3 className="font-bold text-xl mb-3 text-slate-900">AI Predictor</h3>
                <p className="text-slate-500 leading-relaxed">Get an instant, data-driven probability score based on your GPA and test scores before you submit.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-soft border border-slate-100 flex flex-col items-center text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                <div className="p-4 bg-green-50 rounded-2xl mb-6 group-hover:bg-green-100 transition-colors">
                    <CheckCircle className="text-green-600 h-8 w-8" />
                </div>
                <h3 className="font-bold text-xl mb-3 text-slate-900">Real-time Status</h3>
                <p className="text-slate-500 leading-relaxed">Never wonder where your application stands. Live dashboard updates keep you informed 24/7.</p>
            </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white border-y border-slate-100 py-16">
        <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <div className="text-center">
                    <div className="flex justify-center mb-2 text-brand-600"><Users size={32} /></div>
                    <p className="text-4xl font-bold text-slate-900 mb-1">10k+</p>
                    <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Applicants</p>
                </div>
                <div className="text-center">
                    <div className="flex justify-center mb-2 text-brand-600"><Clock size={32} /></div>
                    <p className="text-4xl font-bold text-slate-900 mb-1">24h</p>
                    <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Avg. Review Time</p>
                </div>
                <div className="text-center">
                    <div className="flex justify-center mb-2 text-brand-600"><Award size={32} /></div>
                    <p className="text-4xl font-bold text-slate-900 mb-1">#1</p>
                    <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Rated Platform</p>
                </div>
                <div className="text-center">
                    <div className="flex justify-center mb-2 text-brand-600"><Shield size={32} /></div>
                    <p className="text-4xl font-bold text-slate-900 mb-1">100%</p>
                    <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Secure Data</p>
                </div>
            </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-24 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">Simple 3-Step Process</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">We've eliminated the paperwork. Apply to your dream program in minutes, not days.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-12 relative">
            {/* Connecting Line (Desktop) */}
            <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-1 bg-gradient-to-r from-brand-200 via-brand-200 to-brand-200 -z-10"></div>

            <div className="flex flex-col items-center text-center">
                <div className="w-24 h-24 bg-white border-4 border-brand-100 rounded-full flex items-center justify-center mb-6 shadow-lg z-10">
                    <span className="text-2xl font-bold text-brand-600">1</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Create Profile</h3>
                <p className="text-slate-500">Sign up and enter your basic personal details. Our system saves as you type.</p>
            </div>
            
            <div className="flex flex-col items-center text-center">
                <div className="w-24 h-24 bg-white border-4 border-brand-100 rounded-full flex items-center justify-center mb-6 shadow-lg z-10">
                    <span className="text-2xl font-bold text-brand-600">2</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Upload & Analyze</h3>
                <p className="text-slate-500">Input your grades and let our AI instantly analyze your admission probability.</p>
            </div>

            <div className="flex flex-col items-center text-center">
                <div className="w-24 h-24 bg-brand-600 border-4 border-brand-200 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-brand-200 z-10">
                    <CheckCircle className="text-white h-10 w-10" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Get Decision</h3>
                <p className="text-slate-500">Submit your application and track the status in real-time on your dashboard.</p>
            </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-slate-900 py-24 px-4 text-white relative overflow-hidden">
        {/* Background Accents */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <div className="absolute -top-20 -left-20 w-96 h-96 bg-brand-500 rounded-full filter blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500 rounded-full filter blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
            <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-16">Trusted by Students</h2>
            <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-8 rounded-2xl">
                    <div className="flex gap-1 text-yellow-400 mb-4">
                        <Star fill="currentColor" size={20} />
                        <Star fill="currentColor" size={20} />
                        <Star fill="currentColor" size={20} />
                        <Star fill="currentColor" size={20} />
                        <Star fill="currentColor" size={20} />
                    </div>
                    <p className="text-lg text-slate-300 italic mb-6">"The AI admission predictor gave me the confidence I needed. It was surprisingly accurate and helped me improve my personal statement."</p>
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-brand-500 flex items-center justify-center font-bold">SJ</div>
                        <div>
                            <p className="font-bold">Sarah Jenkins</p>
                            <p className="text-sm text-slate-400">Computer Science Major</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-8 rounded-2xl">
                    <div className="flex gap-1 text-yellow-400 mb-4">
                        <Star fill="currentColor" size={20} />
                        <Star fill="currentColor" size={20} />
                        <Star fill="currentColor" size={20} />
                        <Star fill="currentColor" size={20} />
                        <Star fill="currentColor" size={20} />
                    </div>
                    <p className="text-lg text-slate-300 italic mb-6">"ApplyNow made the stressful process so much easier. The dashboard kept me updated every step of the way. Highly recommended!"</p>
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-purple-500 flex items-center justify-center font-bold">MT</div>
                        <div>
                            <p className="font-bold">Michael Torres</p>
                            <p className="text-sm text-slate-400">Engineering Applicant</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-brand-600 py-20 px-4 text-center text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
        <div className="max-w-3xl mx-auto relative z-10">
            <Zap className="mx-auto h-12 w-12 mb-6 text-yellow-300" />
            <h2 className="text-3xl md:text-5xl font-extrabold mb-6">Ready to shape your future?</h2>
            <p className="text-xl text-brand-100 mb-10">Join thousands of students who have successfully launched their academic careers with ApplyNow.</p>
            <button 
                onClick={handleStart}
                className="px-10 py-4 bg-white text-brand-700 rounded-full font-bold text-xl shadow-xl hover:bg-slate-50 hover:scale-105 transition-all"
            >
                Get Started Today
            </button>
        </div>
      </section>
    </div>
  );
};