
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';
import AnimatedText from '@/components/UI/AnimatedText';

const Header: React.FC = () => {
  const { language, toggleLanguage, t } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  useEffect(() => {
    setMenuOpen(false);
    window.scrollTo(0, 0); // Scroll to top on route change
  }, [location.pathname]);

  const navLinks = [
    { name: t('home'), path: '/' },
    { name: t('imageTools'), path: '/image-tools' },
    { name: t('pdfTools'), path: '/pdf-tools' }
  ];

  return (
    <header
      className={cn(
        'fixed w-full z-50 transition-all duration-300 backdrop-blur-lg',
        scrolled ? 'bg-white/80 shadow-sm py-3' : 'bg-white/70 py-5' // Improved background for mobile
      )}
    >
      <div className="app-container">
        <nav className="flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-bold bg-gradient-to-r from-apple-blue to-purple-600 bg-clip-text text-transparent">
              <AnimatedText text="BihariTool" delay={300} letterDelay={80} />
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <ul className="flex space-x-8">
              {navLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className={cn(
                      'text-sm font-medium transition-colors duration-200 hover:text-apple-blue relative after:content-[""] after:absolute after:w-full after:h-0.5 after:bg-apple-blue after:left-0 after:-bottom-1 after:scale-x-0 after:origin-right after:transition-transform hover:after:scale-x-100 hover:after:origin-left',
                      location.pathname === link.path
                        ? 'text-apple-blue after:scale-x-100'
                        : 'text-apple-black'
                    )}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleLanguage}
              className="flex items-center gap-2 hover:bg-apple-blue/10"
            >
              <Globe className="h-4 w-4" />
              {language === 'en' ? 'हिंदी' : 'English'}
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-apple-black"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle Menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {menuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </nav>

        {/* Mobile Menu with improved background */}
        {menuOpen && (
          <div className="md:hidden mt-3 pb-3 border-t border-gray-200 bg-white/95 backdrop-blur-lg animate-fade-in rounded-b-lg shadow-md">
            <ul className="space-y-4 mt-4">
              {navLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className={cn(
                      'block text-base py-2 transition-colors duration-200 px-4',
                      location.pathname === link.path
                        ? 'text-apple-blue font-medium'
                        : 'text-apple-black hover:text-apple-blue'
                    )}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
              <li>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleLanguage}
                  className="w-full justify-start px-4"
                >
                  <Globe className="h-4 w-4 mr-2" />
                  {language === 'en' ? 'हिंदी' : 'English'}
                </Button>
              </li>
            </ul>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
