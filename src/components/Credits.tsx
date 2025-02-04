import React from 'react';
import { Building2, Mail, Linkedin, Globe, GraduationCap, Briefcase, Award, Heart } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function Credits() {
  const { t } = useTranslation();

  const credentials = [
    {
      icon: GraduationCap,
      title: t('credits.credentials.education.title'),
      items: t('credits.credentials.education.items', { returnObjects: true }) as string[]
    },
    {
      icon: Briefcase,
      title: t('credits.credentials.professional.title'),
      items: t('credits.credentials.professional.items', { returnObjects: true }) as string[]
    },
    {
      icon: Award,
      title: t('credits.credentials.projects.title'),
      items: t('credits.credentials.projects.items', { returnObjects: true }) as string[]
    }
  ];

  const technologies = [
    'React',
    'TypeScript',
    'Tailwind CSS',
    'Node.js',
    'Vite'
  ];

  return (
    <div className="glass-card p-4 sm:p-8">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-blue-600/20 flex items-center justify-center">
          <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-white">{t('credits.title')}</h2>
      </div>

      {/* Developer Info */}
      <div className="mb-6 sm:mb-8">
        <div className="glass-card p-4 sm:p-6 bg-white/5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6 mb-4 sm:mb-6">
            <div className="relative flex-shrink-0 mb-4 sm:mb-0">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden ring-2 ring-blue-400/30 backdrop-blur-sm mx-auto sm:mx-0">
                <img
                  src="https://media.licdn.com/dms/image/v2/D4E03AQHz4NpnjRFJtA/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1730384793075?e=1744243200&v=beta&t=US0c5KkyWOHBNabF3iOWKwmoDZHE3dSf_Ak6GhtLeq0"
                  alt="Nabil Naas Araba"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-2 -right-2 w-7 h-7 sm:w-8 sm:h-8 bg-blue-600/20 rounded-lg flex items-center justify-center backdrop-blur-sm ring-2 ring-blue-400/30">
                <Award className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-400" />
              </div>
            </div>
            <div className="text-center sm:text-left">
              <h4 className="text-lg sm:text-xl font-semibold text-white">Nabil Naas Araba</h4>
              <p className="text-blue-300 text-sm sm:text-base">{t('credits.developer.role')}</p>
            </div>
          </div>
          <div className="flex flex-wrap justify-center sm:justify-start gap-2 sm:gap-3">
            <a
              href="https://www.linkedin.com/in/nabil-naas-araba"
              target="_blank"
              rel="noopener noreferrer"
              className="glass-button px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg inline-flex items-center hover:bg-blue-500/20 text-sm sm:text-base"
            >
              <Linkedin className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
              LinkedIn
            </a>
            <a
              href="https://mdose.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="glass-button px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg inline-flex items-center hover:bg-blue-500/20 text-sm sm:text-base"
            >
              <Globe className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
              MDose AI
            </a>
          </div>
        </div>
      </div>

      {/* Credentials */}
      <div className="mb-6 sm:mb-8">
        <h3 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4">{t('credits.credentials.title')}</h3>
        <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {credentials.map((cred) => (
            <div key={cred.title} className="glass-card p-3 sm:p-4 bg-white/5">
              <div className="flex items-center space-x-2 sm:space-x-3 mb-2 sm:mb-3">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-blue-600/20 flex items-center justify-center">
                  <cred.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-400" />
                </div>
                <h4 className="font-medium text-white text-sm sm:text-base">{cred.title}</h4>
              </div>
              <ul className="space-y-1.5 sm:space-y-2">
                {cred.items.map((item) => (
                  <li key={item} className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                    <span className="text-white/90 text-xs sm:text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Technology Stack */}
      <div>
        <h3 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4">{t('credits.technology.title')}</h3>
        <div className="glass-card p-3 sm:p-4 bg-white/5">
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {technologies.map((tech) => (
              <span
                key={tech}
                className="px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg bg-blue-600/20 text-xs sm:text-sm text-blue-200 font-medium"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-white/10">
        <p className="text-center text-xs sm:text-sm text-blue-200">
          {t('credits.technology.madeWith')}
        </p>
      </div>
    </div>
  );
}