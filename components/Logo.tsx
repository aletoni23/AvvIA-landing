
import React from 'react';

interface LogoProps {
  className?: string;
  showText?: boolean;
}

const Logo: React.FC<LogoProps> = ({ className = "h-8", showText = true }) => {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <svg 
        viewBox="0 0 100 100" 
        className="h-full w-auto fill-none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Main "A" geometric structure */}
        <path 
          d="M20 80L50 20L80 80" 
          stroke="currentColor" 
          strokeWidth="12" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          className="text-teal-900"
        />
        
        {/* Modern crossbar with leaf/AI node hybrid */}
        <path 
          d="M38 55H62" 
          stroke="currentColor" 
          strokeWidth="10" 
          strokeLinecap="round" 
          className="text-teal-600"
        />
        
        {/* Sprout / Node detail at the peak */}
        <circle cx="50" cy="18" r="6" className="fill-teal-500" />
        
        {/* Small agricultural leaf accent */}
        <path 
          d="M82 75C88 65 95 65 95 75C95 85 88 85 82 75Z" 
          className="fill-teal-700"
        />
      </svg>
      
      {showText && (
        <span className="text-2xl font-bold tracking-tighter text-gray-900">
          Avv<span className="text-teal-800">IA</span>
        </span>
      )}
    </div>
  );
};

export default Logo;
