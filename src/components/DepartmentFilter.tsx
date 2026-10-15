import React, { useEffect, useMemo } from 'react';
import { Code, Database, Zap, TrendingUp, Building, Layers, Pill, Dna } from 'lucide-react';
import { useData } from '../context/DataContext';

interface DepartmentFilterProps {
  mode?: 'courses' | 'contributors';
}

export const DepartmentFilter: React.FC<DepartmentFilterProps> = ({ mode = 'courses' }) => {
  const { departments, selectedDepartment, setSelectedDepartment, courses, contributors } = useData();

  const getIcon = (code: string) => {
    switch (code.toUpperCase()) {
      case 'CSE': return Code;
      case 'DS': return Database;
      case 'EEE': return Zap;
      case 'BBA': return TrendingUp;
      case 'CIVIL': return Building;
      case 'PHARMACY': return Pill;
      case 'BGE': return Dna;
      default: return Layers;
    }
  };

  const getCount = (deptCode: string) => {
    if (mode === 'contributors') {
      if (deptCode === 'All') return contributors.length;
      return contributors.filter(c => c.department.toLowerCase() === deptCode.toLowerCase()).length;
    }
    // Default: courses mode
    if (deptCode === 'All') return courses.length;
    return courses.filter(c => c.department.toLowerCase() === deptCode.toLowerCase()).length;
  };

  // Only keep departments that have items (count > 0)
  const activeDepartments = useMemo(() => {
    return departments.filter(dept => getCount(dept.code) > 0);
  }, [departments, mode, courses, contributors]);

  // If currently selected department has 0 items or is not in active list, reset to 'All'
  useEffect(() => {
    if (
      selectedDepartment !== 'All' &&
      !activeDepartments.some(d => d.code.toLowerCase() === selectedDepartment.toLowerCase())
    ) {
      setSelectedDepartment('All');
    }
  }, [activeDepartments, selectedDepartment, setSelectedDepartment]);

  return (
    <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none py-1">
      {/* All Departments / All Contributors Button */}
      <button
        onClick={() => setSelectedDepartment('All')}
        className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
          selectedDepartment === 'All'
            ? 'bg-[#FF6600] text-white shadow-md shadow-orange-500/25 scale-[1.02]'
            : 'bg-white dark:bg-zinc-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-zinc-700 hover:border-[#FF6600]'
        }`}
      >
        <Layers className="w-4 h-4" />
        <span>{mode === 'contributors' ? 'All Contributors' : 'All Departments'}</span>
        <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
          selectedDepartment === 'All' ? 'bg-white/20 text-white' : 'bg-gray-100 dark:bg-zinc-700 text-gray-600 dark:text-gray-300'
        }`}>
          {getCount('All')}
        </span>
      </button>

      {/* Individual Active Departments Only */}
      {activeDepartments.map((dept) => {
        const Icon = getIcon(dept.code);
        const isSelected = selectedDepartment.toLowerCase() === dept.code.toLowerCase();
        const count = getCount(dept.code);

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
