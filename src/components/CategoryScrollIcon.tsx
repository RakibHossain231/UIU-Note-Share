import React from 'react';

interface CategoryScrollIconProps {
  type: 
    | 'question' 
    | 'solution' 
    | 'handnote' 
    | 'ct' 
    | 'ct_solve' 
    | 'assignment' 
    | 'assignment_solve' 
    | 'cheatsheet';
  color?: string;
  className?: string;
}

export const CategoryScrollIcon: React.FC<CategoryScrollIconProps> = ({
  type,
  color = '#C2671A',
  className = 'w-24 h-24'
}) => {
  if (type === 'question') {
    return (
      <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Scroll body */}
        <path
          d="M30 20C24.4772 20 20 24.4772 20 30V65C20 70.5228 24.4772 75 30 75H65C70.5228 75 75 70.5228 75 65V35C75 29.4772 70.5228 25 65 25H35"
          stroke={color}
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <path
          d="M20 30C20 24.4772 24.4772 20 30 20H70C75.5228 20 80 24.4772 80 30V60C80 65.5228 75.5228 70 70 70"
          stroke={color}
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Text lines */}
        <line x1="38" y1="36" x2="62" y2="36" stroke={color} strokeWidth="4" strokeLinecap="round" />
        <line x1="38" y1="48" x2="55" y2="48" stroke={color} strokeWidth="4" strokeLinecap="round" />
        {/* Question mark badge */}
        <circle cx="34" cy="66" r="13" fill="#FFF9F5" stroke={color} strokeWidth="4" />
        <text
          x="34"
          y="72"
          textAnchor="middle"
          fill={color}
          fontSize="16"
          fontWeight="bold"
          fontFamily="system-ui, sans-serif"
        >
          ?
        </text>
      </svg>
    );
  }

  if (type === 'solution') {
    return (
      <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Scroll body */}
        <path
          d="M30 20C24.4772 20 20 24.4772 20 30V65C20 70.5228 24.4772 75 30 75H65C70.5228 75 75 70.5228 75 65V35C75 29.4772 70.5228 25 65 25H35"
          stroke={color}
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <path
          d="M20 30C20 24.4772 24.4772 20 30 20H70C75.5228 20 80 24.4772 80 30V60C80 65.5228 75.5228 70 70 70"
          stroke={color}
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Text lines */}
        <line x1="38" y1="36" x2="62" y2="36" stroke={color} strokeWidth="4" strokeLinecap="round" />
        <line x1="38" y1="48" x2="55" y2="48" stroke={color} strokeWidth="4" strokeLinecap="round" />
        {/* Checkmark badge */}
        <circle cx="34" cy="66" r="13" fill="#FFF9F5" stroke={color} strokeWidth="4" />
        <path
          d="M28 66L32 70L40 61"
          stroke={color}
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (type === 'handnote') {
    return (
      <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Book / Notepad */}
        <rect x="24" y="20" width="52" height="60" rx="8" stroke={color} strokeWidth="4" fill="none" />
        <line x1="36" y1="34" x2="62" y2="34" stroke={color} strokeWidth="4" strokeLinecap="round" />
        <line x1="36" y1="46" x2="62" y2="46" stroke={color} strokeWidth="4" strokeLinecap="round" />
        <line x1="36" y1="58" x2="50" y2="58" stroke={color} strokeWidth="4" strokeLinecap="round" />
        {/* Pencil/Bookmark badge */}
        <circle cx="70" cy="66" r="12" fill="#FFF9F5" stroke={color} strokeWidth="3.5" />
        <path d="M66 70L74 62" stroke={color} strokeWidth="3" strokeLinecap="round" />
      </svg>
    );
  }

  if (type === 'ct') {
    return (
      <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="32" stroke={color} strokeWidth="4" fill="none" />
        <circle cx="50" cy="50" r="20" stroke={color} strokeWidth="3.5" fill="none" />
        <circle cx="50" cy="50" r="8" fill={color} />
        {/* Crosshair marks */}
        <path d="M50 12V22M50 78V88M12 50H22M78 50H88" stroke={color} strokeWidth="3" strokeLinecap="round" />
      </svg>
    );
  }

  if (type === 'ct_solve') {
    return (
      <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="46" cy="46" r="28" stroke={color} strokeWidth="4" fill="none" />
        <circle cx="46" cy="46" r="16" stroke={color} strokeWidth="3" fill="none" />
        {/* Checkmark solution badge */}
        <circle cx="68" cy="68" r="14" fill="#FFF9F5" stroke={color} strokeWidth="3.5" />
        <path
          d="M62 68L66 72L74 63"
          stroke={color}
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (type === 'assignment') {
    return (
      <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="25" y="24" width="50" height="58" rx="8" stroke={color} strokeWidth="4" fill="none" />
        <path d="M38 24V20C38 17.7909 39.7909 16 42 16H58C60.2091 16 62 17.7909 62 20V24" stroke={color} strokeWidth="3.5" />
        <line x1="36" y1="40" x2="64" y2="40" stroke={color} strokeWidth="3.5" strokeLinecap="round" />
        <line x1="36" y1="52" x2="64" y2="52" stroke={color} strokeWidth="3.5" strokeLinecap="round" />
        <line x1="36" y1="64" x2="52" y2="64" stroke={color} strokeWidth="3.5" strokeLinecap="round" />
      </svg>
    );
  }

  if (type === 'assignment_solve') {
    return (
      <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="25" y="24" width="50" height="58" rx="8" stroke={color} strokeWidth="4" fill="none" />
        <path d="M38 24V20C38 17.7909 39.7909 16 42 16H58C60.2091 16 62 17.7909 62 20V24" stroke={color} strokeWidth="3.5" />
        {/* Solved checkmarks on clipboard */}
        <path d="M33 39L36 42L41 37" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="45" y1="40" x2="64" y2="40" stroke={color} strokeWidth="3" strokeLinecap="round" />
        <path d="M33 51L36 54L41 49" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="45" y1="52" x2="64" y2="52" stroke={color} strokeWidth="3" strokeLinecap="round" />
        <path d="M33 63L36 66L41 61" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="45" y1="64" x2="56" y2="64" stroke={color} strokeWidth="3" strokeLinecap="round" />
      </svg>
    );
  }

  // Cheatsheet
  return (
    <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M50 18L32 50H48L44 82L68 46H52L58 18H50Z"
        stroke={color}
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
};
