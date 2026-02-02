// Comprehensive skills database for all roles and industries
export const COMPREHENSIVE_SKILLS: Record<string, any> = {
  // Frontend Development
  frontend: {
    technical: [
      'html', 'css', 'javascript', 'typescript', 'react', 'vue', 'angular',
      'sass', 'scss', 'less', 'webpack', 'vite', 'parcel', 'babel',
      'responsive design', 'mobile-first', 'cross-browser', 'accessibility',
      'performance optimization', 'seo', 'progressive web apps', 'pwa'
    ],
    frameworks: [
      'next.js', 'nuxt.js', 'gatsby', 'svelte', 'ember.js', 'backbone.js',
      'jquery', 'bootstrap', 'tailwind css', 'material ui', 'ant design',
      'chakra ui', 'styled-components', 'emotion'
    ],
    tools: [
      'git', 'github', 'gitlab', 'bitbucket', 'npm', 'yarn', 'pnpm',
      'eslint', 'prettier', 'jest', 'cypress', 'playwright', 'storybook',
      'figma', 'adobe xd', 'sketch', 'chrome devtools', 'postman'
    ],
    soft: [
      'problem solving', 'teamwork', 'communication', 'attention to detail',
      'creativity', 'user experience', 'design thinking', 'collaboration'
    ],
    education: ['computer science', 'web development', 'design', 'hci']
  },

  // Backend Development
  backend: {
    technical: [
      'node.js', 'express.js', 'fastify', 'python', 'django', 'flask',
      'java', 'spring', 'spring boot', 'c#', '.net', 'asp.net',
      'ruby', 'rails', 'php', 'laravel', 'symfony', 'go', 'gin',
      'rust', 'actix', 'scala', 'play framework', 'kotlin'
    ],
    databases: [
      'mysql', 'postgresql', 'mongodb', 'redis', 'elasticsearch',
      'cassandra', 'dynamodb', 'oracle', 'sqlite', 'mariadb',
      'neo4j', 'couchdb', 'influxdb', 'memcached'
    ],
    tools: [
      'docker', 'kubernetes', 'jenkins', 'gitlab ci', 'github actions',
      'aws', 'azure', 'gcp', 'terraform', 'ansible', 'chef', 'puppet',
      'nginx', 'apache', 'linux', 'ubuntu', 'centos', 'monitoring'
    ],
    concepts: [
      'rest api', 'graphql', 'microservices', 'monolith', 'serverless',
      'event-driven', 'message queues', 'caching', 'load balancing',
      'security', 'authentication', 'authorization', 'oauth', 'jwt',
      'testing', 'unit testing', 'integration testing', 'tdd', 'bdd'
    ],
    soft: [
      'system design', 'problem solving', 'debugging', 'optimization',
      'scalability', 'reliability', 'maintainability', 'documentation'
    ],
    education: ['computer science', 'software engineering', 'systems engineering']
  },

  // Full Stack Development
  fullstack: {
    technical: [
      'html', 'css', 'javascript', 'typescript', 'react', 'vue', 'angular',
      'node.js', 'express.js', 'python', 'django', 'flask', 'java',
      'spring', 'c#', '.net', 'php', 'laravel', 'ruby', 'rails'
    ],
    databases: [
      'mysql', 'postgresql', 'mongodb', 'redis', 'sqlite'
    ],
    tools: [
      'git', 'docker', 'aws', 'azure', 'gcp', 'jenkins', 'webpack',
      'npm', 'yarn', 'eslint', 'jest', 'postman', 'figma'
    ],
    concepts: [
      'rest api', 'graphql', 'responsive design', 'microservices',
      'authentication', 'security', 'testing', 'deployment', 'ci/cd'
    ],
    soft: [
      'full-stack thinking', 'versatility', 'problem solving',
      'end-to-end development', 'user experience', 'system architecture'
    ],
    education: ['computer science', 'software engineering', 'web development']
  },

  // Data Science & Analytics
  data: {
    technical: [
      'python', 'r', 'sql', 'pandas', 'numpy', 'scipy', 'matplotlib',
      'seaborn', 'plotly', 'scikit-learn', 'tensorflow', 'pytorch',
      'keras', 'xgboost', 'lightgbm', 'catboost', 'spark', 'hadoop'
    ],
    tools: [
      'jupyter', 'anaconda', 'git', 'docker', 'aws', 'gcp', 'azure',
      'tableau', 'power bi', 'qlik', 'excel', 'google analytics',
      'apache airflow', 'dbt', 'mlflow', 'kubeflow'
    ],
    concepts: [
      'machine learning', 'deep learning', 'natural language processing',
      'computer vision', 'statistics', 'hypothesis testing', 'a/b testing',
      'data mining', 'big data', 'etl', 'data pipeline', 'feature engineering',
      'model deployment', 'mlops', 'data visualization', 'business intelligence'
    ],
    databases: [
      'sql', 'mysql', 'postgresql', 'mongodb', 'redis', 'cassandra',
      'snowflake', 'redshift', 'bigquery', 'databricks'
    ],
    soft: [
      'analytical thinking', 'problem solving', 'business acumen',
      'communication', 'storytelling', 'curiosity', 'attention to detail'
    ],
    education: [
      'data science', 'statistics', 'mathematics', 'computer science',
      'economics', 'physics', 'engineering'
    ]
  },

  // DevOps & Cloud Engineering
  devops: {
    technical: [
      'linux', 'bash', 'python', 'go', 'powershell', 'yaml', 'json',
      'infrastructure as code', 'gitops', 'continuous integration',
      'continuous deployment', 'site reliability engineering'
    ],
    tools: [
      'docker', 'kubernetes', 'jenkins', 'gitlab ci', 'github actions',
      'terraform', 'ansible', 'chef', 'puppet', 'helm', 'vagrant',
      'prometheus', 'grafana', 'elk stack', 'splunk', 'nagios'
    ],
    cloud: [
      'aws', 'azure', 'gcp', 'digital ocean', 'cloudflare',
      'ec2', 's3', 'rds', 'lambda', 'ecs', 'eks', 'cloudformation',
      'azure devops', 'azure functions', 'google cloud functions'
    ],
    concepts: [
      'microservices', 'containerization', 'orchestration', 'monitoring',
      'logging', 'alerting', 'security', 'compliance', 'backup',
      'disaster recovery', 'high availability', 'scalability', 'automation'
    ],
    soft: [
      'problem solving', 'automation mindset', 'reliability focus',
      'collaboration', 'incident response', 'continuous learning'
    ],
    education: ['computer science', 'systems engineering', 'network engineering']
  },

  // Mobile Development
  mobile: {
    technical: [
      'swift', 'objective-c', 'kotlin', 'java', 'dart', 'flutter',
      'react native', 'xamarin', 'ionic', 'cordova', 'phonegap'
    ],
    platforms: [
      'ios', 'android', 'cross-platform', 'hybrid', 'native',
      'xcode', 'android studio', 'visual studio'
    ],
    concepts: [
      'mobile ui/ux', 'responsive design', 'performance optimization',
      'offline capabilities', 'push notifications', 'app store optimization',
      'mobile security', 'biometric authentication', 'ar/vr'
    ],
    tools: [
      'git', 'fastlane', 'appium', 'espresso', 'xctest',
      'firebase', 'crashlytics', 'analytics', 'app center'
    ],
    soft: [
      'user experience focus', 'platform-specific thinking',
      'performance awareness', 'testing mindset', 'app store knowledge'
    ],
    education: ['computer science', 'mobile development', 'software engineering']
  },

  // AI/ML Engineering
  'ai-ml': {
    technical: [
      'python', 'r', 'scala', 'java', 'c++', 'tensorflow', 'pytorch',
      'keras', 'scikit-learn', 'opencv', 'nltk', 'spacy', 'hugging face',
      'transformers', 'bert', 'gpt', 'llm', 'neural networks'
    ],
    concepts: [
      'machine learning', 'deep learning', 'natural language processing',
      'computer vision', 'reinforcement learning', 'generative ai',
      'model optimization', 'hyperparameter tuning', 'feature engineering',
      'model deployment', 'mlops', 'model monitoring', 'ai ethics'
    ],
    tools: [
      'jupyter', 'colab', 'mlflow', 'kubeflow', 'wandb', 'tensorboard',
      'docker', 'kubernetes', 'aws sagemaker', 'azure ml', 'gcp ai platform'
    ],
    mathematics: [
      'linear algebra', 'calculus', 'statistics', 'probability',
      'optimization', 'information theory', 'graph theory'
    ],
    soft: [
      'research mindset', 'experimentation', 'analytical thinking',
      'problem solving', 'continuous learning', 'scientific method'
    ],
    education: [
      'computer science', 'artificial intelligence', 'machine learning',
      'data science', 'mathematics', 'statistics', 'physics'
    ]
  },

  // Cybersecurity
  cybersecurity: {
    technical: [
      'network security', 'penetration testing', 'vulnerability assessment',
      'incident response', 'forensics', 'malware analysis', 'reverse engineering',
      'encryption', 'cryptography', 'authentication', 'authorization'
    ],
    tools: [
      'wireshark', 'metasploit', 'nmap', 'burp suite', 'owasp zap',
      'kali linux', 'splunk', 'elk stack', 'nessus', 'qualys',
      'snort', 'suricata', 'volatility', 'ghidra', 'ida pro'
    ],
    concepts: [
      'zero trust', 'defense in depth', 'threat modeling', 'risk assessment',
      'compliance', 'gdpr', 'hipaa', 'sox', 'iso 27001', 'nist framework',
      'threat intelligence', 'security operations', 'incident handling'
    ],
    certifications: [
      'cissp', 'cism', 'cisa', 'cissp', 'ceh', 'oscp', 'gsec', 'gcih'
    ],
    soft: [
      'attention to detail', 'analytical thinking', 'ethical mindset',
      'continuous learning', 'communication', 'documentation'
    ],
    education: ['cybersecurity', 'information security', 'computer science']
  },

  // Product Management
  product: {
    technical: [
      'product strategy', 'roadmapping', 'user research', 'market analysis',
      'competitive analysis', 'product analytics', 'a/b testing', 'metrics'
    ],
    tools: [
      'jira', 'confluence', 'figma', 'sketch', 'invision', 'miro',
      'google analytics', 'mixpanel', 'amplitude', 'hotjar', 'tableau'
    ],
    concepts: [
      'agile', 'scrum', 'kanban', 'lean startup', 'design thinking',
      'user experience', 'user interface', 'mvp', 'product-market fit',
      'go-to-market', 'pricing strategy', 'feature prioritization'
    ],
    soft: [
      'leadership', 'communication', 'strategic thinking', 'empathy',
      'problem solving', 'data-driven decision making', 'stakeholder management'
    ],
    education: ['business', 'mba', 'computer science', 'design', 'engineering']
  },

  // UI/UX Design
  design: {
    technical: [
      'user interface design', 'user experience design', 'interaction design',
      'visual design', 'graphic design', 'typography', 'color theory',
      'layout', 'grid systems', 'responsive design', 'accessibility'
    ],
    tools: [
      'figma', 'sketch', 'adobe xd', 'invision', 'principle', 'framer',
      'adobe creative suite', 'photoshop', 'illustrator', 'after effects',
      'zeplin', 'abstract', 'miro', 'whimsical'
    ],
    concepts: [
      'design thinking', 'user research', 'usability testing', 'wireframing',
      'prototyping', 'information architecture', 'user journey mapping',
      'personas', 'design systems', 'atomic design', 'material design'
    ],
    soft: [
      'creativity', 'empathy', 'communication', 'collaboration',
      'attention to detail', 'problem solving', 'user-centric thinking'
    ],
    education: ['design', 'hci', 'psychology', 'art', 'graphic design']
  },

  // Quality Assurance
  qa: {
    technical: [
      'manual testing', 'automated testing', 'test planning', 'test cases',
      'bug reporting', 'regression testing', 'performance testing',
      'security testing', 'usability testing', 'api testing'
    ],
    tools: [
      'selenium', 'cypress', 'playwright', 'postman', 'jmeter',
      'loadrunner', 'testng', 'junit', 'pytest', 'jira', 'testlink'
    ],
    concepts: [
      'test driven development', 'behavior driven development',
      'continuous testing', 'shift left testing', 'test automation',
      'quality assurance', 'quality control', 'defect lifecycle'
    ],
    soft: [
      'attention to detail', 'analytical thinking', 'problem solving',
      'communication', 'patience', 'critical thinking', 'documentation'
    ],
    education: ['computer science', 'software engineering', 'quality assurance']
  },

  // General/Common Skills
  general: {
    technical: [
      'programming', 'software development', 'web development',
      'database management', 'version control', 'debugging',
      'testing', 'documentation', 'code review'
    ],
    tools: [
      'git', 'github', 'gitlab', 'jira', 'confluence', 'slack',
      'microsoft office', 'google workspace', 'visual studio code'
    ],
    soft: [
      'problem solving', 'communication', 'teamwork', 'leadership',
      'time management', 'adaptability', 'learning ability',
      'attention to detail', 'creativity', 'analytical thinking'
    ],
    education: ['computer science', 'engineering', 'technology']
  },

  // Business Analysis
  'business-analyst': {
    technical: [
      'requirements gathering', 'process mapping', 'gap analysis',
      'stakeholder analysis', 'business process modeling', 'data analysis',
      'financial modeling', 'cost-benefit analysis'
    ],
    tools: [
      'excel', 'power bi', 'tableau', 'visio', 'lucidchart', 'sql',
      'jira', 'confluence', 'sharepoint', 'salesforce'
    ],
    concepts: [
      'agile methodology', 'waterfall', 'change management',
      'project management', 'risk management', 'quality assurance'
    ],
    soft: [
      'analytical thinking', 'communication', 'problem solving',
      'attention to detail', 'stakeholder management', 'documentation'
    ],
    education: ['business administration', 'mba', 'economics', 'finance']
  },

  // Database Administration
  dba: {
    technical: [
      'database design', 'query optimization', 'performance tuning',
      'backup and recovery', 'security', 'monitoring', 'maintenance'
    ],
    databases: [
      'mysql', 'postgresql', 'oracle', 'sql server', 'mongodb',
      'redis', 'cassandra', 'elasticsearch'
    ],
    tools: [
      'sql developer', 'mysql workbench', 'pgadmin', 'mongodb compass',
      'datagrip', 'toad', 'nagios', 'zabbix'
    ],
    concepts: [
      'acid properties', 'normalization', 'indexing', 'replication',
      'clustering', 'partitioning', 'data warehousing', 'etl'
    ],
    soft: [
      'attention to detail', 'problem solving', 'analytical thinking',
      'documentation', 'reliability', 'security mindset'
    ],
    education: ['computer science', 'information systems', 'database management']
  }
};