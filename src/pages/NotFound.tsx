
import React, { useEffect } from "react";
import { useLocation, Link } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
    
    document.title = "Page Not Found - BihariTool";
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-apple-gray px-4">
      <div className="text-center max-w-md">
        <h1 className="text-6xl font-bold text-apple-blue mb-6">404</h1>
        <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
        <p className="text-apple-darkgray mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/"
          className="apple-btn inline-block px-8 py-3"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
