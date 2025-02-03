"use client";
import { useState } from "react";

interface UserTooltipProps {
  username: string;
  email: string;
  className?: string;
}

const UserTooltip = ({ username, email, className = "" }: UserTooltipProps) => {
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);

  return (
    <div className="relative inline-block">
      <span
        className={`cursor-pointer hover:text-indigo-600 transition-colors ${className}`}
        onMouseEnter={() => setIsTooltipVisible(true)}
        onMouseLeave={() => setIsTooltipVisible(false)}
      >
        {username}
      </span>
      {isTooltipVisible && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg whitespace-nowrap z-50">
          {email}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-8 border-transparent border-t-gray-900"></div>
        </div>
      )}
    </div>
  );
};

export default UserTooltip;
