import { PortfolioData } from "../types";

export const defaultPortfolio: PortfolioData = {
  header: {
    logoText: "Sanket.",
    role: "Computer Systems Engineer & UI/UX Designer",
    nameSpan: "Sanket",
    nameRest: "Kandel",
  },
  about: {
    title: "About Me",
    description: "I am a Computer Systems Engineering graduate and passionate UI/UX Designer & Web Developer based in Nepal. With a refined technical foundation and strong artistic eye, I craft websites, responsive layouts, and cross-platform mobile apps. I specialize in designing modern user interfaces that are both high-performing and highly functional.",
    photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600&auto=format&fit=crop",
    skills: [
      { label: "UI/UX Research", detail: "Designing highly-converting web applications & micro-interactions." },
      { label: "Web Development", detail: "Structuring fully responsive, modular frontends using modern frameworks." },
      { label: "App Development", detail: "Building lightweight Android and iOS interactive experiences." }
    ],
    experience: [
      { label: "2023 - Present", detail: "Team Lead of Development at A-one Tech Pvt. Ltd" },
      { label: "2021 - 2023", detail: "Lead Game Developer & Designer at Sanvi Tech Ltd" },
      { label: "2019 - 2021", detail: "Digital Marketing Executive at Serene Advertisers" }
    ],
    education: [
      { label: "2024", detail: "BSc (Hons) Computer Systems Engineering from University of Sunderland" },
      { label: "2023", detail: "BTEC in IT & Software Development from Pearson" }
    ]
  },
  services: {
    title: "My Services",
    list: [
      {
        id: "srv-1",
        icon: "Code",
        title: "Web Architecture",
        description: "Enforcing clean systems design, robust state paradigms, and lightning-fast loading speeds on all screen widths.",
        learnMoreUrl: "#"
      },
      {
        id: "srv-2",
        icon: "Layers",
        title: "UI/UX Design",
        description: "Crafting intuitive user flows, structural bento-grids, wireframes, and eye-watering visual micro-climates.",
        learnMoreUrl: "#"
      },
      {
        id: "srv-3",
        icon: "Smartphone",
        title: "Mobile App Design",
        description: "Designing sleek, pocket-budget mobile experiences configured with performance-centric gestures and layout systems.",
        learnMoreUrl: "#"
      }
    ]
  },
  portfolio: {
    title: "My Works",
    works: [
      {
        id: "work-1",
        title: "Social Media Platform",
        description: "A fast, fully-offline-first messaging experience that synchronizes seamlessly on low network coverage.",
        image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=600&auto=format&fit=crop",
        projectUrl: "#"
      },
      {
        id: "work-2",
        title: "Ambient Music Application",
        description: "An elegant music and soundscape experience equipped with high-fidelity, interactive controls.",
        image: "https://images.unsplash.com/photo-1614149162883-504ce4d13909?q=80&w=600&auto=format&fit=crop",
        projectUrl: "#"
      },
      {
        id: "work-3",
        title: "Micro-Commerce Platform",
        description: "A streamlined shopping environment featuring fluid transactions, lightweight state sync, and real-time carts.",
        image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=600&auto=format&fit=crop",
        projectUrl: "#"
      }
    ]
  },
  contact: {
    email: "kandel.sanket321@gmail.com",
    phone: "9844200458",
    cvUrl: "#",
    facebook: "https://www.facebook.com/kandel.sanket",
    instagram: "https://www.instagram.com/_happpy_insta_",
    youtube: "https://www.youtube.com/@sanketkandel",
    linkedin: "https://np.linkedin.com/in/sanket-kandel-19b135283"
  }
};
