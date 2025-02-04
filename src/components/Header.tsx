import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Droplet, Menu, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { LanguageSelector } from './LanguageSelector';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t } = useTranslation();

  const navigation = [
    { name: t('header.eyeDropTool'), path: '/calendar-tool' },
    { name: t('header.userGuide'), path: '/user-guide' },
    { name: t('header.articles'), path: '/articles' },
    { name: t('header.contact'), path: '/contact' },
  ];

  const getActiveStyles = (path: string) => {
    return window.location.pathname === path
      ? 'text-blue-400'
      : 'text-white/80 hover:text-white';
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-black/20">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Droplet className="h-6 w-6 text-blue-600" />
            <span className="font-bold text-lg text-white">
              OptiDrop
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`${getActiveStyles(item.path)} text-sm font-medium transition-colors`}
              >
                {item.name}
              </Link>
            ))}
            <LanguageSelector />
            <button className="bg-blue-600/90 backdrop-blur-sm text-white px-4 py-1.5 rounded-lg hover:bg-blue-700/90 transition-colors text-sm">
              {t('header.signIn')}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-white/5"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6 text-white" />
            ) : (
              <Menu className="h-6 w-6 text-white" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 border-t border-white/10">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`${getActiveStyles(item.path)} block px-3 py-2 rounded-lg text-base font-medium hover:bg-white/5 transition-colors`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="px-3 py-2">
                <LanguageSelector />
              </div>
              <button className="w-full text-left px-3 py-2 text-blue-400 text-base font-medium hover:bg-white/5 transition-colors rounded-lg">
                {t('header.signIn')}
              </button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}