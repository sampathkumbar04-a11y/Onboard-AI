import { LearningResource, LearningStyle } from '../types';

export const LEARNING_RESOURCES: Record<string, LearningResource[]> = {
  python: [
    { name: 'Python Official Technical Documentation', url: 'https://docs.python.org/3/tutorial/', type: 'documentation', provider: 'Python Software Foundation' },
    { name: 'Fluent Python Architecture Guide', url: 'https://www.oreilly.com/library/view/fluent-python-2nd/9781492056348/', type: 'book', provider: 'O\'Reilly' },
    { name: 'Awesome Python Curated GitHub Projects', url: 'https://github.com/vinta/awesome-python', type: 'project', provider: 'GitHub Repo' },
    { name: 'Practical Python Course & Hands-on Code Lab', url: 'https://github.com/dabeaz-course/practical-python', type: 'lab', provider: 'GitHub Repo' },
    { name: 'Python Crash Course for Beginners (Video)', url: 'https://www.youtube.com/watch?v=rfscVS0vtbw', type: 'video', provider: 'FreeCodeCamp YouTube' },
    { name: 'Python OOP & Advanced Design Patterns (Video)', url: 'https://www.youtube.com/watch?v=Ej_02ICOIgs', type: 'video', provider: 'Corey Schafer YouTube' },
  ],
  javascript: [
    { name: 'MDN JavaScript Reference & Specs', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript', type: 'documentation', provider: 'MDN Web Docs' },
    { name: 'You Don\'t Know JS Yet Technical Book', url: 'https://github.com/getify/You-Dont-Know-JS', type: 'book', provider: 'Kyle Simpson / GitHub' },
    { name: '30 Days of JavaScript Hands-On Repository', url: 'https://github.com/Asabeneh/30-Days-Of-JavaScript', type: 'project', provider: 'GitHub Repo' },
    { name: 'Clean Code JavaScript Implementation Lab', url: 'https://github.com/ryanmcdermott/clean-code-javascript', type: 'lab', provider: 'GitHub Repo' },
    { name: 'JavaScript Full Course for Beginners (Video)', url: 'https://www.youtube.com/watch?v=PkZNo7MFNFg', type: 'video', provider: 'FreeCodeCamp YouTube' },
    { name: 'JavaScript Async/Await & Promises (Video)', url: 'https://www/youtube.com/watch?v=vn3tm0quoqE', type: 'video', provider: 'Fireship YouTube' },
  ],
  typescript: [
    { name: 'TypeScript Official Handbook & Specifications', url: 'https://www.typescriptlang.org/docs/handbook/intro.html', type: 'documentation', provider: 'Microsoft Docs' },
    { name: 'Total TypeScript Essentials Guide', url: 'https://www.totaltypescript.com/books/total-typescript-essentials', type: 'book', provider: 'Matt Pocock' },
    { name: 'TypeScript Type Challenges GitHub Repository', url: 'https://github.com/type-challenges/type-challenges', type: 'lab', provider: 'GitHub Repo' },
    { name: 'Clean Code TypeScript Hands-On Projects', url: 'https://github.com/labs42io/clean-code-typescript', type: 'project', provider: 'GitHub Repo' },
    { name: 'TypeScript Full Course for Beginners (Video)', url: 'https://www.youtube.com/watch?v=BwuLxPH8IDs', type: 'video', provider: 'FreeCodeCamp YouTube' },
    { name: 'TypeScript in 100 Seconds (Video)', url: 'https://www.youtube.com/watch?v=zQnBQ4tB3ZA', type: 'video', provider: 'Fireship YouTube' },
  ],
  react: [
    { name: 'React Official Interactive Documentation', url: 'https://react.dev/learn', type: 'documentation', provider: 'Meta Docs' },
    { name: 'Bulletproof React Architecture Guide', url: 'https://github.com/alan2207/bulletproof-react/blob/master/docs/README.md', type: 'article', provider: 'GitHub Article' },
    { name: 'Bulletproof React Starter Repository', url: 'https://github.com/alan2207/bulletproof-react', type: 'project', provider: 'GitHub Repo' },
    { name: 'React Custom Hooks & Utilities Lab', url: 'https://github.com/streamich/react-use', type: 'lab', provider: 'GitHub Repo' },
    { name: 'React Full Course for Beginners (Video)', url: 'https://www.youtube.com/watch?v=bMknfKXIFA8', type: 'video', provider: 'FreeCodeCamp YouTube' },
    { name: 'React State Management Masterclass (Video)', url: 'https://www.youtube.com/watch?v=w7ejDZ8SWv8', type: 'video', provider: 'Fireship YouTube' },
  ],
  next_js: [
    { name: 'Next.js Official Documentation & App Router Guide', url: 'https://nextjs.org/docs', type: 'documentation', provider: 'Vercel Docs' },
    { name: 'Next.js Official Starter Examples Repository', url: 'https://github.com/vercel/next.js/tree/canary/examples', type: 'project', provider: 'GitHub Repo' },
    { name: 'Next.js Production SaaS Boilerplate Lab', url: 'https://github.com/shadcn-ui/taxonomy', type: 'lab', provider: 'GitHub Repo' },
    { name: 'Next.js App Router Full Course (Video)', url: 'https://www.youtube.com/watch?v=WMjhG1cld0M', type: 'video', provider: 'FreeCodeCamp YouTube' },
  ],
  node_js: [
    { name: 'Node.js Official API Documentation', url: 'https://nodejs.org/en/docs/', type: 'documentation', provider: 'Node.js Foundation' },
    { name: 'Node.js Best Practices Architecture Book', url: 'https://github.com/goldbergyoni/nodebestpractices', type: 'book', provider: 'GitHub Guide' },
    { name: 'Node.js Microservices Starter Project', url: 'https://github.com/hagopj13/node-express-boilerplate', type: 'project', provider: 'GitHub Repo' },
    { name: 'Node.js Event Loop & Native Modules Lab', url: 'https://github.com/nodejs/node', type: 'lab', provider: 'GitHub Repo' },
    { name: 'Node.js & Express Full Course (Video)', url: 'https://www.youtube.com/watch?v=Oe421EPjeBE', type: 'video', provider: 'FreeCodeCamp YouTube' },
  ],
  docker: [
    { name: 'Docker Engine & Compose Official Docs', url: 'https://docs.docker.com/get-started/', type: 'documentation', provider: 'Docker Docs' },
    { name: 'Docker Curriculum & Hands-On Guide', url: 'https://docker-curriculum.com/', type: 'article', provider: 'Web Guide' },
    { name: 'Docker Official Community Labs Repository', url: 'https://github.com/docker/labs', type: 'lab', provider: 'GitHub Repo' },
    { name: 'Awesome Docker Compose Templates Repo', url: 'https://github.com/awesome-foss/awesome-sysadmin', type: 'project', provider: 'GitHub Repo' },
    { name: 'Docker Crash Course for Beginners (Video)', url: 'https://www.youtube.com/watch?v=pTFZFxd4hOI', type: 'video', provider: 'FreeCodeCamp YouTube' },
    { name: 'Docker in 100 Seconds (Video)', url: 'https://www.youtube.com/watch?v=gAkwW2tuIqE', type: 'video', provider: 'Fireship YouTube' },
  ],
  kubernetes: [
    { name: 'Kubernetes Official Concepts & Architecture', url: 'https://kubernetes.io/docs/concepts/', type: 'documentation', provider: 'CNCF Docs' },
    { name: 'Kubernetes Production Best Practices Book', url: 'https://k8s-docs.netlify.app/', type: 'book', provider: 'Open Book' },
    { name: 'Kubernetes Source Code & Cluster Deployment Lab', url: 'https://github.com/kubernetes/kubernetes', type: 'lab', provider: 'GitHub Repo' },
    { name: 'Awesome Kubernetes Helm Charts & Projects', url: 'https://github.com/ramitsurana/awesome-kubernetes', type: 'project', provider: 'GitHub Repo' },
    { name: 'Kubernetes Full Course for Beginners (Video)', url: 'https://www.youtube.com/watch?v=X48VuDVv0do', type: 'video', provider: 'TechWorld with Nana YouTube' },
  ],
  aws: [
    { name: 'AWS Official Cloud Architecture Center', url: 'https://aws.amazon.com/architecture/', type: 'documentation', provider: 'AWS Docs' },
    { name: 'AWS Well-Architected Framework Whitepapers', url: 'https://aws.amazon.com/architecture/well-architected/', type: 'article', provider: 'AWS Whitepapers' },
    { name: 'AWS Hands-on Code Samples & Reference Repos', url: 'https://github.com/aws-samples', type: 'project', provider: 'GitHub Repo' },
    { name: 'AWS Serverless Application Model (SAM) Labs', url: 'https://github.com/aws/aws-sam-cli', type: 'lab', provider: 'GitHub Repo' },
    { name: 'AWS Certified Solutions Architect Video Course', url: 'https://www.youtube.com/watch?v=Ia-UEYYR44s', type: 'video', provider: 'FreeCodeCamp YouTube' },
  ],
  postgresql: [
    { name: 'PostgreSQL Official Documentation', url: 'https://www.postgresql.org/docs/', type: 'documentation', provider: 'PostgreSQL Global Group' },
    { name: 'Use The Index, Luke! SQL Performance Book', url: 'https://use-the-index-luke.com/', type: 'book', provider: 'Markus Winand' },
    { name: 'PostgreSQL Core Source Code & Extensions Lab', url: 'https://github.com/postgres/postgres', type: 'lab', provider: 'GitHub Repo' },
    { name: 'Awesome PostgreSQL Curated Tools & Projects', url: 'https://github.com/dhamaniasad/awesome-postgres', type: 'project', provider: 'GitHub Repo' },
    { name: 'PostgreSQL Full Database Course (Video)', url: 'https://www/youtube.com/watch?v=qw--VYLpxG4', type: 'video', provider: 'FreeCodeCamp YouTube' },
  ],
  fastapi: [
    { name: 'FastAPI Official Interactive Tutorial', url: 'https://fastapi.tiangolo.com/tutorial/', type: 'documentation', provider: 'Sebastián Ramírez' },
    { name: 'Full-Stack FastAPI & PostgreSQL Template Repo', url: 'https://github.com/tiangolo/full-stack-fastapi-template', type: 'project', provider: 'GitHub Repo' },
    { name: 'FastAPI Microservices Async Lab Repository', url: 'https://github.com/zhanymkanov/fastapi-best-practices', type: 'lab', provider: 'GitHub Repo' },
    { name: 'FastAPI Full Course for Beginners (Video)', url: 'https://www.youtube.com/watch?v=tLKKmouUams', type: 'video', provider: 'FreeCodeCamp YouTube' },
  ],
  pytorch: [
    { name: 'PyTorch Official Documentation & Tutorials', url: 'https://pytorch.org/tutorials/', type: 'documentation', provider: 'PyTorch Docs' },
    { name: 'Deep Learning with PyTorch Book', url: 'https://pytorch.org/deep-learning-with-pytorch', type: 'book', provider: 'PyTorch Org' },
    { name: 'PyTorch Official Reference Models & Examples', url: 'https://github.com/pytorch/examples', type: 'project', provider: 'GitHub Repo' },
    { name: 'PyTorch Vision Model Training Lab Repository', url: 'https://github.com/pytorch/vision', type: 'lab', provider: 'GitHub Repo' },
    { name: 'PyTorch Full Course for Beginners (Video)', url: 'https://www.youtube.com/watch?v=V_xro1bcAuA', type: 'video', provider: 'FreeCodeCamp YouTube' },
  ],
  'llms_&_rag': [
    { name: 'LangChain & Vector DB RAG Architecture Docs', url: 'https://python.langchain.com/docs/get_started/introduction', type: 'documentation', provider: 'LangChain Docs' },
    { name: 'LangChain Production Repository & RAG Templates', url: 'https://github.com/langchain-ai/langchain', type: 'project', provider: 'GitHub Repo' },
    { name: 'RAG Systems Implementation & Vector Search Lab', url: 'https://github.com/run-llama/llama_index', type: 'lab', provider: 'GitHub Repo' },
    { name: 'Build RAG Applications with LLMs (Video)', url: 'https://www.youtube.com/watch?v=tcqEUSNCn8I', type: 'video', provider: 'DeepLearning.AI YouTube' },
  ],
  system_architecture: [
    { name: 'Designing Data-Intensive Applications Book', url: 'https://dataintensive.net/', type: 'book', provider: 'Martin Kleppmann' },
    { name: 'System Design Primer GitHub Repository', url: 'https://github.com/donnemartin/system-design-primer', type: 'project', provider: 'GitHub Repo' },
    { name: 'Distributed Systems & Microservices Patterns Lab', url: 'https://github.com/binhnguyennus/awesome-scalability', type: 'lab', provider: 'GitHub Repo' },
    { name: 'System Design Interview Crash Course (Video)', url: 'https://www.youtube.com/watch?v=xpDnVSmNfx0', type: 'video', provider: 'ByteByteGo YouTube' },
  ],
  go: [
    { name: 'Go Official Documentation & Tour', url: 'https://go.dev/doc/', type: 'documentation', provider: 'Google Go Team' },
    { name: 'Uber Go Style Guide & Architecture Article', url: 'https://github.com/uber-go/guide', type: 'article', provider: 'GitHub Article' },
    { name: 'Awesome Go GitHub Repository & Projects', url: 'https://github.com/avelino/awesome-go', type: 'project', provider: 'GitHub Repo' },
    { name: 'Go Microservices & Concurrency Lab Repository', url: 'https://github.com/golang/go', type: 'lab', provider: 'GitHub Repo' },
    { name: 'Go Programming Full Course (Video)', url: 'https://www.youtube.com/watch?v=YS4e4q9oBaU', type: 'video', provider: 'FreeCodeCamp YouTube' },
  ],
  rust: [
    { name: 'The Rust Programming Language Book', url: 'https://doc.rust-lang.org/book/', type: 'book', provider: 'Rust Core Team' },
    { name: 'Rustlings Exercises & Hands-On Repository', url: 'https://github.com/rust-lang/rustlings', type: 'lab', provider: 'GitHub Repo' },
    { name: 'Awesome Rust Curated Libraries & Projects Repo', url: 'https://github.com/rust-unofficial/awesome-rust', type: 'project', provider: 'GitHub Repo' },
    { name: 'Rust Crash Course for Beginners (Video)', url: 'https://www.youtube.com/watch?v=zF34dRivLOw', type: 'video', provider: 'FreeCodeCamp YouTube' },
  ]
};

export function getResourcesForSkill(skillName: string, style: LearningStyle): LearningResource[] {
  const normalizedKey = skillName.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
  let baseResources = LEARNING_RESOURCES[normalizedKey];

  if (!baseResources || baseResources.length === 0) {
    baseResources = [
      {
        name: `${skillName} Official Technical Documentation`,
        url: `https://www.google.com/search?q=${encodeURIComponent(skillName + ' official documentation')}`,
        type: 'documentation',
        provider: 'Official Docs'
      },
      {
        name: `Awesome ${skillName} GitHub Repository & Projects`,
        url: `https://github.com/topics/${normalizedKey}`,
        type: 'project',
        provider: 'GitHub Repo'
      },
      {
        name: `${skillName} Hands-On Code Starter & Lab Repo`,
        url: `https://github.com/search?q=${encodeURIComponent(skillName + ' project repo')}`,
        type: 'lab',
        provider: 'GitHub Lab'
      },
      {
        name: `${skillName} Full Video Course & Tutorial`,
        url: `https://www.youtube.com/results?search_query=${encodeURIComponent(skillName + ' tutorial full course')}`,
        type: 'video',
        provider: 'YouTube Video'
      }
    ];
  }

  // Strict Filtering logic based on user's selected style
  if (style === 'visual') {
    // ONLY show videos!
    const videos = baseResources.filter(r => r.type === 'video');
    if (videos.length > 0) return videos;
    return [
      {
        name: `${skillName} Full Video Masterclass & Concepts`,
        url: `https://www.youtube.com/results?search_query=${encodeURIComponent(skillName + ' complete video course')}`,
        type: 'video',
        provider: 'YouTube Video'
      },
      {
        name: `${skillName} Visual Explanation in 100 Seconds`,
        url: `https://www.youtube.com/results?search_query=${encodeURIComponent(skillName + ' in 100 seconds')}`,
        type: 'video',
        provider: 'Fireship Video'
      }
    ];
  }

  if (style === 'reading') {
    // ONLY show reading materials (documentation, book, article)
    const readingDocs = baseResources.filter(r => r.type === 'documentation' || r.type === 'article' || r.type === 'book');
    if (readingDocs.length > 0) return readingDocs;
    return [
      {
        name: `${skillName} Official Technical Documentation`,
        url: `https://www.google.com/search?q=${encodeURIComponent(skillName + ' official docs specification')}`,
        type: 'documentation',
        provider: 'Official Docs'
      },
      {
        name: `Deep Dive Architecture Book: ${skillName}`,
        url: `https://www.google.com/search?q=${encodeURIComponent(skillName + ' architecture book pdf')}`,
        type: 'book',
        provider: 'Technical Reference'
      }
    ];
  }

  if (style === 'hands-on') {
    // ONLY show hands-on projects & labs with GitHub Repositories!
    const handsOnProjects = baseResources.filter(r => r.type === 'project' || r.type === 'lab');
    if (handsOnProjects.length > 0) return handsOnProjects;
    return [
      {
        name: `Awesome ${skillName} GitHub Repository & Sample Code`,
        url: `https://github.com/topics/${normalizedKey}`,
        type: 'project',
        provider: 'GitHub Repo'
      },
      {
        name: `${skillName} Hands-On Starter Project & Lab Repo`,
        url: `https://github.com/search?q=${encodeURIComponent(skillName + ' starter repo template')}`,
        type: 'lab',
        provider: 'GitHub Repo'
      }
    ];
  }

  // 'balanced' style -> Return ALL resource types (video, documentation, book, project, lab)
  return baseResources;
}

