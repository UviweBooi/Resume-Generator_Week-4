
export interface Experience {
  id: string;
  jobTitle: string;
  company: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface Education {
  id: string;
  degree: string;
  institution: string;
  gradDate: string;
}

export interface ResumeData {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  summary: string;
  experience: Experience[];
  education: Education[];
  skills: string;
}

export enum Template {
  MODERN = 'Modern',
  CLASSIC = 'Classic',
}

export enum ActiveTab {
  RESUME = 'Resume',
  COVER_LETTER = 'Cover Letter',
}
