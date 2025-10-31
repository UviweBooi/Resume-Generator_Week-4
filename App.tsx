
import React, { useState, useRef, useCallback } from 'react';
import { INITIAL_RESUME_DATA } from './constants';
import { ResumeData, Experience, Education, Template, ActiveTab } from './types';
import { enhanceWithAI, generateCoverLetter } from './services/geminiService';
import { SparklesIcon, DownloadIcon, PlusIcon, TrashIcon } from './components/icons';
import { ResumePreview } from './components/ResumePreview';

// Helper to generate unique IDs
const uuid = () => `id-${Math.random().toString(36).substr(2, 9)}`;

// Define action types for the reducer
type ResumeAction =
  | { type: 'UPDATE_FIELD'; field: keyof ResumeData; value: any }
  | { type: 'ADD_EXPERIENCE' }
  | { type: 'UPDATE_EXPERIENCE'; id: string; field: keyof Experience; value: string }
  | { type: 'REMOVE_EXPERIENCE'; id: string }
  | { type: 'ADD_EDUCATION' }
  | { type: 'UPDATE_EDUCATION'; id: string; field: keyof Education; value: string }
  | { type: 'REMOVE_EDUCATION'; id: string };

// Reducer function to manage resume data state
const resumeReducer = (state: ResumeData, action: ResumeAction): ResumeData => {
  switch (action.type) {
    case 'UPDATE_FIELD':
      return { ...state, [action.field]: action.value };
    case 'ADD_EXPERIENCE':
      return { ...state, experience: [...state.experience, { id: uuid(), jobTitle: '', company: '', startDate: '', endDate: '', description: '' }] };
    case 'UPDATE_EXPERIENCE':
      return { ...state, experience: state.experience.map(exp => exp.id === action.id ? { ...exp, [action.field]: action.value } : exp) };
    case 'REMOVE_EXPERIENCE':
      return { ...state, experience: state.experience.filter(exp => exp.id !== action.id) };
    case 'ADD_EDUCATION':
      return { ...state, education: [...state.education, { id: uuid(), degree: '', institution: '', gradDate: '' }] };
    case 'UPDATE_EDUCATION':
        return { ...state, education: state.education.map(edu => edu.id === action.id ? { ...edu, [action.field]: action.value } : edu) };
    case 'REMOVE_EDUCATION':
        return { ...state, education: state.education.filter(edu => edu.id !== action.id) };
    default:
      return state;
  }
};


const AIEnhanceButton: React.FC<{ onClick: () => void, isLoading: boolean }> = ({ onClick, isLoading }) => (
    <button
        type="button"
        onClick={onClick}
        disabled={isLoading}
        className="absolute top-1 right-1 p-1 text-slate-400 hover:text-blue-500 disabled:text-slate-300 transition-colors"
    >
        {isLoading ? <div className="w-4 h-4 border-2 border-slate-300 border-t-blue-500 rounded-full animate-spin"></div> : <SparklesIcon className="w-4 h-4" />}
    </button>
);

const FormSection: React.FC<{ title: string, children: React.ReactNode }> = ({ title, children }) => (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm mb-6">
        <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-4">{title}</h3>
        {children}
    </div>
);

const InputField: React.FC<{ label: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, name: string, placeholder?: string }> = ({ label, ...props }) => (
    <div className="mb-4">
        <label htmlFor={props.name} className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">{label}</label>
        <input id={props.name} {...props} className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"/>
    </div>
);

const TextAreaField: React.FC<{ label: string, value: string, onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void, name: string, onEnhance?: () => void, isLoading?: boolean }> = ({ label, onEnhance, isLoading, ...props }) => (
    <div className="mb-4">
        <label htmlFor={props.name} className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">{label}</label>
        <div className="relative">
            <textarea id={props.name} {...props} rows={5} className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"></textarea>
            {onEnhance && <AIEnhanceButton onClick={onEnhance} isLoading={!!isLoading} />}
        </div>
    </div>
);

const ResumeForm: React.FC<{ 
    data: ResumeData; 
    dispatch: React.Dispatch<ResumeAction>; 
    handleEnhance: (field: keyof ResumeData | `experience.${string}.description`, value: string) => Promise<void>;
    loadingStates: Record<string, boolean>;
}> = ({ data, dispatch, handleEnhance, loadingStates }) => (
    <div className="space-y-4">
        <FormSection title="Personal Details">
            <InputField label="Full Name" name="fullName" value={data.fullName} onChange={e => dispatch({type: 'UPDATE_FIELD', field: 'fullName', value: e.target.value})} />
            <InputField label="Email" name="email" value={data.email} onChange={e => dispatch({type: 'UPDATE_FIELD', field: 'email', value: e.target.value})} />
            <InputField label="Phone" name="phone" value={data.phone} onChange={e => dispatch({type: 'UPDATE_FIELD', field: 'phone', value: e.target.value})} />
            <InputField label="Address" name="address" value={data.address} onChange={e => dispatch({type: 'UPDATE_FIELD', field: 'address', value: e.target.value})} />
        </FormSection>
        <FormSection title="Professional Summary">
            <TextAreaField 
                label="Summary" 
                name="summary" 
                value={data.summary} 
                onChange={e => dispatch({type: 'UPDATE_FIELD', field: 'summary', value: e.target.value})}
                onEnhance={() => handleEnhance('summary', data.summary)}
                isLoading={loadingStates['summary']}
            />
        </FormSection>
        <FormSection title="Work Experience">
            {data.experience.map((exp, index) => (
                <div key={exp.id} className="p-4 border border-slate-200 dark:border-slate-700 rounded-md mb-4 relative">
                    <InputField label="Job Title" name={`jobTitle-${exp.id}`} value={exp.jobTitle} onChange={e => dispatch({ type: 'UPDATE_EXPERIENCE', id: exp.id, field: 'jobTitle', value: e.target.value })} />
                    <InputField label="Company" name={`company-${exp.id}`} value={exp.company} onChange={e => dispatch({ type: 'UPDATE_EXPERIENCE', id: exp.id, field: 'company', value: e.target.value })} />
                    <div className="grid grid-cols-2 gap-4">
                        <InputField label="Start Date" name={`startDate-${exp.id}`} value={exp.startDate} onChange={e => dispatch({ type: 'UPDATE_EXPERIENCE', id: exp.id, field: 'startDate', value: e.target.value })} />
                        <InputField label="End Date" name={`endDate-${exp.id}`} value={exp.endDate} onChange={e => dispatch({ type: 'UPDATE_EXPERIENCE', id: exp.id, field: 'endDate', value: e.target.value })} />
                    </div>
                    <TextAreaField 
                        label="Description" 
                        name={`description-${exp.id}`} 
                        value={exp.description} 
                        onChange={e => dispatch({ type: 'UPDATE_EXPERIENCE', id: exp.id, field: 'description', value: e.target.value })}
                        onEnhance={() => handleEnhance(`experience.${exp.id}.description`, exp.description)}
                        isLoading={loadingStates[`experience.${exp.id}.description`]}
                    />
                    <button onClick={() => dispatch({type: 'REMOVE_EXPERIENCE', id: exp.id})} className="absolute top-2 right-2 text-slate-400 hover:text-red-500 transition"><TrashIcon className="w-5 h-5"/></button>
                </div>
            ))}
            <button onClick={() => dispatch({type: 'ADD_EXPERIENCE'})} className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 font-semibold hover:underline">
                <PlusIcon className="w-4 h-4"/> Add Experience
            </button>
        </FormSection>
        <FormSection title="Education">
            {data.education.map((edu, index) => (
                <div key={edu.id} className="p-4 border border-slate-200 dark:border-slate-700 rounded-md mb-4 relative">
                    <InputField label="Degree" name={`degree-${edu.id}`} value={edu.degree} onChange={e => dispatch({type: 'UPDATE_EDUCATION', id: edu.id, field: 'degree', value: e.target.value})} />
                    <InputField label="Institution" name={`institution-${edu.id}`} value={edu.institution} onChange={e => dispatch({type: 'UPDATE_EDUCATION', id: edu.id, field: 'institution', value: e.target.value})} />
                    <InputField label="Graduation Date" name={`gradDate-${edu.id}`} value={edu.gradDate} onChange={e => dispatch({type: 'UPDATE_EDUCATION', id: edu.id, field: 'gradDate', value: e.target.value})} />
                    <button onClick={() => dispatch({type: 'REMOVE_EDUCATION', id: edu.id})} className="absolute top-2 right-2 text-slate-400 hover:text-red-500 transition"><TrashIcon className="w-5 h-5"/></button>
                </div>
            ))}
            <button onClick={() => dispatch({type: 'ADD_EDUCATION'})} className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 font-semibold hover:underline">
                <PlusIcon className="w-4 h-4"/> Add Education
            </button>
        </FormSection>
         <FormSection title="Skills">
            <TextAreaField label="Skills (comma separated)" name="skills" value={data.skills} onChange={e => dispatch({type: 'UPDATE_FIELD', field: 'skills', value: e.target.value})} />
        </FormSection>
    </div>
);

const CoverLetterForm: React.FC<{
    jobTitle: string;
    setJobTitle: (val: string) => void;
    company: string;
    setCompany: (val: string) => void;
    onGenerate: () => void;
    isLoading: boolean;
}> = ({ jobTitle, setJobTitle, company, setCompany, onGenerate, isLoading }) => (
    <FormSection title="Cover Letter Details">
        <InputField label="Job Title" name="jobTitle" value={jobTitle} onChange={e => setJobTitle(e.target.value)} placeholder="e.g., Senior Software Engineer" />
        <InputField label="Company Name" name="company" value={company} onChange={e => setCompany(e.target.value)} placeholder="e.g., Google" />
        <button onClick={onGenerate} disabled={isLoading} className="w-full flex justify-center items-center gap-2 bg-blue-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-blue-400 transition">
            {isLoading ? "Generating..." : "Generate Cover Letter"} <SparklesIcon className="w-5 h-5" />
        </button>
    </FormSection>
);

const CoverLetterPreview: React.FC<{ content: string, previewRef: React.RefObject<HTMLDivElement> }> = ({ content, previewRef }) => (
    <div ref={previewRef} className="bg-white p-10 font-serif text-slate-800">
        <pre className="whitespace-pre-wrap font-sans text-sm">{content}</pre>
    </div>
);


export default function App() {
    const [resumeData, dispatch] = React.useReducer(resumeReducer, INITIAL_RESUME_DATA);
    const [template, setTemplate] = useState<Template>(Template.MODERN);
    const [activeTab, setActiveTab] = useState<ActiveTab>(ActiveTab.RESUME);
    const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});

    const [jobTitle, setJobTitle] = useState('');
    const [company, setCompany] = useState('');
    const [coverLetterContent, setCoverLetterContent] = useState('Fill in the details and click "Generate" to create your cover letter.');
    const [isCoverLetterLoading, setIsCoverLetterLoading] = useState(false);
    
    const resumePreviewRef = useRef<HTMLDivElement>(null);
    const coverLetterPreviewRef = useRef<HTMLDivElement>(null);
    
    const handleEnhance = useCallback(async (field: keyof ResumeData | `experience.${string}.description`, value: string) => {
        setLoadingStates(prev => ({ ...prev, [field]: true }));
        const section = field.includes('experience') ? 'Experience Description' : 'Summary';
        const enhancedText = await enhanceWithAI(value, section);
        
        if (field.startsWith('experience.')) {
            const id = field.split('.')[1];
            dispatch({ type: 'UPDATE_EXPERIENCE', id, field: 'description', value: enhancedText });
        } else {
            dispatch({ type: 'UPDATE_FIELD', field: field as keyof ResumeData, value: enhancedText });
        }
        setLoadingStates(prev => ({ ...prev, [field]: false }));
    }, []);

    const handleGenerateCoverLetter = async () => {
        if (!jobTitle || !company) {
            alert("Please provide both a Job Title and Company Name.");
            return;
        }
        setIsCoverLetterLoading(true);
        const content = await generateCoverLetter(resumeData, jobTitle, company);
        setCoverLetterContent(content);
        setIsCoverLetterLoading(false);
    };

    const handleDownloadPDF = async () => {
        // Fix for: Property 'jspdf' does not exist on type 'Window & typeof globalThis'.
        const { jsPDF } = (window as any).jspdf;
        const element = activeTab === ActiveTab.RESUME ? resumePreviewRef.current : coverLetterPreviewRef.current;
        if (!element) return;

        // Fix for: Cannot find name 'html2canvas'.
        const canvas = await (window as any).html2canvas(element, { scale: 2 });
        const imgData = canvas.toDataURL('image/png');

        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'px',
            format: [canvas.width, canvas.height]
        });
        
        pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
        const fileName = activeTab === ActiveTab.RESUME ? `${resumeData.fullName}_Resume.pdf` : `${resumeData.fullName}_Cover_Letter.pdf`;
        pdf.save(fileName);
    };

    const TabButton: React.FC<{ tabName: ActiveTab }> = ({ tabName }) => (
        <button
            onClick={() => setActiveTab(tabName)}
            className={`px-4 py-2 text-sm font-semibold rounded-md transition ${activeTab === tabName ? 'bg-blue-600 text-white' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
        >
            {tabName}
        </button>
    );

    const TemplateButton: React.FC<{ templateName: Template }> = ({ templateName }) => (
        <button
            onClick={() => setTemplate(templateName)}
            className={`px-4 py-2 text-sm font-semibold rounded-md transition ${template === templateName ? 'bg-slate-600 text-white' : 'bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-600'}`}
        >
            {templateName}
        </button>
    );

    return (
        <div className="min-h-screen flex flex-col font-sans text-slate-900 dark:text-slate-100">
            <header className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg sticky top-0 z-20 shadow-sm">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
                    <div className="flex items-center gap-3">
                        <SparklesIcon className="w-6 h-6 text-blue-500"/>
                        <h1 className="text-xl font-bold text-slate-800 dark:text-slate-200">AI Resume Builder</h1>
                    </div>
                     <button
                        onClick={handleDownloadPDF}
                        className="flex items-center gap-2 bg-blue-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-700 transition"
                    >
                        <DownloadIcon className="w-5 h-5" /> Download PDF
                    </button>
                </div>
            </header>

            <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left Panel: Form */}
                    <div className="lg:h-[calc(100vh-10rem)] lg:overflow-y-auto pr-4">
                        <div className="flex gap-2 mb-6">
                            <TabButton tabName={ActiveTab.RESUME} />
                            <TabButton tabName={ActiveTab.COVER_LETTER} />
                        </div>

                        {activeTab === ActiveTab.RESUME ? (
                            <ResumeForm data={resumeData} dispatch={dispatch} handleEnhance={handleEnhance} loadingStates={loadingStates} />
                        ) : (
                            <CoverLetterForm 
                                jobTitle={jobTitle} 
                                setJobTitle={setJobTitle} 
                                company={company} 
                                setCompany={setCompany} 
                                onGenerate={handleGenerateCoverLetter} 
                                isLoading={isCoverLetterLoading}
                            />
                        )}
                    </div>

                    {/* Right Panel: Preview */}
                    <div className="lg:h-[calc(100vh-10rem)] flex flex-col">
                        {activeTab === ActiveTab.RESUME && (
                             <div className="flex items-center justify-between mb-4">
                                <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">Template Style</span>
                                <div className="flex gap-2 p-1 bg-slate-200 dark:bg-slate-800 rounded-lg">
                                    <TemplateButton templateName={Template.MODERN} />
                                    <TemplateButton templateName={Template.CLASSIC} />
                                </div>
                            </div>
                        )}
                        <div className="flex-grow bg-slate-200 dark:bg-slate-800 rounded-lg p-4 lg:p-8 overflow-y-auto shadow-inner">
                             <div className="mx-auto" style={{ width: '210mm', minHeight: '297mm' }}>
                               {activeTab === ActiveTab.RESUME ? (
                                    <ResumePreview resumeData={resumeData} template={template} previewRef={resumePreviewRef} />
                               ) : (
                                    <CoverLetterPreview content={coverLetterContent} previewRef={coverLetterPreviewRef} />
                               )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
