import React, { useState } from 'react';
import { Search, Filter, Clock, Calendar, Settings, CheckCircle2, Info, Play } from 'lucide-react';
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
    <div className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            {t('home.features.title')}
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-white/80">
            {t('home.features.subtitle')}
          </p>
        </div>

        <div className="mt-16 space-y-16">
          {features.map((feature, index) => (
            <div 
              key={feature.name}
              className={`flex flex-col lg:flex-row gap-12 items-center ${
                index % 2 === 1 ? 'lg:flex-row-reverse' : ''
              }`}
            >
              <div className="flex-1">
                <div 
                  className="glass-card cursor-pointer transform transition-all duration-300 hover:scale-105"
                  onMouseEnter={() => setActiveFeature(index)}
                  onMouseLeave={() => setActiveFeature(null)}
                >
                  <div className="relative h-64">
                    <img
                      src={activeFeature === index ? feature.demo : feature.image}
                      alt={feature.name}
                      className="w-full h-full object-cover rounded-t-xl transition-opacity duration-500"
                    />
                    {activeFeature === index && (
                      <div className="absolute inset-0 bg-blue-600/20 flex items-center justify-center">
                        <Play className="w-16 h-16 text-white" />
                      </div>
                    )}
                  </div>
                  <div className="p-8">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="w-12 h-12 bg-blue-600/20 rounded-xl flex items-center justify-center">
                        <feature.icon className="h-6 w-6 text-blue-400" />
                      </div>
                      <h3 className="text-2xl font-bold text-white">{feature.name}</h3>
                    </div>
                    <p className="text-white/80 mb-6">{feature.description}</p>
                    <div className="grid grid-cols-2 gap-4">
                      {feature.steps.map((step, stepIndex) => (
                        <div 
                          key={stepIndex}
                          className="flex items-start space-x-2 bg-white/5 p-3 rounded-lg transform transition-transform hover:scale-105"
                        >
                          <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2" />
                          <span className="text-sm text-white/90">{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}