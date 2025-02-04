import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Droplet, Menu, X } from 'lucide-react';
import { LanguageSelector } from './LanguageSelector';

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigation = [
    { name: 'Tool', path: '/calendar-tool' },
    { name: 'Guide', path: '/user-guide' },
    { name: 'Articles', path: '/articles' },
    { name: 'Contact', path: '/contact' }
  ];

  const getActiveStyles = (path: string) => {
    const isActive = location.pathname === path;
    return isActive
      ? 'text-blue-600 font-medium'
      : 'text-gray-600 hover:text-blue-600 transition-colors';
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Background with blur effect */}
      <div 
        className={`absolute inset-0 transition-all duration-200 ${
          isScrolled 
            ? 'bg-white/80 backdrop-blur-lg shadow-sm' 
            : 'bg-white/40 backdrop-blur-sm'
        }`}
      />

      <nav className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          <Link to="/" className="flex items-center space-x-2">
            <Droplet className="h-6 w-6 text-blue-600" />
            <span className="font-bold text-lg bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              OptiDrop
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`${getActiveStyles(item.path)} text-sm font-medium relative`}
              >
                {item.name}
              </Link>
            ))}
            <LanguageSelector />
            <button className="bg-blue-600/90 backdrop-blur-sm text-white px-4 py-1.5 rounded-lg hover:bg-blue-700/90 transition-colors text-sm">
              Sign In
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-1.5"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5 text-gray-600" />
            ) : (
              <Menu className="h-5 w-5 text-gray-600" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-3 backdrop-blur-lg bg-white/90">
            <div className="flex flex-col space-y-3">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`${getActiveStyles(item.path)} text-sm font-medium px-4 py-2`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="px-4 pt-3 border-t border-gray-200/50">
                <LanguageSelector />
              </div>
              <div className="px-4">
                <button className="w-full bg-blue-600/90 backdrop-blur-sm text-white px-4 py-2 rounded-lg hover:bg-blue-700/90 transition-colors text-sm">
                  Sign In
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}