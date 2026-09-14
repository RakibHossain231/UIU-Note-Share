import React from 'react';
import { Code, Database, Zap, TrendingUp, Building, Layers, Pill, Dna } from 'lucide-react';
import { useData } from '../context/DataContext';

export const DepartmentFilter: React.FC = () => {
  const { departments, selectedDepartment, setSelectedDepartment, courses } = useData();

  const getIcon = (code: string) => {
    switch (code) {
      case 'CSE': return Code;
      case 'DS': return Database;
      case 'EEE': return Zap;
      case 'BBA': return TrendingUp;
      case 'Civil': return Building;
      case 'Pharmacy': return Pill;
      case 'BGE': return Dna;
      default: return Layers;
    }
  };

  const getCourseCount = (deptCode: string) => {
    if (deptCode === 'All') return courses.length;
    return courses.filter(c => c.department.toLowerCase() === deptCode.toLowerCase()).length;
  };

  return (
    <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none py-1">
      {/* All Departments Button */}
      <button
        onClick={() => setSelectedDepartment('All')}
        className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
          selectedDepartment === 'All'
            ? 'bg-[#FF6600] text-white shadow-md shadow-orange-500/25 scale-[1.02]'
            : 'bg-white dark:bg-zinc-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-zinc-700 hover:border-[#FF6600]'
        }`}
      >
        <Layers className="w-4 h-4" />
        <span>All Departments</span>
        <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
          selectedDepartment === 'All' ? 'bg-white/20 text-white' : 'bg-gray-100 dark:bg-zinc-700 text-gray-600 dark:text-gray-300'
        }`}>
          {getCourseCount('All')}
        </span>
      </button>

      {/* Individual Departments */}
      {departments.map((dept) => {
        const Icon = getIcon(dept.code);
        const isSelected = selectedDepartment.toLowerCase() === dept.code.toLowerCase();
        const count = getCourseCount(dept.code);

        return (
          <button
            key={dept.code}
            onClick={() => setSelectedDepartment(dept.code)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
              isSelected
                ? 'bg-[#FF6600] text-white shadow-md shadow-orange-500/25 scale-[1.02]'
                : 'bg-white dark:bg-zinc-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-zinc-700 hover:border-[#FF6600]'
            }`}
          >
            <Icon className="w-4 h-4" />
            <span>{dept.shortName}</span>
            <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
              isSelected ? 'bg-white/20 text-white' : 'bg-gray-100 dark:bg-zinc-700 text-gray-600 dark:text-gray-300'
            }`}>
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
};
