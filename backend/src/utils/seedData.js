import dotenv from "dotenv";
import connectDB from "../config/db.js";
import Job from "../utils/Job.js";
import Course from "../models/Course.js";

dotenv.config();

const JOBS = [
  {
    title: "AI / ML Engineer",
    company: "OpenAI Careers",
    location: "Remote Friendly",
    salary: "$100k - $180k",
    type: "Full-time",
    description: "Builds machine learning models, training pipelines, and production AI systems.",
    skills: ["Python", "TensorFlow", "PyTorch", "ML Algorithms", "NumPy", "Pandas"],
    applyUrl: "https://careers.openai.com/"
  },
  {
    title: "Data Scientist",
    company: "DataWorks",
    location: "Hybrid",
    salary: "$80k - $150k",
    type: "Full-time",
    description: "Analyzes data, builds predictive models, and creates insights for decision making.",
    skills: ["Python", "SQL", "Statistics", "Pandas", "NumPy", "Power BI"],
    applyUrl: "https://www.linkedin.com/jobs/"
  },
  {
    title: "Cybersecurity Analyst",
    company: "SecureNet",
    location: "Remote / On-site",
    salary: "$70k - $130k",
    type: "Full-time",
    description: "Monitors threats, improves security posture, and protects systems and networks.",
    skills: ["Network Security", "SIEM", "Python", "Linux", "Risk Assessment"],
    applyUrl: "https://www.indeed.com/"
  },
  {
    title: "Cloud Engineer",
    company: "CloudOps Inc",
    location: "Remote",
    salary: "$90k - $160k",
    type: "Full-time",
    description: "Designs and manages cloud infrastructure, automation, and deployments.",
    skills: ["AWS", "Docker", "Kubernetes", "Terraform", "Linux"],
    applyUrl: "https://aws.amazon.com/careers/"
  },
  {
    title: "Full Stack Developer",
    company: "CareerStack Labs",
    location: "Hybrid / Remote",
    salary: "$75k - $140k",
    type: "Full-time",
    description: "Builds frontend and backend applications with modern web technologies.",
    skills: ["HTML", "CSS", "JavaScript", "React", "Node.js", "MongoDB", "REST API", "Git"],
    applyUrl: "https://github.com/"
  },
  {
    title: "DevOps Engineer",
    company: "InfraFlow",
    location: "Remote",
    salary: "$95k - $170k",
    type: "Full-time",
    description: "Improves delivery pipelines, infrastructure automation, and platform reliability.",
    skills: ["CI/CD", "Jenkins", "Docker", "Kubernetes", "AWS", "Linux"],
    applyUrl: "https://www.docker.com/careers/"
  }
];

const COURSES = [
  {
    title: "Python for Everybody",
    provider: "Coursera",
    category: "Programming",
    price: 0,
    image: "",
    link: "https://www.coursera.org/specializations/python",
    description: "Beginner-friendly Python course for programming fundamentals.",
    skills: ["Python"],
    level: "beginner"
  },
  {
    title: "Python Full Course",
    provider: "YouTube / freeCodeCamp",
    category: "Programming",
    price: 0,
    image: "",
    link: "https://www.youtube.com/watch?v=rfscVS0vtbw",
    description: "Comprehensive Python full course for beginners.",
    skills: ["Python"],
    level: "beginner"
  },
  {
    title: "TensorFlow in Practice",
    provider: "Coursera",
    category: "AI / ML",
    price: 0,
    image: "",
    link: "https://www.coursera.org/professional-certificates/tensorflow-in-practice",
    description: "Practical TensorFlow training for real-world ML workflows.",
    skills: ["TensorFlow", "Python"],
    level: "intermediate"
  },
  {
    title: "PyTorch Deep Learning",
    provider: "YouTube",
    category: "AI / ML",
    price: 0,
    image: "",
    link: "https://www.youtube.com/watch?v=GIsg-ZUy0MY",
    description: "Deep learning with PyTorch from basics to applied usage.",
    skills: ["PyTorch", "Python"],
    level: "intermediate"
  },
  {
    title: "Machine Learning by Andrew Ng",
    provider: "Coursera",
    category: "AI / ML",
    price: 0,
    image: "",
    link: "https://www.coursera.org/specializations/machine-learning-introduction",
    description: "Classic machine learning foundations course.",
    skills: ["ML Algorithms", "Python"],
    level: "beginner"
  },
  {
    title: "SQL for Data Science",
    provider: "Coursera",
    category: "Data",
    price: 0,
    image: "",
    link: "https://www.coursera.org/learn/sql-for-data-science",
    description: "Learn SQL fundamentals for analytics and querying.",
    skills: ["SQL"],
    level: "beginner"
  },
  {
    title: "Pandas Tutorial",
    provider: "YouTube",
    category: "Data",
    price: 0,
    image: "",
    link: "https://www.youtube.com/watch?v=vmEHCJofslg",
    description: "Hands-on tutorial for data manipulation using Pandas.",
    skills: ["Pandas", "Python"],
    level: "beginner"
  },
  {
    title: "Statistics with Python",
    provider: "Coursera",
    category: "Data Science",
    price: 0,
    image: "",
    link: "https://www.coursera.org/specializations/statistics-with-python",
    description: "Statistics fundamentals useful for data science and ML.",
    skills: ["Statistics", "Python"],
    level: "intermediate"
  },
  {
    title: "AWS Cloud Practitioner",
    provider: "Amazon",
    category: "Cloud",
    price: 0,
    image: "",
    link: "https://aws.amazon.com/certification/certified-cloud-practitioner/",
    description: "Foundational AWS certification and cloud concepts.",
    skills: ["AWS"],
    level: "beginner"
  },
  {
    title: "Docker Masterclass",
    provider: "YouTube",
    category: "DevOps",
    price: 0,
    image: "",
    link: "https://www.youtube.com/watch?v=3c-iBn73dDE",
    description: "Learn Docker containers, images, and workflows.",
    skills: ["Docker"],
    level: "beginner"
  },
  {
    title: "Kubernetes for Beginners",
    provider: "YouTube",
    category: "DevOps",
    price: 0,
    image: "",
    link: "https://www.youtube.com/watch?v=X48VuDVv0do",
    description: "Introductory Kubernetes concepts and cluster basics.",
    skills: ["Kubernetes"],
    level: "intermediate"
  },
  {
    title: "Terraform Full Course",
    provider: "YouTube / freeCodeCamp",
    category: "Cloud",
    price: 0,
    image: "",
    link: "https://www.youtube.com/watch?v=SLB_c_ayRMo",
    description: "Infrastructure as code with Terraform.",
    skills: ["Terraform"],
    level: "intermediate"
  },
  {
    title: "React JS Full Course",
    provider: "YouTube",
    category: "Frontend",
    price: 0,
    image: "",
    link: "https://www.youtube.com/watch?v=bMknfKXIFA8",
    description: "Modern React development from basics to components and hooks.",
    skills: ["React", "JavaScript"],
    level: "beginner"
  },
  {
    title: "Node.js Full Course",
    provider: "YouTube",
    category: "Backend",
    price: 0,
    image: "",
    link: "https://www.youtube.com/watch?v=Oe421EPjeBE",
    description: "Node.js fundamentals, APIs, and backend development.",
    skills: ["Node.js", "JavaScript"],
    level: "beginner"
  },
  {
    title: "MongoDB Full Course",
    provider: "YouTube",
    category: "Database",
    price: 0,
    image: "",
    link: "https://www.youtube.com/watch?v=-bt_y4Loofg",
    description: "MongoDB basics, CRUD, and document modeling.",
    skills: ["MongoDB"],
    level: "beginner"
  },
  {
    title: "CI/CD with GitHub Actions",
    provider: "YouTube",
    category: "DevOps",
    price: 0,
    image: "",
    link: "https://www.youtube.com/watch?v=R8_veQiYBjI",
    description: "Automate builds and deployments with GitHub Actions.",
    skills: ["CI/CD"],
    level: "intermediate"
  }
];

const seedData = async () => {
  try {
    await connectDB();

    console.log("Clearing old jobs and courses...");
    await Job.deleteMany({});
    await Course.deleteMany({});

    console.log("Inserting jobs...");
    await Job.insertMany(JOBS);

    console.log("Inserting courses...");
    await Course.insertMany(COURSES);

    console.log("Seed data inserted successfully.");
    process.exit(0);
  } catch (error) {
    console.error("Seed failed:", error);
    process.exit(1);
  }
};

seedData();