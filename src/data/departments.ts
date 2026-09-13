export interface DepartmentInfo {
  code: string;
  name: string;
  shortName: string;
  iconName: string;
  color: string;
  description: string;
}

export const INITIAL_DEPARTMENTS: DepartmentInfo[] = [
  {
    code: 'CSE',
    name: 'Computer Science and Engineering',
    shortName: 'CSE',
    iconName: 'Code',
    color: '#FF6600',
    description: 'Structured programming, data structures, algorithms, OS, AI, web dev, and core computing.'
  },
  {
    code: 'DS',
    name: 'Data Science',
    shortName: 'Data Science',
    iconName: 'Database',
    color: '#3B82F6',
    description: 'Statistics, machine learning, deep learning, big data analytics, and data visualization.'
  },
  {
    code: 'EEE',
    name: 'Electrical and Electronic Engineering',
    shortName: 'EEE',
    iconName: 'Zap',
    color: '#10B981',
    description: 'Circuits, electronics, microprocessors, signals, power systems, and telecom.'
  },
  {
    code: 'BBA',
    name: 'Business Administration',
    shortName: 'BBA',
    iconName: 'TrendingUp',
    color: '#8B5CF6',
    description: 'Finance, marketing, accounting, management, supply chain, and business analytics.'
  },
  {
    code: 'Civil',
    name: 'Civil Engineering',
    shortName: 'Civil',
    iconName: 'Building',
    color: '#EC4899',
    description: 'Structural mechanics, geotechnical, transportation, environmental, and fluid mechanics.'
  }
];
