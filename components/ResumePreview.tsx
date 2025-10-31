
import React from 'react';
import { ResumeData, Template } from '../types';

interface ResumePreviewProps {
  resumeData: ResumeData;
  template: Template;
  previewRef: React.RefObject<HTMLDivElement>;
}

const ModernTemplate: React.FC<{ data: ResumeData }> = ({ data }) => (
    <div className="bg-white p-8 text-slate-800 flex flex-row gap-8">
        <div className="w-1/3 pr-8 border-r border-slate-200">
            <h1 className="text-3xl font-bold text-slate-900">{data.fullName}</h1>
            <div className="mt-4 text-sm text-slate-600">
                <p>{data.email}</p>
                <p>{data.phone}</p>
                <p>{data.address}</p>
            </div>
            <div className="mt-8">
                <h2 className="text-sm font-bold uppercase tracking-widest text-blue-600">Summary</h2>
                <p className="mt-2 text-sm">{data.summary}</p>
            </div>
            <div className="mt-8">
                <h2 className="text-sm font-bold uppercase tracking-widest text-blue-600">Skills</h2>
                <p className="mt-2 text-sm">{data.skills}</p>
            </div>
        </div>
        <div className="w-2/3">
            <div className="mb-8">
                <h2 className="text-sm font-bold uppercase tracking-widest text-blue-600 border-b-2 border-blue-600 pb-1">Experience</h2>
                {data.experience.map(exp => (
                    <div key={exp.id} className="mt-4">
                        <h3 className="text-lg font-semibold">{exp.jobTitle}</h3>
                        <div className="flex justify-between items-baseline text-sm text-slate-600">
                            <p className="font-medium">{exp.company}</p>
                            <p><em>{exp.startDate} - {exp.endDate}</em></p>
                        </div>
                        <ul className="mt-2 text-sm list-disc list-inside space-y-1">
                            {exp.description.split('\n').map((line, i) => line && <li key={i}>{line.replace(/^- /, '')}</li>)}
                        </ul>
                    </div>
                ))}
            </div>
            <div>
                <h2 className="text-sm font-bold uppercase tracking-widest text-blue-600 border-b-2 border-blue-600 pb-1">Education</h2>
                {data.education.map(edu => (
                    <div key={edu.id} className="mt-4">
                        <h3 className="text-lg font-semibold">{edu.degree}</h3>
                        <div className="flex justify-between items-baseline text-sm text-slate-600">
                            <p className="font-medium">{edu.institution}</p>
                            <p><em>{edu.gradDate}</em></p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

const ClassicTemplate: React.FC<{ data: ResumeData }> = ({ data }) => (
    <div className="bg-white p-10 text-gray-800 font-[Garamond,serif]">
        <div className="text-center border-b-2 border-gray-400 pb-4">
            <h1 className="text-4xl font-bold tracking-wider">{data.fullName}</h1>
            <p className="mt-2 text-sm">{data.address} | {data.phone} | {data.email}</p>
        </div>
        <div className="mt-6">
            <h2 className="text-xl font-bold border-b border-gray-300 pb-1">Summary</h2>
            <p className="mt-2 text-sm">{data.summary}</p>
        </div>
        <div className="mt-6">
            <h2 className="text-xl font-bold border-b border-gray-300 pb-1">Experience</h2>
            {data.experience.map(exp => (
                <div key={exp.id} className="mt-4">
                    <div className="flex justify-between items-baseline">
                        <h3 className="text-lg font-semibold">{exp.jobTitle}</h3>
                        <p className="text-sm"><em>{exp.startDate} - {exp.endDate}</em></p>
                    </div>
                    <p className="text-md font-medium italic">{exp.company}</p>
                    <ul className="mt-2 text-sm list-disc list-inside space-y-1">
                        {exp.description.split('\n').map((line, i) => line && <li key={i}>{line.replace(/^- /, '')}</li>)}
                    </ul>
                </div>
            ))}
        </div>
        <div className="mt-6">
            <h2 className="text-xl font-bold border-b border-gray-300 pb-1">Education</h2>
            {data.education.map(edu => (
                <div key={edu.id} className="mt-4">
                    <div className="flex justify-between items-baseline">
                        <h3 className="text-lg font-semibold">{edu.degree}</h3>
                        <p className="text-sm"><em>{edu.gradDate}</em></p>
                    </div>
                    <p className="text-md font-medium italic">{edu.institution}</p>
                </div>
            ))}
        </div>
        <div className="mt-6">
            <h2 className="text-xl font-bold border-b border-gray-300 pb-1">Skills</h2>
            <p className="mt-2 text-sm">{data.skills}</p>
        </div>
    </div>
);

export const ResumePreview: React.FC<ResumePreviewProps> = ({ resumeData, template, previewRef }) => {
  return (
    <div ref={previewRef} className="w-full h-full">
      {template === Template.MODERN ? <ModernTemplate data={resumeData} /> : <ClassicTemplate data={resumeData} />}
    </div>
  );
};
