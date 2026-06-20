export interface ListItem {
  label: string;
  detail: string;
}

export interface ServiceItem {
  id: string;
  icon: string; // lucide icon name like "Code", "Cpu", "Layout"
  title: string;
  description: string;
  learnMoreUrl?: string;
}

export interface WorkItem {
  id: string;
  title: string;
  description: string;
  image: string; // placeholder or unspash url
  projectUrl?: string;
}

export interface PortfolioData {
  header: {
    logoText: string;
    role: string;
    nameSpan: string;
    nameRest: string;
  };
  about: {
    title: string;
    description: string;
    photoUrl: string;
    skills: ListItem[];
    experience: ListItem[];
    education: ListItem[];
  };
  services: {
    title: string;
    list: ServiceItem[];
  };
  portfolio: {
    title: string;
    works: WorkItem[];
  };
  contact: {
    email: string;
    phone: string;
    cvUrl: string;
    facebook: string;
    instagram: string;
    youtube: string;
    linkedin: string;
  };
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
}
