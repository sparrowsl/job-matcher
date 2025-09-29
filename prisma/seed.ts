import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Clear existing data
  console.log('🧹 Clearing existing data...');
  await prisma.chatMessage.deleteMany();
  await prisma.chatConversation.deleteMany();
  await prisma.savedJob.deleteMany();
  await prisma.jobMatch.deleteMany();
  await prisma.certification.deleteMany();
  await prisma.project.deleteMany();
  await prisma.experience.deleteMany();
  await prisma.education.deleteMany();
  await prisma.cV.deleteMany();
  await prisma.job.deleteMany();
  await prisma.user.deleteMany();

  // Create sample users with hashed passwords
  console.log('👤 Creating sample users...');

  // Password: "password123" for all demo users
  const hashedPassword = await bcrypt.hash('password123', 10);

  const user1 = await prisma.user.create({
    data: {
      email: 'john.doe@example.com',
      name: 'John Doe',
      password: hashedPassword,
    },
  });

  const user2 = await prisma.user.create({
    data: {
      email: 'jane.smith@example.com',
      name: 'Jane Smith',
      password: hashedPassword,
    },
  });

  console.log(`✅ Created ${2} users (password: password123)`);

  // Create sample jobs
  console.log('💼 Creating sample jobs...');

  const jobsData = [
    {
      title: 'Senior Full Stack Developer',
      company: 'TechCorp Solutions',
      location: 'San Francisco, CA',
      description: 'We are seeking an experienced Full Stack Developer to join our dynamic team. You will be responsible for developing and maintaining web applications using modern technologies.',
      requirements: JSON.stringify([
        '5+ years of experience in full stack development',
        'Proficiency in React, Node.js, and TypeScript',
        'Experience with PostgreSQL or MongoDB',
        'Strong understanding of RESTful APIs',
        'Experience with cloud platforms (AWS/Azure/GCP)',
      ]),
      responsibilities: JSON.stringify([
        'Design and develop scalable web applications',
        'Collaborate with cross-functional teams',
        'Write clean, maintainable code',
        'Participate in code reviews',
      ]),
      skills: JSON.stringify(['React', 'Node.js', 'TypeScript', 'PostgreSQL', 'AWS', 'Docker']),
      keywords: JSON.stringify(['full stack', 'web development', 'cloud', 'microservices']),
      type: 'full-time',
      remote: true,
      salaryMin: 120000,
      salaryMax: 180000,
      salaryCurrency: 'USD',
      applicationUrl: 'https://techcorp.com/careers/senior-fullstack',
      source: 'manual',
    },
    {
      title: 'Frontend Developer (React)',
      company: 'StartupXYZ',
      location: 'New York, NY',
      description: 'Join our fast-growing startup as a Frontend Developer. Build beautiful, responsive user interfaces that delight our customers.',
      requirements: JSON.stringify([
        '3+ years of React experience',
        'Strong CSS and HTML skills',
        'Experience with state management (Redux/Zustand)',
        'Understanding of responsive design',
        'Git proficiency',
      ]),
      responsibilities: JSON.stringify([
        'Build responsive React components',
        'Optimize application performance',
        'Collaborate with designers',
        'Maintain component library',
      ]),
      skills: JSON.stringify(['React', 'JavaScript', 'CSS', 'HTML', 'Redux', 'Tailwind CSS']),
      keywords: JSON.stringify(['frontend', 'UI/UX', 'responsive', 'single page application']),
      type: 'full-time',
      remote: false,
      salaryMin: 90000,
      salaryMax: 130000,
      salaryCurrency: 'USD',
      applicationUrl: 'https://startupxyz.com/jobs/frontend-dev',
      source: 'manual',
    },
    {
      title: 'Backend Engineer - Node.js',
      company: 'DataFlow Inc',
      location: 'Austin, TX',
      description: 'We need a Backend Engineer to help build and scale our API infrastructure. Experience with Node.js and microservices architecture required.',
      requirements: JSON.stringify([
        '4+ years Node.js development',
        'Experience with microservices architecture',
        'Strong SQL and NoSQL database skills',
        'Understanding of message queues (RabbitMQ/Kafka)',
        'API design best practices',
      ]),
      responsibilities: JSON.stringify([
        'Design and implement RESTful APIs',
        'Optimize database queries',
        'Ensure system reliability and scalability',
        'Monitor and troubleshoot production issues',
      ]),
      skills: JSON.stringify(['Node.js', 'Express', 'MongoDB', 'PostgreSQL', 'Redis', 'Kafka']),
      keywords: JSON.stringify(['backend', 'API', 'microservices', 'scalability']),
      type: 'full-time',
      remote: true,
      salaryMin: 110000,
      salaryMax: 160000,
      salaryCurrency: 'USD',
      applicationUrl: 'https://dataflow.com/careers/backend-engineer',
      source: 'manual',
    },
    {
      title: 'DevOps Engineer',
      company: 'CloudNative Systems',
      location: 'Seattle, WA',
      description: 'Looking for a DevOps Engineer to manage our cloud infrastructure and CI/CD pipelines. Kubernetes and AWS experience essential.',
      requirements: JSON.stringify([
        '3+ years DevOps experience',
        'Strong AWS/Azure/GCP knowledge',
        'Kubernetes orchestration experience',
        'Infrastructure as Code (Terraform/CloudFormation)',
        'CI/CD pipeline management',
      ]),
      responsibilities: JSON.stringify([
        'Manage cloud infrastructure',
        'Implement and maintain CI/CD pipelines',
        'Automate deployment processes',
        'Monitor system performance',
      ]),
      skills: JSON.stringify(['AWS', 'Kubernetes', 'Docker', 'Terraform', 'Jenkins', 'Python']),
      keywords: JSON.stringify(['devops', 'cloud', 'automation', 'infrastructure']),
      type: 'full-time',
      remote: true,
      salaryMin: 115000,
      salaryMax: 165000,
      salaryCurrency: 'USD',
      applicationUrl: 'https://cloudnative.io/jobs/devops',
      source: 'manual',
    },
    {
      title: 'Junior Software Developer',
      company: 'LearnTech Education',
      location: 'Boston, MA',
      description: 'Perfect opportunity for recent graduates or career changers. We provide mentorship and training while you contribute to real projects.',
      requirements: JSON.stringify([
        '0-2 years professional experience',
        'Computer Science degree or bootcamp certificate',
        'Knowledge of JavaScript or Python',
        'Passion for learning and technology',
        'Strong problem-solving skills',
      ]),
      responsibilities: JSON.stringify([
        'Write and test code under supervision',
        'Learn from senior developers',
        'Fix bugs and implement small features',
        'Participate in team meetings and code reviews',
      ]),
      skills: JSON.stringify(['JavaScript', 'Python', 'Git', 'HTML', 'CSS']),
      keywords: JSON.stringify(['junior', 'entry level', 'training', 'mentorship']),
      type: 'full-time',
      remote: false,
      salaryMin: 60000,
      salaryMax: 80000,
      salaryCurrency: 'USD',
      applicationUrl: 'https://learntech.edu/careers/junior-dev',
      source: 'manual',
    },
    {
      title: 'Data Scientist',
      company: 'AI Innovations Lab',
      location: 'San Jose, CA',
      description: 'Join our AI team to build machine learning models that solve real-world problems. Experience with Python and ML frameworks required.',
      requirements: JSON.stringify([
        'MS/PhD in Computer Science, Statistics, or related field',
        '3+ years in data science or ML',
        'Strong Python and ML library experience',
        'Experience with deep learning frameworks',
        'SQL and data manipulation skills',
      ]),
      responsibilities: JSON.stringify([
        'Develop machine learning models',
        'Analyze large datasets',
        'Deploy models to production',
        'Collaborate with engineering teams',
      ]),
      skills: JSON.stringify(['Python', 'TensorFlow', 'PyTorch', 'SQL', 'Pandas', 'Scikit-learn']),
      keywords: JSON.stringify(['machine learning', 'AI', 'data science', 'deep learning']),
      type: 'full-time',
      remote: true,
      salaryMin: 130000,
      salaryMax: 190000,
      salaryCurrency: 'USD',
      applicationUrl: 'https://ailab.com/jobs/data-scientist',
      source: 'manual',
    },
    {
      title: 'Mobile Developer (React Native)',
      company: 'MobileFirst Apps',
      location: 'Los Angeles, CA',
      description: 'Build cross-platform mobile applications using React Native. Experience with both iOS and Android platforms preferred.',
      requirements: JSON.stringify([
        '3+ years mobile development experience',
        'Strong React Native skills',
        'iOS and Android development knowledge',
        'Experience with mobile app deployment',
        'Understanding of mobile UI/UX patterns',
      ]),
      responsibilities: JSON.stringify([
        'Develop mobile applications',
        'Optimize app performance',
        'Integrate with backend APIs',
        'Submit apps to app stores',
      ]),
      skills: JSON.stringify(['React Native', 'JavaScript', 'iOS', 'Android', 'Redux', 'Firebase']),
      keywords: JSON.stringify(['mobile', 'cross-platform', 'iOS', 'Android']),
      type: 'full-time',
      remote: false,
      salaryMin: 100000,
      salaryMax: 145000,
      salaryCurrency: 'USD',
      applicationUrl: 'https://mobilefirst.com/careers/react-native',
      source: 'manual',
    },
    {
      title: 'QA Automation Engineer',
      company: 'QualityFirst Software',
      location: 'Denver, CO',
      description: 'Ensure software quality through automated testing. Experience with testing frameworks and CI/CD integration required.',
      requirements: JSON.stringify([
        '3+ years in QA automation',
        'Experience with Selenium, Cypress, or similar',
        'Programming skills in JavaScript or Python',
        'Knowledge of CI/CD tools',
        'Understanding of software testing best practices',
      ]),
      responsibilities: JSON.stringify([
        'Develop automated test suites',
        'Integrate tests into CI/CD pipelines',
        'Identify and report bugs',
        'Improve test coverage',
      ]),
      skills: JSON.stringify(['Selenium', 'Cypress', 'JavaScript', 'Python', 'Jest', 'Jenkins']),
      keywords: JSON.stringify(['QA', 'automation', 'testing', 'quality assurance']),
      type: 'full-time',
      remote: true,
      salaryMin: 85000,
      salaryMax: 120000,
      salaryCurrency: 'USD',
      applicationUrl: 'https://qualityfirst.com/jobs/qa-automation',
      source: 'manual',
    },
    {
      title: 'UI/UX Designer',
      company: 'DesignHub Creative',
      location: 'Portland, OR',
      description: 'Create beautiful, user-friendly designs for web and mobile applications. Strong portfolio required.',
      requirements: JSON.stringify([
        '4+ years UI/UX design experience',
        'Proficiency in Figma, Sketch, or Adobe XD',
        'Strong portfolio demonstrating design process',
        'Understanding of design systems',
        'User research and testing experience',
      ]),
      responsibilities: JSON.stringify([
        'Design user interfaces',
        'Create wireframes and prototypes',
        'Conduct user research',
        'Collaborate with developers',
      ]),
      skills: JSON.stringify(['Figma', 'Sketch', 'Adobe XD', 'Prototyping', 'User Research', 'Design Systems']),
      keywords: JSON.stringify(['UI', 'UX', 'design', 'user experience', 'visual design']),
      type: 'full-time',
      remote: true,
      salaryMin: 95000,
      salaryMax: 135000,
      salaryCurrency: 'USD',
      applicationUrl: 'https://designhub.com/careers/uiux-designer',
      source: 'manual',
    },
    {
      title: 'Product Manager - Tech',
      company: 'InnovateCo',
      location: 'Chicago, IL',
      description: 'Lead product development from ideation to launch. Technical background and strong communication skills essential.',
      requirements: JSON.stringify([
        '5+ years product management experience',
        'Technical background (CS degree or equivalent)',
        'Experience with agile methodologies',
        'Strong analytical and communication skills',
        'Track record of successful product launches',
      ]),
      responsibilities: JSON.stringify([
        'Define product roadmap and strategy',
        'Gather and prioritize requirements',
        'Work with engineering and design teams',
        'Analyze product metrics',
      ]),
      skills: JSON.stringify(['Product Management', 'Agile', 'JIRA', 'Analytics', 'SQL', 'User Stories']),
      keywords: JSON.stringify(['product management', 'strategy', 'roadmap', 'agile']),
      type: 'full-time',
      remote: false,
      salaryMin: 125000,
      salaryMax: 175000,
      salaryCurrency: 'USD',
      applicationUrl: 'https://innovateco.com/jobs/product-manager',
      source: 'manual',
    },
    {
      title: 'Cybersecurity Analyst',
      company: 'SecureNet Solutions',
      location: 'Washington, DC',
      description: 'Protect our systems and data from cyber threats. Security certifications and hands-on experience required.',
      requirements: JSON.stringify([
        '3+ years cybersecurity experience',
        'Security certifications (CISSP, CEH, or similar)',
        'Network security knowledge',
        'Incident response experience',
        'Understanding of compliance frameworks',
      ]),
      responsibilities: JSON.stringify([
        'Monitor security systems',
        'Respond to security incidents',
        'Conduct security assessments',
        'Implement security best practices',
      ]),
      skills: JSON.stringify(['Security', 'Network Security', 'Penetration Testing', 'SIEM', 'Firewall', 'Compliance']),
      keywords: JSON.stringify(['cybersecurity', 'security', 'threat detection', 'incident response']),
      type: 'full-time',
      remote: false,
      salaryMin: 105000,
      salaryMax: 150000,
      salaryCurrency: 'USD',
      applicationUrl: 'https://securenet.com/careers/security-analyst',
      source: 'manual',
    },
    {
      title: 'Software Engineering Intern',
      company: 'BigTech Corp',
      location: 'Mountain View, CA',
      description: 'Summer internship opportunity for students passionate about software development. Work on real projects with mentorship.',
      requirements: JSON.stringify([
        'Currently pursuing CS degree',
        'Strong programming fundamentals',
        'Knowledge of at least one programming language',
        'Problem-solving skills',
        'Available for 12-week summer internship',
      ]),
      responsibilities: JSON.stringify([
        'Work on assigned projects',
        'Write code and tests',
        'Learn from senior engineers',
        'Present final project to team',
      ]),
      skills: JSON.stringify(['Python', 'Java', 'C++', 'JavaScript', 'Git', 'Data Structures']),
      keywords: JSON.stringify(['internship', 'student', 'entry level', 'summer']),
      type: 'internship',
      remote: false,
      salaryMin: 6000,
      salaryMax: 8000,
      salaryCurrency: 'USD',
      applicationUrl: 'https://bigtech.com/internships/software',
      source: 'manual',
    },
    {
      title: 'Machine Learning Engineer',
      company: 'DeepAI Technologies',
      location: 'Palo Alto, CA',
      description: 'Design and implement ML systems at scale. Experience with production ML systems and MLOps required.',
      requirements: JSON.stringify([
        '4+ years ML engineering experience',
        'Strong Python and ML framework skills',
        'Experience deploying ML models to production',
        'Knowledge of MLOps best practices',
        'Distributed systems experience',
      ]),
      responsibilities: JSON.stringify([
        'Build and deploy ML models',
        'Optimize model performance',
        'Design ML infrastructure',
        'Collaborate with data scientists',
      ]),
      skills: JSON.stringify(['Python', 'TensorFlow', 'PyTorch', 'Kubernetes', 'MLOps', 'AWS']),
      keywords: JSON.stringify(['machine learning', 'ML engineering', 'MLOps', 'production ML']),
      type: 'full-time',
      remote: true,
      salaryMin: 140000,
      salaryMax: 200000,
      salaryCurrency: 'USD',
      applicationUrl: 'https://deepai.tech/jobs/ml-engineer',
      source: 'manual',
    },
    {
      title: 'Cloud Architect',
      company: 'CloudScale Systems',
      location: 'Dallas, TX',
      description: 'Design cloud infrastructure solutions for enterprise clients. Multi-cloud experience strongly preferred.',
      requirements: JSON.stringify([
        '7+ years cloud infrastructure experience',
        'AWS/Azure/GCP certifications',
        'Enterprise architecture experience',
        'Strong security knowledge',
        'Experience with hybrid cloud solutions',
      ]),
      responsibilities: JSON.stringify([
        'Design cloud architecture',
        'Lead cloud migration projects',
        'Ensure security and compliance',
        'Mentor engineering teams',
      ]),
      skills: JSON.stringify(['AWS', 'Azure', 'GCP', 'Terraform', 'Architecture', 'Security']),
      keywords: JSON.stringify(['cloud', 'architecture', 'enterprise', 'migration']),
      type: 'full-time',
      remote: true,
      salaryMin: 150000,
      salaryMax: 210000,
      salaryCurrency: 'USD',
      applicationUrl: 'https://cloudscale.com/careers/architect',
      source: 'manual',
    },
    {
      title: 'Blockchain Developer',
      company: 'CryptoNext Labs',
      location: 'Miami, FL',
      description: 'Build decentralized applications and smart contracts. Experience with Ethereum and Solidity required.',
      requirements: JSON.stringify([
        '3+ years blockchain development',
        'Strong Solidity programming skills',
        'Understanding of blockchain fundamentals',
        'Experience with Web3.js or Ethers.js',
        'Smart contract security knowledge',
      ]),
      responsibilities: JSON.stringify([
        'Develop smart contracts',
        'Build dApps',
        'Audit contract security',
        'Optimize gas usage',
      ]),
      skills: JSON.stringify(['Solidity', 'Ethereum', 'Web3.js', 'JavaScript', 'Smart Contracts', 'Blockchain']),
      keywords: JSON.stringify(['blockchain', 'cryptocurrency', 'smart contracts', 'Web3']),
      type: 'full-time',
      remote: true,
      salaryMin: 120000,
      salaryMax: 180000,
      salaryCurrency: 'USD',
      applicationUrl: 'https://cryptonext.io/jobs/blockchain-dev',
      source: 'manual',
    },
    {
      title: 'Technical Writer',
      company: 'DocuTech Solutions',
      location: 'Remote',
      description: 'Create clear, comprehensive technical documentation for developers. Strong writing and technical skills required.',
      requirements: JSON.stringify([
        '3+ years technical writing experience',
        'Software development background',
        'Excellent writing and communication skills',
        'Experience with documentation tools',
        'API documentation experience',
      ]),
      responsibilities: JSON.stringify([
        'Write technical documentation',
        'Create API references',
        'Develop tutorials and guides',
        'Collaborate with engineering teams',
      ]),
      skills: JSON.stringify(['Technical Writing', 'Documentation', 'Markdown', 'Git', 'API Documentation', 'Developer Tools']),
      keywords: JSON.stringify(['technical writing', 'documentation', 'API', 'developer docs']),
      type: 'full-time',
      remote: true,
      salaryMin: 80000,
      salaryMax: 115000,
      salaryCurrency: 'USD',
      applicationUrl: 'https://docutech.com/careers/technical-writer',
      source: 'manual',
    },
  ];

  const jobs = [];
  for (const jobData of jobsData) {
    const job = await prisma.job.create({ data: jobData });
    jobs.push(job);
  }

  console.log(`✅ Created ${jobs.length} jobs`);

  // Create a sample CV
  console.log('📄 Creating sample CV...');
  const sampleCV = await prisma.cV.create({
    data: {
      userId: user1.id,
      fullName: 'John Doe',
      email: 'john.doe@example.com',
      phone: '+1-555-0123',
      location: 'San Francisco, CA',
      title: 'Full Stack Developer',
      yearsExperience: 5,
      summary: 'Experienced full stack developer with a passion for building scalable web applications. Proficient in React, Node.js, and cloud technologies.',
      skills: JSON.stringify(['React', 'Node.js', 'TypeScript', 'PostgreSQL', 'AWS', 'Docker', 'Git']),
      keywords: JSON.stringify(['full stack', 'web development', 'cloud', 'agile']),
      fileName: 'john-doe-cv.pdf',
      extractedText: 'John Doe - Full Stack Developer...',
      isComplete: true,
      education: {
        create: [
          {
            institution: 'Stanford University',
            degree: 'Bachelor of Science',
            field: 'Computer Science',
            startDate: new Date('2014-09-01'),
            endDate: new Date('2018-06-01'),
            description: 'GPA: 3.8/4.0',
          },
        ],
      },
      experience: {
        create: [
          {
            company: 'TechStartup Inc',
            position: 'Senior Full Stack Developer',
            location: 'San Francisco, CA',
            startDate: new Date('2020-01-01'),
            current: true,
            description: 'Leading development of cloud-based SaaS platform',
            achievements: JSON.stringify([
              'Architected microservices infrastructure serving 1M+ users',
              'Reduced API response time by 60%',
              'Mentored team of 5 junior developers',
            ]),
          },
          {
            company: 'WebDev Solutions',
            position: 'Full Stack Developer',
            location: 'San Francisco, CA',
            startDate: new Date('2018-07-01'),
            endDate: new Date('2019-12-31'),
            current: false,
            description: 'Developed web applications for various clients',
            achievements: JSON.stringify([
              'Built 10+ client websites using React and Node.js',
              'Implemented CI/CD pipelines',
            ]),
          },
        ],
      },
      projects: {
        create: [
          {
            name: 'Task Management App',
            description: 'Full-stack task management application with real-time collaboration',
            technologies: JSON.stringify(['React', 'Node.js', 'Socket.io', 'MongoDB']),
            url: 'https://github.com/johndoe/task-app',
          },
        ],
      },
      certifications: {
        create: [
          {
            name: 'AWS Certified Solutions Architect',
            issuer: 'Amazon Web Services',
            issueDate: new Date('2022-03-15'),
            credentialId: 'AWS-12345',
          },
        ],
      },
    },
  });

  console.log('✅ Created sample CV');

  // Create some job matches
  console.log('🎯 Creating job matches...');
  const matchCount = Math.min(5, jobs.length);
  for (let i = 0; i < matchCount; i++) {
    await prisma.jobMatch.create({
      data: {
        cvId: sampleCV.id,
        jobId: jobs[i].id,
        overallScore: 85 - i * 5,
        skillsScore: 90 - i * 5,
        experienceScore: 85 - i * 5,
        educationScore: 80 - i * 5,
        keywordsScore: 85 - i * 5,
        matchingSkills: JSON.stringify(['React', 'Node.js', 'TypeScript']),
        missingSkills: JSON.stringify(['Kubernetes']),
        explanation: 'Strong match based on skills and experience',
      },
    });
  }

  console.log(`✅ Created ${matchCount} job matches`);

  console.log('✨ Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
