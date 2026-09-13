import { Contributor, ResourceItem } from '../types';

export const INITIAL_CONTRIBUTORS: Contributor[] = [
  {
    id: 'creator-1',
    name: 'Admin / Creator',
    department: 'CSE',
    batch: 'Batch 222',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    socialUrl: 'https://github.com',
    socialType: 'github',
    contributionsCount: 24
  },
  {
    id: 'contrib-1',
    name: 'Tashin Parvez',
    department: 'DS',
    batch: 'Batch 231',
    avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    socialUrl: 'https://facebook.com/tashin.parvez.5',
    socialType: 'facebook',
    contributionsCount: 15
  },
  {
    id: 'contrib-2',
    name: 'Tanvir Hossain',
    department: 'CSE',
    batch: 'Batch 223',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    socialUrl: 'https://linkedin.com',
    socialType: 'linkedin',
    contributionsCount: 9
  },
  {
    id: 'contrib-3',
    name: 'Sadia Afrin',
    department: 'DS',
    batch: 'Batch 232',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    socialUrl: 'https://facebook.com',
    socialType: 'facebook',
    contributionsCount: 7
  },
  {
    id: 'contrib-4',
    name: 'Rafiul Islam',
    department: 'EEE',
    batch: 'Batch 221',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    socialUrl: 'https://github.com',
    socialType: 'github',
    contributionsCount: 5
  }
];

export const INITIAL_RESOURCES: ResourceItem[] = [
  // --- SPL (CSE 1111) Handnotes & Solves ---
  {
    id: 'res-spl-note-1',
    courseId: 'cse-1111',
    department: 'CSE',
    type: 'handnote',
    title: 'Complete Pointer, Memory & Recursion Master Handwritten Notes',
    description: 'Detailed visual explanations of pointers, dynamic memory allocation (malloc/free), and recursion trees.',
    storageType: 'r2',
    fileUrl: 'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf',
    fileSize: '4.8 MB',
    uploadDate: '2026-08-15',
    contributor: INITIAL_CONTRIBUTORS[0]
  },
  {
    id: 'res-spl-mid-233',
    courseId: 'cse-1111',
    department: 'CSE',
    type: 'question_mid',
    term: 'mid',
    trimesterCode: '233',
    title: 'Mid Term Question & Complete Verified Solve (Trimester 233)',
    description: 'Fall 2023 Mid Term exam question paper with step-by-step verified handwritten code solutions.',
    storageType: 'r2',
    fileUrl: 'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf',
    hasSolution: true,
    fileSize: '2.4 MB',
    uploadDate: '2026-08-20',
    contributor: INITIAL_CONTRIBUTORS[2]
  },
  {
    id: 'res-spl-final-241',
    courseId: 'cse-1111',
    department: 'CSE',
    type: 'question_final',
    term: 'final',
    trimesterCode: '241',
    title: 'Final Term Question & Detailed Solutions (Trimester 241)',
    description: 'Spring 2024 Final Exam question solve covering file operations, structures, and linked lists.',
    storageType: 'drive',
    fileUrl: 'https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/view',
    hasSolution: true,
    fileSize: '3.1 MB',
    uploadDate: '2026-09-02',
    contributor: INITIAL_CONTRIBUTORS[0]
  },
  {
    id: 'res-spl-ct-1',
    courseId: 'cse-1111',
    department: 'CSE',
    type: 'ct',
    ctNumber: 1,
    title: 'CT-1 Questions & Solutions: Conditional Logic & Loops',
    description: 'Class Test 1 question paper and full solve covering nested loops, series problems, and patterns.',
    storageType: 'r2',
    fileUrl: 'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf',
    hasSolution: true,
    fileSize: '1.2 MB',
    uploadDate: '2026-08-10',
    contributor: INITIAL_CONTRIBUTORS[2]
  },
  {
    id: 'res-spl-ct-2',
    courseId: 'cse-1111',
    department: 'CSE',
    type: 'ct',
    ctNumber: 2,
    title: 'CT-2 Questions & Solutions: Arrays & Strings',
    description: 'Class Test 2 question paper with dry-run table and complete string manipulation solves.',
    storageType: 'r2',
    fileUrl: 'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf',
    hasSolution: true,
    fileSize: '1.5 MB',
    uploadDate: '2026-08-28',
    contributor: INITIAL_CONTRIBUTORS[0]
  },
  {
    id: 'res-spl-assign-1',
    courseId: 'cse-1111',
    department: 'CSE',
    type: 'assignment',
    assignmentNumber: 1,
    title: 'Assignment 1 Problem Specification & Complete Solution with Code',
    description: 'Student management system mini-project implementation in C with modular structure.',
    storageType: 'drive',
    fileUrl: 'https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/view',
    hasSolution: true,
    fileSize: '2.1 MB',
    uploadDate: '2026-09-01',
    contributor: INITIAL_CONTRIBUTORS[0]
  },
  {
    id: 'res-spl-cheat-1',
    courseId: 'cse-1111',
    department: 'CSE',
    type: 'cheatsheet',
    title: 'C Syntax, Operator Precedence & Format Specifier Cheat Sheet',
    description: 'Quick reference 2-page summary for exam night review.',
    storageType: 'r2',
    fileUrl: 'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf',
    fileSize: '850 KB',
    uploadDate: '2026-09-05',
    contributor: INITIAL_CONTRIBUTORS[2]
  },

  // --- DSA 1 (CSE 2215) ---
  {
    id: 'res-dsa1-note-1',
    courseId: 'cse-2215',
    department: 'CSE',
    type: 'handnote',
    title: 'Singly, Doubly & Circular Linked List Handwritten Notes',
    description: 'Comprehensive pointer diagrams, edge case handling, and insertion/deletion algorithms.',
    storageType: 'r2',
    fileUrl: 'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf',
    fileSize: '6.2 MB',
    uploadDate: '2026-08-18',
    contributor: INITIAL_CONTRIBUTORS[0]
  },
  {
    id: 'res-dsa1-mid-232',
    courseId: 'cse-2215',
    department: 'CSE',
    type: 'question_mid',
    term: 'mid',
    trimesterCode: '232',
    title: 'DSA I Mid Term Question & Complete Solve (Trimester 232)',
    description: 'Stack, queue, infix to postfix, and time complexity questions solved with diagrammatic proofs.',
    storageType: 'r2',
    fileUrl: 'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf',
    hasSolution: true,
    fileSize: '3.4 MB',
    uploadDate: '2026-08-25',
    contributor: INITIAL_CONTRIBUTORS[2]
  },

  // --- DATA SCIENCE (DS 1101) ---
  {
    id: 'res-ds-note-1',
    courseId: 'ds-1101',
    department: 'DS',
    type: 'handnote',
    title: 'NumPy & Pandas Data Wrangling Complete Study Guide',
    description: 'Essential data manipulation, indexing, reshaping, merging, and groupby operations explained clearly.',
    storageType: 'drive',
    fileUrl: 'https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/view',
    fileSize: '5.5 MB',
    uploadDate: '2026-09-04',
    contributor: INITIAL_CONTRIBUTORS[1] // Tashin Parvez (DS)
  },
  {
    id: 'res-ds-mid-241',
    courseId: 'ds-1101',
    department: 'DS',
    type: 'question_mid',
    term: 'mid',
    trimesterCode: '241',
    title: 'Intro to Data Science Mid Question & Solve (Trimester 241)',
    description: 'Data distributions, covariance, feature scaling, and Python data structures exam solve.',
    storageType: 'r2',
    fileUrl: 'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf',
    hasSolution: true,
    fileSize: '2.9 MB',
    uploadDate: '2026-09-08',
    contributor: INITIAL_CONTRIBUTORS[3] // Sadia Afrin (DS)
  },
  {
    id: 'res-ds-ct-1',
    courseId: 'ds-1101',
    department: 'DS',
    type: 'ct',
    ctNumber: 1,
    title: 'CT-1: Pythonic Programming & EDA Questions + Solves',
    description: 'Class test questions on list comprehensions, lambda functions, and data cleaning with solutions.',
    storageType: 'drive',
    fileUrl: 'https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/view',
    hasSolution: true,
    fileSize: '1.4 MB',
    uploadDate: '2026-09-10',
    contributor: INITIAL_CONTRIBUTORS[1] // Tashin Parvez (DS)
  }
];
