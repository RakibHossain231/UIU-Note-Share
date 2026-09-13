import { Course } from '../types';

export const INITIAL_COURSES: Course[] = [
  // --- CSE Trimester 1 ---
  {
    id: 'cse-1111',
    code: 'CSE 1111',
    title: 'Structured Programming Language',
    abbr: 'SPL',
    department: 'CSE',
    trimester: 1,
    color: '#FF6600',
    description: 'C programming language fundamentals, control structures, pointers, arrays, and functions.',
    credit: 3
  },
  {
    id: 'math-1151',
    code: 'MATH 1151',
    title: 'Differential and Integral Calculus',
    abbr: 'Math 1',
    department: 'CSE',
    trimester: 1,
    color: '#0EA5E9',
    description: 'Functions, limits, differentiation, integration and real-world applications.',
    credit: 3
  },
  {
    id: 'eng-1011',
    code: 'ENG 1011',
    title: 'English I',
    abbr: 'Eng 1',
    department: 'CSE',
    trimester: 1,
    color: '#10B981',
    description: 'Grammar, reading comprehension, report writing, and communication skills.',
    credit: 3
  },

  // --- CSE Trimester 2 ---
  {
    id: 'cse-1211',
    code: 'CSE 1211',
    title: 'Object Oriented Programming',
    abbr: 'OOP',
    department: 'CSE',
    trimester: 2,
    color: '#F59E0B',
    description: 'Java and C++ concepts: encapsulation, inheritance, polymorphism, abstraction, and interfaces.',
    credit: 3
  },
  {
    id: 'math-2183',
    code: 'MATH 2183',
    title: 'Calculus and Linear Algebra',
    abbr: 'Math 2',
    department: 'CSE',
    trimester: 2,
    color: '#6366F1',
    description: 'Matrices, determinants, vector spaces, eigenvalues, and linear transformations.',
    credit: 3
  },
  {
    id: 'phy-1101',
    code: 'PHY 1101',
    title: 'Physics',
    abbr: 'Physics',
    department: 'CSE',
    trimester: 2,
    color: '#EC4899',
    description: 'Waves, thermodynamics, electricity, magnetism, optics, and modern physics.',
    credit: 3
  },

  // --- CSE Trimester 3 ---
  {
    id: 'cse-2213',
    code: 'CSE 2213',
    title: 'Discrete Mathematics',
    abbr: 'Discrete',
    department: 'CSE',
    trimester: 3,
    color: '#8B5CF6',
    description: 'Propositional logic, set theory, graph theory, relations, combinatorics, and induction.',
    credit: 3
  },
  {
    id: 'cse-2215',
    code: 'CSE 2215',
    title: 'Data Structure and Algorithms I',
    abbr: 'DSA 1',
    department: 'CSE',
    trimester: 3,
    color: '#EF4444',
    description: 'Arrays, linked lists, stacks, queues, recursion, sorting, and asymptotic notation.',
    credit: 3
  },

  // --- CSE Trimester 4 ---
  {
    id: 'cse-2118',
    code: 'CSE 2118',
    title: 'Advanced Object Oriented Programming',
    abbr: 'AOOP',
    department: 'CSE',
    trimester: 4,
    color: '#D97706',
    description: 'JavaFX, multi-threading, socket programming, design patterns, and enterprise Java.',
    credit: 3
  },
  {
    id: 'cse-2217',
    code: 'CSE 2217',
    title: 'Data Structure and Algorithms II',
    abbr: 'DSA 2',
    department: 'CSE',
    trimester: 4,
    color: '#DC2626',
    description: 'Trees, AVL, heaps, graphs, BFS/DFS, Dijkstra, MST, dynamic programming, and greedy algorithms.',
    credit: 3
  },
  {
    id: 'math-2201',
    code: 'MATH 2201',
    title: 'Coordinate Geometry and Vector Analysis',
    abbr: 'Math 3',
    department: 'CSE',
    trimester: 4,
    color: '#2563EB',
    description: '2D/3D geometry, vector differentiation, gradient, divergence, curl, and vector integrals.',
    credit: 3
  },

  // --- CSE Trimester 5 ---
  {
    id: 'cse-2231',
    code: 'CSE 2231',
    title: 'Digital Logic Design',
    abbr: 'DLD',
    department: 'CSE',
    trimester: 5,
    color: '#059669',
    description: 'Boolean algebra, logic gates, combinational and sequential circuit design, flip-flops, counters.',
    credit: 3
  },
  {
    id: 'cse-3521',
    code: 'CSE 3521',
    title: 'Database Management Systems',
    abbr: 'DBMS',
    department: 'CSE',
    trimester: 5,
    color: '#7C3AED',
    description: 'Relational model, SQL, normalization, transactions, indexing, and ER diagram design.',
    credit: 3
  },

  // --- CSE Trimester 6 ---
  {
    id: 'cse-3411',
    code: 'CSE 3411',
    title: 'System Analysis and Design',
    abbr: 'SAD',
    department: 'CSE',
    trimester: 6,
    color: '#4F46E5',
    description: 'Software lifecycle models, requirements engineering, UML modeling, and system architectures.',
    credit: 3
  },
  {
    id: 'cse-3711',
    code: 'CSE 3711',
    title: 'Computer Architecture',
    abbr: 'Comp Arch',
    department: 'CSE',
    trimester: 6,
    color: '#B45309',
    description: 'MIPS architecture, pipelining, cache memory hierarchy, instruction sets, ALU design.',
    credit: 3
  },
  {
    id: 'math-2205',
    code: 'MATH 2205',
    title: 'Probability and Statistics',
    abbr: 'Prob & Stat',
    department: 'CSE',
    trimester: 6,
    color: '#0284C7',
    description: 'Random variables, probability distributions, hypothesis testing, regression analysis.',
    credit: 3
  },

  // --- CSE Trimester 7 ---
  {
    id: 'cse-3811',
    code: 'CSE 3811',
    title: 'Artificial Intelligence',
    abbr: 'AI',
    department: 'CSE',
    trimester: 7,
    color: '#9333EA',
    description: 'Search algorithms (A*, minimax), knowledge representation, NLP, and machine learning basics.',
    credit: 3
  },
  {
    id: 'cse-4325',
    code: 'CSE 4325',
    title: 'Microprocessors and Microcontrollers',
    abbr: 'Micro',
    department: 'CSE',
    trimester: 7,
    color: '#16A34A',
    description: 'Intel 8086 assembly, Arduino/AVR microcontrollers, interrupts, and hardware interfacing.',
    credit: 3
  },

  // --- CSE Trimester 8 ---
  {
    id: 'cse-4531',
    code: 'CSE 4531',
    title: 'Computer Networks',
    abbr: 'Networks',
    department: 'CSE',
    trimester: 8,
    color: '#EA580C',
    description: 'OSI and TCP/IP stack, IP addressing, routing algorithms, socket programming, network security.',
    credit: 3
  },
  {
    id: 'cse-3715',
    code: 'CSE 3715',
    title: 'Data Communication',
    abbr: 'Data Comm',
    department: 'CSE',
    trimester: 8,
    color: '#0891B2',
    description: 'Signal transmission, modulation, multiplexing, error detection and correction protocols.',
    credit: 3
  },

  // --- CSE Trimester 9 ---
  {
    id: 'cse-4165',
    code: 'CSE 4165',
    title: 'Web Programming',
    abbr: 'Web Dev',
    department: 'CSE',
    trimester: 9,
    color: '#E11D48',
    description: 'HTML5, CSS3, JavaScript, React/Node.js, RESTful APIs, and full-stack development.',
    credit: 3
  },
  {
    id: 'cse-4311',
    code: 'CSE 4311',
    title: 'Operating Systems',
    abbr: 'OS',
    department: 'CSE',
    trimester: 9,
    color: '#475569',
    description: 'Process management, concurrency, semaphores, CPU scheduling, deadlocks, and virtual memory.',
    credit: 3
  },

  // --- CSE Trimester 10, 11, 12 (Electives / Advanced) ---
  {
    id: 'cse-4587',
    code: 'CSE 4587',
    title: 'Cloud Computing',
    abbr: 'Cloud',
    department: 'CSE',
    trimester: 10,
    color: '#0284C7',
    description: 'AWS, Azure, Docker, Kubernetes, serverless architectures, and microservices.',
    credit: 3
  },
  {
    id: 'cse-4889',
    code: 'CSE 4889',
    title: 'Machine Learning',
    abbr: 'ML',
    department: 'CSE',
    trimester: 10,
    color: '#7E22CE',
    description: 'Supervised and unsupervised learning, regression, classification, clustering, neural networks.',
    credit: 3
  },
  {
    id: 'ipe-3401',
    code: 'IPE 3401',
    title: 'Industrial and Operational Management',
    abbr: 'IOM',
    department: 'CSE',
    trimester: 11,
    color: '#BE123C',
    description: 'Project management, CPM/PERT, inventory control, operations research, total quality management.',
    credit: 3
  },

  // --- DATA SCIENCE (DS) COURSES ---
  {
    id: 'ds-1101',
    code: 'DS 1101',
    title: 'Introduction to Data Science',
    abbr: 'Intro to DS',
    department: 'DS',
    trimester: 1,
    color: '#2563EB',
    description: 'Data science lifecycle, Python for data science, Pandas, NumPy, and exploratory data analysis.',
    credit: 3
  },
  {
    id: 'ds-2201',
    code: 'DS 2201',
    title: 'Statistical Foundations for Data Science',
    abbr: 'Stats for DS',
    department: 'DS',
    trimester: 3,
    color: '#1D4ED8',
    description: 'Inferential statistics, estimation, hypothesis testing, ANOVA, and Bayesian methods.',
    credit: 3
  },
  {
    id: 'ds-3301',
    code: 'DS 3301',
    title: 'Big Data Analytics',
    abbr: 'Big Data',
    department: 'DS',
    trimester: 6,
    color: '#1E40AF',
    description: 'Hadoop ecosystem, Apache Spark, distributed computing, and data pipelines.',
    credit: 3
  },
  {
    id: 'ds-4401',
    code: 'DS 4401',
    title: 'Deep Learning and Neural Networks',
    abbr: 'Deep Learning',
    department: 'DS',
    trimester: 8,
    color: '#4338CA',
    description: 'CNNs, RNNs, Transformers, PyTorch/TensorFlow, and computer vision applications.',
    credit: 3
  }
];
