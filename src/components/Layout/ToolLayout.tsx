
import React, { ReactNode } from 'react';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ToolLayoutProps {
  title: string;
  description: string;
  children: ReactNode;
  backLink: string;
}

const ToolLayout = ({ title, description, children, backLink }: ToolLayoutProps) => {
  return (
    <>
      <Helmet>
        <title>{title} - BihariTool</title>
        <meta name="description" content={description} />
      </Helmet>

      <div className="pt-24 pb-16">
        <div className="app-container">
          <div className="mb-6">
            <Link 
              to={backLink} 
              className="inline-flex items-center text-apple-darkgray hover:text-apple-blue transition-colors"
            >
              <ArrowLeft size={18} className="mr-2" />
              Back to tools
            </Link>
          </div>
          
          <div className="mb-10">
            <h1 className="text-3xl md:text-4xl font-bold mb-3">{title}</h1>
            <p className="text-apple-darkgray max-w-3xl">{description}</p>
          </div>
          
          {children}
        </div>
      </div>
    </>
  );
};

export default ToolLayout;
