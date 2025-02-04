import React from 'react';
import { Droplet } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

export function Footer() {
  const { t } = useTranslation();
  
  return (
    <footer className="bg-white/10 backdrop-blur-sm border-t border-white/10">
      <div className="max-w-7xl mx-auto py-6 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-2">
            <Droplet className="h-5 w-5 sm:h-6 sm:w-6 text-blue-400" />
            <span className="font-semibold text-lg sm:text-xl text-white">OptiDrop</span>
          </div>
          <nav className="flex flex-wrap justify-center gap-4 sm:gap-6">
            <Link 
              to="/privacy-policy" 
              className="text-sm sm:text-base text-white/70 hover:text-white transition-colors"
            >
              {t('common.privacyPolicy')}
            </Link>
            <Link 
              to="/terms-of-service" 
              className="text-sm sm:text-base text-white/70 hover:text-white transition-colors"
            >
              {t('common.termsOfService')}
            </Link>
            <Link 
              to="/contact" 
              className="text-sm sm:text-base text-white/70 hover:text-white transition-colors"
            >
              {t('common.contact')}
            </Link>
          </nav>
        </div>
        <div className="mt-4 sm:mt-8 border-t border-white/10 pt-4 sm:pt-8">
          <p className="text-center text-sm sm:text-base text-white/50">
            &copy; {new Date().getFullYear()} OptiDrop. {t('common.allRightsReserved')}
          </p>
        </div>
      </div>
    </footer>
  );
}