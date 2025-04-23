
import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface ToolCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  to: string;
  className?: string;
  popular?: boolean;
}

const ToolCard: React.FC<ToolCardProps> = ({
  title,
  description,
  icon,
  to,
  className,
  popular = false
}) => {
  return (
    <Link to={to} className="block">
      <div className={cn("tool-card group relative", className)}>
        {popular && (
          <div className="absolute -top-2 -right-2 bg-apple-blue text-white py-1 px-3 rounded-full text-xs font-medium">
            Popular
          </div>
        )}
        <div className="flex items-start">
          <div className="mr-4 text-apple-blue group-hover:scale-110 transition-transform duration-300">
            {icon}
          </div>
          <div>
            <h3 className="font-medium text-lg text-apple-black">{title}</h3>
            <p className="text-apple-darkgray text-sm mt-1">{description}</p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ToolCard;
