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
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="relative pb-8 pt-12 sm:pb-12 sm:pt-16">
          <main className="mt-8 sm:mt-12">
            <div className="mx-auto max-w-7xl">
              <div className="flex justify-center">
                <div className="px-4 sm:px-6 sm:text-center md:max-w-2xl md:mx-auto lg:text-center lg:flex lg:items-center">
                  <div className="backdrop-blur-sm bg-white/5 rounded-2xl p-6 shadow-lg border border-white/20">
                    <h1 className="mt-4 text-4xl tracking-tight font-extrabold text-white sm:mt-5 sm:text-6xl lg:mt-6 xl:text-6xl">
                      <span className="block">{t('home.hero.title.part1')}</span>
                      <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400 pb-3">
                        {t('home.hero.title.part2')}
                      </span>
                    </h1>
                    <p className="mt-3 text-base text-white/80 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl">
                      {t('home.hero.description')}
                    </p>
                    <div className="mt-8 sm:mt-12">
                      <div className="space-y-4 sm:space-y-0 sm:flex sm:space-x-4">
                        <button
                          onClick={() => navigate('/calendar-tool')}
                          onMouseEnter={() => setIsHovered(true)}
                          onMouseLeave={() => setIsHovered(false)}
                          className="flex items-center justify-center w-full sm:w-auto px-8 py-4 text-base font-medium rounded-xl text-white bg-gradient-to-r from-blue-600/90 to-indigo-600/90 hover:from-blue-700/90 hover:to-indigo-700/90 transform transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl backdrop-blur-sm"
                        >
                          <div className="flex items-center space-x-2">
                            <Calendar className={`w-5 h-5 transition-transform duration-200 ${isHovered ? 'rotate-12' : ''}`} />
                            <span>{t('home.hero.createSchedule')}</span>
                            <ArrowRight className={`w-5 h-5 transition-all duration-200 ${isHovered ? 'translate-x-1' : ''}`} />
                          </div>
                        </button>
                        <button
                          onClick={() => navigate('/user-guide')}
                          className="flex items-center justify-center w-full sm:w-auto px-8 py-4 text-base font-medium rounded-xl text-blue-700 bg-blue-50/30 hover:bg-blue-100/30 backdrop-blur-sm transition-all duration-200"
                        >
                          <Eye className="w-5 h-5 mr-2" />
                          {t('home.hero.watchTutorial')}
                          <Play className="w-4 h-4 ml-2" />
                        </button>
                      </div>
                      <p className="mt-4 text-sm text-gray-700 flex items-center justify-center">
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-2" />
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