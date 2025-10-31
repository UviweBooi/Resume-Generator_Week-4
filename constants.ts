
import { ResumeData } from './types';

export const INITIAL_RESUME_DATA: ResumeData = {
  fullName: 'Jane Doe',
  email: 'jane.doe@email.com',
  phone: '123-456-7890',
  address: '123 Main St, Anytown, USA',
  summary: 'A highly motivated and detail-oriented professional with 5 years of experience in project management. Seeking to leverage strong leadership and communication skills to contribute to a dynamic team.',
  experience: [
    {
      id: 'exp1',
      jobTitle: 'Project Manager',
      company: 'Tech Solutions Inc.',
      startDate: 'Jan 2020',
      endDate: 'Present',
      description: '- Led cross-functional teams to deliver projects on time and within budget.\n- Developed project plans and tracked progress using Agile methodologies.\n- Communicated project status to stakeholders and managed expectations.'
    },
    {
      id: 'exp2',
      jobTitle: 'Project Coordinator',
      company: 'Innovate Corp.',
      startDate: 'Jun 2018',
      endDate: 'Dec 2019',
      description: '- Assisted project managers with daily tasks and scheduling.\n- Prepared project documentation and reports.\n- Coordinated team meetings and recorded minutes.'
    }
  ],
  education: [
    {
      id: 'edu1',
      degree: 'Master of Business Administration',
      institution: 'State University',
      gradDate: 'May 2018'
    },
     {
      id: 'edu2',
      degree: 'Bachelor of Science in Business',
      institution: 'City College',
      gradDate: 'May 2016'
    }
  ],
  skills: 'Project Management, Agile, Scrum, JIRA, Communication, Leadership, Risk Management, Budgeting'
};
