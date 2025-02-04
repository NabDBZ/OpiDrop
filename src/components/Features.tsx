import React, { useState } from 'react';
import { Search, Filter, Clock, Calendar, Settings, CheckCircle2, Info, Play, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function Features() {
  const [activeFeature, setActiveFeature] = useState<number | null>(null);
  const { t } = useTranslation();

  const features = [
    {
      name: t('home.features.findMedications.title'),
      description: t('home.features.findMedications.description'),
      icon: Search,
      image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=800&q=80',
      steps: [
        t('home.features.findMedications.steps.0'),
        t('home.features.findMedications.steps.1'),
        t('home.features.findMedications.steps.2'),
        t('home.features.findMedications.steps.3')
      ],
      demo: 'https://images.unsplash.com/photo-1585435557343-3b092031a831?auto=format&fit=crop&w=800&q=80'
    },
    {
      name: t('home.features.customizeSchedule.title'),
      description: t('home.features.customizeSchedule.description'),
      icon: Settings,
      image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80',
      steps: [
        t('home.features.customizeSchedule.steps.0'),
        t('home.features.customizeSchedule.steps.1'),
        t('home.features.customizeSchedule.steps.2'),
        t('home.features.customizeSchedule.steps.3')
      ],
      demo: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?auto=format&fit=crop&w=800&q=80'
    },
    {
      name: t('home.features.trackProgress.title'),
      description: t('home.features.trackProgress.description'),
      icon: Calendar,
      image: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?auto=format&fit=crop&w=800&q=80',
      steps: [
        t('home.features.trackProgress.steps.0'),
        t('home.features.trackProgress.steps.1'),
        t('home.features.trackProgress.steps.2'),
        t('home.features.trackProgress.steps.3')
      ],
      demo: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80'
    }
  ];

  return (
    <div className="py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-6">
          <h2 className="text-4xl font-bold text-white mb-2">
            {t('home.features.title')}
          </h2>
          <p className="text-xl text-white/80">
            {t('home.features.subtitle')}
          </p>
        </div>

        <div className="flex justify-center items-center overflow-x-auto md:overflow-x-visible">
          <div className="flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-6 py-4">
            {features.map((feature, index) => (
              <React.Fragment key={feature.name}>
                <div 
                  className="glass-card w-full md:w-[280px] transform transition-all duration-300 hover:scale-105 flex-shrink-0"
                  onMouseEnter={() => setActiveFeature(index)}
                  onMouseLeave={() => setActiveFeature(null)}
                >
                  <div className="relative h-32 overflow-hidden rounded-t-xl">
                    <img
                      src={activeFeature === index ? feature.demo : feature.image}
                      alt={feature.name}
                      className="w-full h-full object-cover transition-opacity duration-500"
                    />
                    {activeFeature === index && (
                      <div className="absolute inset-0 bg-blue-600/20 flex items-center justify-center">
                        <Play className="w-8 h-8 text-white" />
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="flex items-center mb-2">
                      <div className="w-8 h-8 bg-blue-600/20 rounded-lg flex items-center justify-center">
                        <feature.icon className="h-4 w-4 text-blue-400" />
                      </div>
                      <h3 className="ml-2 text-lg font-semibold text-white">{feature.name}</h3>
                    </div>
                    <p className="text-white/80 mb-2 text-sm">{feature.description}</p>
                    <div className="space-y-1">
                      {feature.steps.map((step, stepIndex) => (
                        <div 
                          key={stepIndex}
                          className="flex items-center space-x-1.5 bg-white/5 p-1.5 rounded-lg"
                        >
                          <div className="w-1 h-1 bg-blue-400 rounded-full" />
                          <span className="text-xs text-white/90">{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                {index < features.length - 1 && (
                  <ArrowRight className="hidden md:block w-6 h-6 text-blue-400 flex-shrink-0 transform rotate-90 md:rotate-0 my-2 md:my-0" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}