import { CatalogSkill, SkillCategory } from '../types';

export const SKILL_CATEGORIES: { id: SkillCategory; label: string; icon: string; color: string }[] = [
  { id: 'programming_languages', label: 'Programming Languages', icon: 'Code', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  { id: 'web_frameworks', label: 'Web Frameworks', icon: 'Globe', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  { id: 'databases', label: 'Databases', icon: 'Database', color: 'bg-purple-50 text-purple-700 border-purple-200' },
  { id: 'cloud_devops', label: 'Cloud & DevOps', icon: 'Cloud', color: 'bg-amber-50 text-amber-700 border-amber-200' },
  { id: 'data_engineering', label: 'Data Engineering', icon: 'Layers', color: 'bg-cyan-50 text-cyan-700 border-cyan-200' },
  { id: 'machine_learning_ai', label: 'Machine Learning & AI', icon: 'Cpu', color: 'bg-pink-50 text-pink-700 border-pink-200' },
  { id: 'soft_skills', label: 'Soft Skills & Leadership', icon: 'Users', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
];

export const SKILLS_CATALOG: CatalogSkill[] = [
  // Programming Languages
  { name: 'Python', category: 'programming_languages', level: 'intermediate', aliases: ['python', 'py', 'python3'], description: 'High-level programming language used for web, data science, and automation.' },
  { name: 'JavaScript', category: 'programming_languages', level: 'intermediate', aliases: ['javascript', 'js', 'es6', 'ecmascript'], description: 'Core scripting language of the web.' },
  { name: 'TypeScript', category: 'programming_languages', level: 'intermediate', aliases: ['typescript', 'ts'], description: 'Typed superset of JavaScript for scalable applications.' },
  { name: 'Java', category: 'programming_languages', level: 'intermediate', aliases: ['java', 'jdk', 'j2ee'], description: 'Object-oriented language widely used for enterprise backends.' },
  { name: 'C++', category: 'programming_languages', level: 'expert', aliases: ['c++', 'cpp'], description: 'Systems programming language for high performance application development.' },
  { name: 'C#', category: 'programming_languages', level: 'intermediate', aliases: ['c#', 'csharp', '.net'], description: 'Modern object-oriented language developed by Microsoft.' },
  { name: 'Go', category: 'programming_languages', level: 'intermediate', aliases: ['go', 'golang'], description: 'Statically typed language engineered for concurrency and microservices.' },
  { name: 'Rust', category: 'programming_languages', level: 'expert', aliases: ['rust', 'rs'], description: 'Memory-safe systems programming language.' },
  { name: 'SQL', category: 'programming_languages', level: 'beginner', aliases: ['sql', 'ansi sql'], description: 'Standard language for querying relational databases.' },
  { name: 'PHP', category: 'programming_languages', level: 'beginner', aliases: ['php', 'php8'], description: 'Server-side scripting language for web application development.' },

  // Web Frameworks
  { name: 'React', category: 'web_frameworks', level: 'intermediate', aliases: ['react', 'reactjs', 'react.js'], description: 'Popular frontend library for building component-based user interfaces.' },
  { name: 'Next.js', category: 'web_frameworks', level: 'intermediate', aliases: ['nextjs', 'next.js', 'next framework'], description: 'React framework for server rendering, static generation, and full-stack apps.' },
  { name: 'Vue.js', category: 'web_frameworks', level: 'intermediate', aliases: ['vue', 'vuejs', 'vue.js', 'nuxt'], description: 'Progressive JavaScript framework for building user interfaces.' },
  { name: 'Angular', category: 'web_frameworks', level: 'intermediate', aliases: ['angular', 'angularjs', 'ng'], description: 'Comprehensive application framework maintained by Google.' },
  { name: 'Node.js', category: 'web_frameworks', level: 'intermediate', aliases: ['node', 'nodejs', 'node.js'], description: 'JavaScript runtime built on Chrome\'s V8 engine.' },
  { name: 'Express', category: 'web_frameworks', level: 'beginner', aliases: ['express', 'expressjs', 'express.js'], description: 'Minimalist web framework for Node.js.' },
  { name: 'FastAPI', category: 'web_frameworks', level: 'intermediate', aliases: ['fastapi', 'fast-api'], description: 'High-performance Python API framework based on type hints.' },
  { name: 'Django', category: 'web_frameworks', level: 'intermediate', aliases: ['django', 'django rest framework', 'drf'], description: 'High-level Python web framework enforcing clean design.' },
  { name: 'Flask', category: 'web_frameworks', level: 'beginner', aliases: ['flask'], description: 'Lightweight WSGI Python web framework.' },
  { name: 'Spring Boot', category: 'web_frameworks', level: 'intermediate', aliases: ['spring', 'spring boot', 'springboot'], description: 'Java framework for creating stand-alone, production-grade microservices.' },
  { name: 'Tailwind CSS', category: 'web_frameworks', level: 'beginner', aliases: ['tailwind', 'tailwindcss'], description: 'Utility-first CSS framework for rapid UI development.' },

  // Databases
  { name: 'PostgreSQL', category: 'databases', level: 'intermediate', aliases: ['postgresql', 'postgres', 'pgsql'], description: 'Advanced open-source relational database system.' },
  { name: 'MySQL', category: 'databases', level: 'beginner', aliases: ['mysql', 'maria db', 'mariadb'], description: 'Widely used relational database management system.' },
  { name: 'MongoDB', category: 'databases', level: 'intermediate', aliases: ['mongodb', 'mongo'], description: 'Document-oriented NoSQL database system.' },
  { name: 'Redis', category: 'databases', level: 'intermediate', aliases: ['redis', 'key-value store'], description: 'In-memory data structure store used as database, cache, and message broker.' },
  { name: 'Elasticsearch', category: 'databases', level: 'intermediate', aliases: ['elasticsearch', 'elastic search', 'elk'], description: 'Distributed search and analytics engine.' },
  { name: 'Firebase', category: 'databases', level: 'beginner', aliases: ['firebase', 'firestore'], description: 'Google\'s app development platform providing real-time NoSQL databases.' },
  { name: 'Cassandra', category: 'databases', level: 'expert', aliases: ['cassandra', 'apache cassandra'], description: 'Distributed NoSQL database designed to handle large amounts of data across servers.' },
  { name: 'DynamoDB', category: 'databases', level: 'intermediate', aliases: ['dynamodb', 'aws dynamodb'], description: 'Amazon\'s fully managed key-value and document NoSQL database.' },

  // Cloud & DevOps
  { name: 'Docker', category: 'cloud_devops', level: 'intermediate', aliases: ['docker', 'containerization', 'containers'], description: 'Platform for developing, shipping, and running applications in containers.' },
  { name: 'Kubernetes', category: 'cloud_devops', level: 'expert', aliases: ['kubernetes', 'k8s', 'kube'], description: 'Container orchestration system for automating application deployment and scaling.' },
  { name: 'AWS', category: 'cloud_devops', level: 'intermediate', aliases: ['aws', 'amazon web services', 'ec2', 's3', 'lambda'], description: 'Comprehensive, evolving cloud computing platform provided by Amazon.' },
  { name: 'Google Cloud Platform', category: 'cloud_devops', level: 'intermediate', aliases: ['gcp', 'google cloud', 'google cloud platform', 'cloud run'], description: 'Suite of cloud computing services provided by Google.' },
  { name: 'Azure', category: 'cloud_devops', level: 'intermediate', aliases: ['azure', 'microsoft azure'], description: 'Microsoft\'s cloud computing service for application management.' },
  { name: 'Terraform', category: 'cloud_devops', level: 'expert', aliases: ['terraform', 'infrastructure as code', 'iac'], description: 'Infrastructure as code software tool for cloud provisioning.' },
  { name: 'CI/CD Pipelines', category: 'cloud_devops', level: 'intermediate', aliases: ['ci/cd', 'cicd', 'github actions', 'jenkins', 'gitlab ci'], description: 'Automated continuous integration and deployment workflow practices.' },
  { name: 'Linux', category: 'cloud_devops', level: 'beginner', aliases: ['linux', 'bash', 'shell scripting', 'ubuntu'], description: 'Open-source Unix-like operating system kernel and command line.' },
  { name: 'Nginx', category: 'cloud_devops', level: 'intermediate', aliases: ['nginx', 'reverse proxy'], description: 'High-performance HTTP web server and reverse proxy.' },

  // Data Engineering
  { name: 'Apache Spark', category: 'data_engineering', level: 'expert', aliases: ['spark', 'apache spark', 'pyspark'], description: 'Unified analytics engine for large-scale data processing.' },
  { name: 'Apache Kafka', category: 'data_engineering', level: 'expert', aliases: ['kafka', 'apache kafka', 'event streaming'], description: 'Distributed event store and stream-processing platform.' },
  { name: 'Pandas', category: 'data_engineering', level: 'intermediate', aliases: ['pandas'], description: 'Python data manipulation and analysis library.' },
  { name: 'NumPy', category: 'data_engineering', level: 'beginner', aliases: ['numpy'], description: 'Fundamental package for scientific computing with Python.' },
  { name: 'Airflow', category: 'data_engineering', level: 'intermediate', aliases: ['airflow', 'apache airflow'], description: 'Workflow management platform for data engineering pipelines.' },
  { name: 'ETL Pipelines', category: 'data_engineering', level: 'intermediate', aliases: ['etl', 'data pipelines', 'elt'], description: 'Extract, Transform, Load data pipeline engineering.' },
  { name: 'Snowflake', category: 'data_engineering', level: 'intermediate', aliases: ['snowflake', 'data warehouse'], description: 'Cloud-based data warehousing platform.' },

  // Machine Learning & AI
  { name: 'PyTorch', category: 'machine_learning_ai', level: 'expert', aliases: ['pytorch', 'torch'], description: 'Open source machine learning framework based on Torch.' },
  { name: 'TensorFlow', category: 'machine_learning_ai', level: 'expert', aliases: ['tensorflow', 'tf', 'keras'], description: 'End-to-end open source platform for machine learning.' },
  { name: 'Scikit-Learn', category: 'machine_learning_ai', level: 'intermediate', aliases: ['scikit-learn', 'sklearn'], description: 'Machine learning library for classical predictive modeling.' },
  { name: 'LangChain', category: 'machine_learning_ai', level: 'intermediate', aliases: ['langchain', 'llm agents'], description: 'Framework for developing applications powered by language models.' },
  { name: 'LLMs & RAG', category: 'machine_learning_ai', level: 'expert', aliases: ['llm', 'llms', 'rag', 'retrieval augmented generation', 'gemini', 'gpt'], description: 'Large Language Models and Retrieval-Augmented Generation architectures.' },
  { name: 'Computer Vision', category: 'machine_learning_ai', level: 'expert', aliases: ['computer vision', 'opencv', 'image processing'], description: 'Field of AI dealing with digital images and videos.' },
  { name: 'NLP', category: 'machine_learning_ai', level: 'intermediate', aliases: ['nlp', 'natural language processing', 'spacy', 'nltk', 'huggingface'], description: 'Natural Language Processing and text analytics.' },

  // Soft Skills & Leadership
  { name: 'Agile & Scrum', category: 'soft_skills', level: 'beginner', aliases: ['agile', 'scrum', 'kanban', 'jira'], description: 'Iterative approach to project management and software development.' },
  { name: 'Cross-functional Collaboration', category: 'soft_skills', level: 'intermediate', aliases: ['collaboration', 'cross-functional', 'teamwork'], description: 'Working effectively across multi-disciplinary engineering teams.' },
  { name: 'Technical Leadership', category: 'soft_skills', level: 'expert', aliases: ['leadership', 'tech lead', 'mentorship', 'architecture design'], description: 'Guiding engineering vision, mentoring peers, and driving system decisions.' },
  { name: 'Problem Solving', category: 'soft_skills', level: 'intermediate', aliases: ['problem solving', 'analytical skills', 'debugging'], description: 'Methodical approach to resolving complex technical challenges.' },
  { name: 'System Architecture', category: 'soft_skills', level: 'expert', aliases: ['system architecture', 'system design', 'distributed systems'], description: 'Designing large-scale software systems and trade-off evaluations.' },
  { name: 'Communication', category: 'soft_skills', level: 'intermediate', aliases: ['communication', 'written communication', 'presentation'], description: 'Articulating technical ideas clearly to non-technical stakeholders.' }
];
