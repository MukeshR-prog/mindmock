export function interviewQuestionPrompt({
  resumeText,
  role,
  experience,
  previousAnswer,
  interviewMode,
  selectedConcepts,
}: {
  resumeText?: string;
  role: string;
  experience: string;
  previousAnswer?: string;
  interviewMode?: string;
  selectedConcepts?: string[];
}) {
  // Concept-based interview prompt
  if (interviewMode === "concept-based" && selectedConcepts && selectedConcepts.length > 0) {
    return conceptBasedQuestionPrompt({ role, experience, previousAnswer, selectedConcepts });
  }

  // Resume-based interview prompt (default)
  return `
You are a professional technical interviewer.

Candidate details:
- Target role: ${role}
- Experience level: ${experience}

Candidate resume:
${resumeText}

${previousAnswer ? `Candidate's previous answer:\n${previousAnswer}` : ""}

Instructions:
- Ask ONE interview question only
- Base the question strictly on resume content
- Adjust difficulty to experience level
- Ask realistic interview questions
- Do NOT mention the resume explicitly
- Do NOT ask generic questions
- Output only the question text
`;
}

// Concept-based interview question prompt
export function conceptBasedQuestionPrompt({
  role,
  experience,
  previousAnswer,
  selectedConcepts,
}: {
  role: string;
  experience: string;
  previousAnswer?: string;
  selectedConcepts: string[];
}) {
  const conceptDescriptions: Record<string, string> = {
    "os": "Operating Systems - Process management, Memory management, CPU scheduling, Deadlocks, File systems, Virtual memory, Threads vs Processes, Synchronization",
    "cn": "Computer Networks - OSI/TCP-IP model, HTTP/HTTPS, DNS, TCP vs UDP, Sockets, Routing, Load balancing, CDN, WebSockets, REST APIs",
    "dbms": "Database Management Systems - SQL queries, Normalization, ACID properties, Indexing, Transactions, Joins, Stored procedures, NoSQL vs SQL, Query optimization",
    "oops": "Object-Oriented Programming - Classes, Objects, Inheritance, Polymorphism, Encapsulation, Abstraction, SOLID principles, Design patterns",
    "dsa": "Data Structures & Algorithms - Arrays, Linked Lists, Trees, Graphs, Hash Tables, Stacks, Queues, Sorting, Searching, Dynamic Programming, Recursion",
    "sorting": "Sorting & Searching Algorithms - QuickSort, MergeSort, HeapSort, Binary Search, Linear Search, Time complexity analysis",
    "complexity": "Time & Space Complexity - Big O notation, Best/Worst/Average case, Space complexity, Algorithm optimization, Amortized analysis",
    "system-design": "System Design - Scalability, Load balancing, Caching, Database sharding, Microservices, Message queues, CAP theorem, Distributed systems",
    "design-patterns": "Design Patterns - Creational (Singleton, Factory), Structural (Adapter, Decorator), Behavioral (Observer, Strategy), MVC, MVVM",
    "microservices": "Microservices Architecture - Service discovery, API Gateway, Circuit breaker, Event-driven architecture, Docker, Kubernetes",
    "web": "Web Development - REST vs GraphQL, WebSockets, HTTP methods, Status codes, Authentication, CORS, Cookies vs Sessions, JWT",
    "security": "Security Fundamentals - Authentication vs Authorization, Encryption, Hashing, HTTPS/TLS, SQL Injection, XSS, CSRF, OAuth",
    "testing": "Testing & QA - Unit testing, Integration testing, E2E testing, TDD, BDD, Mocking, Test coverage, CI/CD testing",
    "devops": "DevOps & CI/CD - Docker, Kubernetes, Jenkins, GitHub Actions, Infrastructure as Code, Monitoring, Logging, Deployment strategies",
  };

  const conceptDetails = selectedConcepts
    .map(c => conceptDescriptions[c] || c)
    .join("\n- ");

  return `
You are a professional technical interviewer conducting a concept-based interview.

Interview Details:
- Target role: ${role}
- Experience level: ${experience}
- Focus areas: ${selectedConcepts.join(", ")}

Detailed concept coverage:
- ${conceptDetails}

${previousAnswer ? `Candidate's previous answer:\n${previousAnswer}\n\nBased on their response, ask a follow-up or new question from the selected concepts.` : ""}

Instructions:
- Ask ONE technical interview question
- Focus on the selected concepts listed above
- Ask conceptual questions that test understanding, not memorization
- Include scenario-based or problem-solving questions when appropriate
- Adjust complexity based on experience level:
  * Junior: Focus on fundamentals and basic concepts
  * Mid-level: Include practical applications and trade-offs
  * Senior: Ask about system design, optimization, and architectural decisions
  * Stress mode: Ask challenging edge cases and deep-dive questions
- Do NOT ask generic questions
- Make questions practical and relevant to real-world scenarios
- Output only the question text
`;
}

