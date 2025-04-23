
import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-apple-gray py-12 mt-20">
      <div className="app-container">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4 text-apple-black">BihariTool</h3>
            <p className="text-apple-darkgray text-sm">
              Professional image and PDF tools for everyone. Simplify your workflow with our easy-to-use tools.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4 text-apple-black">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-apple-darkgray text-sm hover:text-apple-blue transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/image-tools" className="text-apple-darkgray text-sm hover:text-apple-blue transition-colors">
                  Image Tools
                </Link>
              </li>
              <li>
                <Link to="/pdf-tools" className="text-apple-darkgray text-sm hover:text-apple-blue transition-colors">
                  PDF Tools
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4 text-apple-black">Most Used Tools</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/image-tools/compress" className="text-apple-darkgray text-sm hover:text-apple-blue transition-colors">
                  Image Compression
                </Link>
              </li>
              <li>
                <Link to="/image-tools/remove-background" className="text-apple-darkgray text-sm hover:text-apple-blue transition-colors">
                  Background Removal
                </Link>
              </li>
              <li>
                <Link to="/pdf-tools/merge" className="text-apple-darkgray text-sm hover:text-apple-blue transition-colors">
                  Merge PDFs
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-8 pt-8 text-center">
          <p className="text-apple-darkgray text-sm">
            © {currentYear} BihariTool. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
