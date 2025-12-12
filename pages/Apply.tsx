import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useLocation } from 'react-router-dom';
import { Stepper } from '../components/Stepper';
import { FormField } from '../components/FormField';
import { useApp } from '../context/AppContext';
import { ChevronRight, ChevronLeft, Save, Info } from 'lucide-react';
import { PersonalInfo, AcademicInfo, GuardianInfo } from '../types';

// Zod Schemas

const personalSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(10, "Phone number required"),
  dob: z.string().min(1, "Date of Birth required"),
  address: z.string().min(5, "Address required"),
});

// Refined schema to handle optional test score for 'Other' type
const academicSchema = z.object({
  gpa: z.preprocess((val) => Number(val), z.number().min(0, "GPA is required").max(4.0, "GPA cannot exceed 4.0")),
  testType: z.enum(['SAT', 'ACT', 'Other']),
  testScore: z.string(), // We take input as string to validate emptiness easily
  highSchool: z.string().min(2, "School name required"),
  graduationYear: z.preprocess((val) => Number(val), z.number().min(2000).max(2030)),
  activities: z.string().min(10, "Please list at least one activity"),
  personalStatement: z.string().optional(), // Made optional
}).superRefine((data, ctx) => {
  if (data.testType !== 'Other') {
    if (!data.testScore || data.testScore.trim() === '') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `${data.testType} Score is required`,
        path: ["testScore"],
      });
    } else if (isNaN(Number(data.testScore))) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Score must be a number",
        path: ["testScore"],
      });
    }
  }
});

const guardianSchema = z.object({
  fullName: z.string().min(2, "Guardian name required"),
  relationship: z.string().min(2, "Relationship required"),
  phone: z.string().min(10, "Phone number required"),
  email: z.string().email("Invalid email"),
});

const STEPS = ['Personal', 'Academic', 'Guardian', 'Review'];

export const Apply: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { submitApplication, currentUser } = useApp();
  const [currentStep, setCurrentStep] = useState(0);

  // Initialize form data from location state (for editing) or empty
  const initialData = location.state?.initialData;
  
  const [formData, setFormData] = useState<{
    personal?: PersonalInfo;
    academic?: AcademicInfo;
    guardian?: GuardianInfo;
  }>(initialData ? {
    personal: initialData.personal,
    academic: initialData.academic,
    guardian: initialData.guardian
  } : {});

  // Render Logic Helper
  const StepContent = () => {
    switch (currentStep) {
      case 0: return <PersonalStep onSubmit={handleStepSubmit('personal')} initialData={formData.personal} />;
      case 1: return <AcademicStep onSubmit={handleStepSubmit('academic')} onBack={handleBack} initialData={formData.academic} />;
      case 2: return <GuardianStep onSubmit={handleStepSubmit('guardian')} onBack={handleBack} initialData={formData.guardian} />;
      case 3: return <ReviewStep data={formData} onBack={handleBack} onSubmit={handleFinalSubmit} />;
      default: return null;
    }
  };

  const handleStepSubmit = (key: keyof typeof formData) => (data: any) => {
    // For academic step, convert testScore string to number before saving to state.
    // If empty string (for 'Other'), coerce to 0.
    if (key === 'academic') {
        const score = data.testScore && data.testScore.trim() !== '' ? Number(data.testScore) : 0;
        const academicData = { ...data, testScore: score };
        setFormData(prev => ({ ...prev, [key]: academicData }));
    } else {
        setFormData(prev => ({ ...prev, [key]: data }));
    }
    setCurrentStep(prev => prev + 1);
    window.scrollTo(0, 0);
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
    window.scrollTo(0, 0);
  };

  const handleFinalSubmit = () => {
    if (formData.personal && formData.academic && formData.guardian && currentUser) {
      const newAppId = submitApplication({
        userId: currentUser.id,
        personal: formData.personal,
        academic: formData.academic,
        guardian: formData.guardian,
      });
      
      // Navigate to success screen with the actual generated ID
      navigate('/submitted', { state: { referenceId: newAppId } });
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8 text-center sm:text-left">
        <h2 className="text-3xl font-bold text-slate-900 mb-2">New Application</h2>
        <p className="text-slate-600">Complete all steps below to submit your application for review.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-soft border border-slate-200 overflow-hidden">
        <div className="px-6 pt-8 pb-4 bg-white border-b border-slate-100">
           <Stepper steps={STEPS} currentStep={currentStep} />
        </div>
        
        <div className="p-6 md:p-10 bg-white">
           <StepContent />
        </div>
      </div>
    </div>
  );
};

// --- Sub-Components for Steps ---

const PersonalStep = ({ onSubmit, initialData }: { onSubmit: (d: any) => void, initialData?: any }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({ 
      resolver: zodResolver(personalSchema),
      defaultValues: initialData 
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 animate-fadeIn">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField label="First Name" error={errors.firstName?.message as string} {...register('firstName')} />
        <FormField label="Last Name" error={errors.lastName?.message as string} {...register('lastName')} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField label="Email" type="email" error={errors.email?.message as string} {...register('email')} />
        <FormField label="Phone" type="tel" error={errors.phone?.message as string} {...register('phone')} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField label="Date of Birth" type="date" error={errors.dob?.message as string} {...register('dob')} />
      </div>
      <FormField label="Address" as="textarea" error={errors.address?.message as string} {...register('address')} />

      <div className="flex justify-end pt-6">
        <button type="submit" className="btn-primary">Next Step <ChevronRight size={18} /></button>
      </div>
    </form>
  );
};

const AcademicStep = ({ onSubmit, onBack, initialData }: { onSubmit: (d: any) => void, onBack: () => void, initialData?: any }) => {
  // If editing, convert number back to string for the input
  const defaultValues = initialData ? {
      ...initialData,
      testScore: initialData.testScore === 0 && initialData.testType === 'Other' ? '' : String(initialData.testScore)
  } : undefined;

  const { register, handleSubmit, watch, formState: { errors } } = useForm({ 
      resolver: zodResolver(academicSchema),
      defaultValues 
  });

  const testType = watch('testType');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 animate-fadeIn">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <FormField label="GPA (4.0 Scale)" type="number" step="0.01" error={errors.gpa?.message as string} {...register('gpa')} />
        
        <FormField label="Test Type" as="select" options={[{label:'SAT', value:'SAT'}, {label:'ACT', value:'ACT'}, {label:'Other', value:'Other'}]} error={errors.testType?.message as string} {...register('testType')} />
        
        <FormField 
            label={`Test Score ${testType === 'Other' ? '(Optional)' : ''}`}
            type="number" 
            placeholder={testType === 'Other' ? "Optional" : "Required"}
            error={errors.testScore?.message as string} 
            {...register('testScore')} 
        />
      </div>
      
      {testType === 'Other' && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex gap-3 text-sm text-yellow-800 -mt-2">
            <Info className="flex-shrink-0 mt-0.5" size={18} />
            <p>
                You selected "Other" as your test type. Standardized test scores are less critical for this category, but providing a score may still help.
            </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField label="High School Name" error={errors.highSchool?.message as string} {...register('highSchool')} />
        <FormField label="Graduation Year" type="number" error={errors.graduationYear?.message as string} {...register('graduationYear')} />
      </div>
      <FormField label="Extracurricular Activities" as="textarea" placeholder="List your clubs, sports, awards, and leadership roles..." error={errors.activities?.message as string} {...register('activities')} />
      <FormField label="Personal Statement (Optional)" as="textarea" placeholder="Tell us about your goals and why you want to join..." className="h-32" error={errors.personalStatement?.message as string} {...register('personalStatement')} />

      <div className="flex justify-between pt-6">
        <button type="button" onClick={onBack} className="btn-secondary"><ChevronLeft size={18} /> Back</button>
        <button type="submit" className="btn-primary">Next Step <ChevronRight size={18} /></button>
      </div>
    </form>
  );
};

const GuardianStep = ({ onSubmit, onBack, initialData }: { onSubmit: (d: any) => void, onBack: () => void, initialData?: any }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({ 
      resolver: zodResolver(guardianSchema),
      defaultValues: initialData 
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 animate-fadeIn">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField label="Guardian Full Name" error={errors.fullName?.message as string} {...register('fullName')} />
        <FormField label="Relationship" error={errors.relationship?.message as string} {...register('relationship')} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField label="Guardian Phone" error={errors.phone?.message as string} {...register('phone')} />
        <FormField label="Guardian Email" error={errors.email?.message as string} {...register('email')} />
      </div>

      <div className="flex justify-between pt-6">
        <button type="button" onClick={onBack} className="btn-secondary"><ChevronLeft size={18} /> Back</button>
        <button type="submit" className="btn-primary">Review Application <ChevronRight size={18} /></button>
      </div>
    </form>
  );
};

const ReviewStep = ({ data, onBack, onSubmit }: { data: any, onBack: () => void, onSubmit: () => void }) => {
  return (
    <div className="space-y-8 animate-fadeIn">
        <div className="bg-brand-50 p-4 rounded-lg border border-brand-100 text-brand-900 flex gap-3 text-sm">
            <Info className="shrink-0 text-brand-600" size={20} />
            <p>Please review your details carefully before submitting. Once submitted, you cannot edit your application until a decision is made.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
                <h3 className="font-bold text-lg text-slate-800 border-b border-slate-200 pb-2">Personal Details</h3>
                <div className="space-y-2">
                    <ReviewItem label="Name" value={`${data.personal.firstName} ${data.personal.lastName}`} />
                    <ReviewItem label="Email" value={data.personal.email} />
                    <ReviewItem label="Phone" value={data.personal.phone} />
                    <ReviewItem label="Address" value={data.personal.address} />
                </div>
            </div>
            <div className="space-y-3">
                <h3 className="font-bold text-lg text-slate-800 border-b border-slate-200 pb-2">Academic Profile</h3>
                <div className="space-y-2">
                    <ReviewItem label="High School" value={data.academic.highSchool} />
                    <ReviewItem label="GPA" value={data.academic.gpa} />
                    <ReviewItem label={data.academic.testType} value={data.academic.testScore || 'N/A'} />
                    <ReviewItem label="Graduation" value={data.academic.graduationYear} />
                </div>
            </div>
            {/* Guardian Info Section Added */}
            <div className="space-y-3 col-span-1 md:col-span-2">
                <h3 className="font-bold text-lg text-slate-800 border-b border-slate-200 pb-2">Guardian Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                    <ReviewItem label="Guardian Name" value={data.guardian.fullName} />
                    <ReviewItem label="Relationship" value={data.guardian.relationship} />
                    <ReviewItem label="Phone" value={data.guardian.phone} />
                    <ReviewItem label="Email" value={data.guardian.email} />
                </div>
            </div>
        </div>

        <div className="flex justify-between pt-8 border-t border-slate-100">
            <button type="button" onClick={onBack} className="btn-secondary"><ChevronLeft size={18} /> Edit</button>
            <button type="button" onClick={onSubmit} className="px-8 py-3 bg-green-600 text-white rounded-lg font-bold text-lg hover:bg-green-700 transition-all flex items-center gap-2 shadow-lg shadow-green-200 hover:shadow-xl hover:-translate-y-0.5">
                <Save size={20} /> Submit Application
            </button>
        </div>
    </div>
  );
};

const ReviewItem = ({ label, value }: { label: string, value: string | number }) => (
    <div className="flex flex-col sm:flex-row sm:justify-between sm:border-b sm:border-slate-50 sm:pb-1">
        <span className="text-sm font-medium text-slate-500">{label}</span>
        <span className="text-sm font-semibold text-slate-800">{value}</span>
    </div>
);