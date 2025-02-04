import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, ArrowRight, Eye, Play } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function Hero() {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = React.useState(false);
  const { t } = useTranslation();

  return (
    <div className="relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative">
        <div className="relative pb-16 sm:pb-20 pt-8 sm:pt-12">
          <main className="mt-4 sm:mt-8">
            <div className="mx-auto max-w-7xl">
              <div className="flex justify-center px-2 sm:px-0">
                <div className="w-full sm:w-auto px-3 sm:px-6 sm:text-center md:max-w-2xl md:mx-auto lg:text-center">
                  <div className="glass-card rounded-xl sm:rounded-2xl p-4 sm:p-6">
                    <h1 className="mt-2 sm:mt-4 text-3xl sm:text-4xl tracking-tight font-extrabold text-white sm:mt-5 sm:text-6xl lg:mt-6 xl:text-6xl">
                      <span className="block">{t('home.hero.title.part1')}</span>
                      <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400 pb-2 sm:pb-3">
                        {t('home.hero.title.part2')}
                      </span>
                    </h1>
                    <p className="mt-2 sm:mt-3 text-sm sm:text-base text-white/80 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl">
                      {t('home.hero.description')}
                    </p>
                    <div className="mt-6 sm:mt-8">
                      <div className="space-y-3 sm:space-y-0 sm:flex sm:space-x-4">
                        <button
                          onClick={() => navigate('/calendar-tool')}
                          onMouseEnter={() => setIsHovered(true)}
                          onMouseLeave={() => setIsHovered(false)}
                          className="flex items-center justify-center w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-medium rounded-lg sm:rounded-xl text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transform transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl"
                        >
                          <div className="flex items-center space-x-2">
                            <Calendar className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-200 ${isHovered ? 'rotate-12' : ''}`} />
                            <span>{t('home.hero.createSchedule')}</span>
                            <ArrowRight className={`w-4 h-4 sm:w-5 sm:h-5 transition-all duration-200 ${isHovered ? 'translate-x-1' : ''}`} />
                          </div>
                        </button>
                        <button
                          onClick={() => navigate('/user-guide')}
                          className="glass-button flex items-center justify-center w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-medium rounded-lg sm:rounded-xl text-white hover:bg-white/20 transition-all duration-200"
                        >
                          <Eye className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2" />
                          {t('home.hero.watchTutorial')}
                          <Play className="w-3 h-3 sm:w-4 sm:h-4 ml-1.5 sm:ml-2" />
                        </button>
                      </div>
                      <p className="mt-3 sm:mt-4 text-xs sm:text-sm text-white/70 flex items-center justify-center">
                        <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full mr-1.5 sm:mr-2" />
                        {t('home.hero.noAccount')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}