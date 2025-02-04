import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Construction } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function ArticlesPage() {
  const { t } = useTranslation();
  
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-7xl w-full px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <div className="absolute top-8 left-8">
          <Link to="/" className="glass-button inline-flex items-center px-4 py-2 rounded-lg">
            <ArrowLeft className="h-5 w-5 mr-2" />
            {t('articles.backHome')}
          </Link>
        </div>

        {/* Under Construction Content */}
        <div className="glass-card p-12 text-center">
          <div className="max-w-2xl mx-auto">
            <img
              src="https://static.vecteezy.com/system/resources/thumbnails/018/759/363/small_2x/white-6-panel-closed-door-isolated-png.png"
              alt="Coming Soon"
              className="w-96 h-96 mx-auto mb-12 opacity-80"
            />
            <div className="flex items-center justify-center space-x-3 mb-6">
              <Construction className="w-8 h-8 text-amber-400" />
              <h2 className="text-3xl font-bold text-white">{t('articles.title')}</h2>
            </div>
            <p className="text-white/80 text-xl">
              {t('articles.subtitle')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}