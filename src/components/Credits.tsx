import React from 'react';
import { Building2, Mail, Linkedin, Globe, GraduationCap, Briefcase, Award, Heart } from 'lucide-react';

export function Credits() {
  const credentials = [
    {
      icon: GraduationCap,
      title: 'Education',
      items: [
        'Pharm.D. Candidate (2025)',
        'MBA Candidate (2026)',
        'Université Laval'
      ]
    },
    {
      icon: Briefcase,
      title: 'Professional',
      items: [
        'Co-founder of MDose AI',
        'Expert in pharmacy practice',
        'AI-driven healthcare solutions'
      ]
    },
    {
      icon: Award,
      title: 'Projects',
      items: [
        'Decipher.doctor - Rx translation',
        'AnnoMD - Medical annotation',
        'MediScri - Clinical data entry'
      ]
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
    <div className="glass-card p-8">
      <div className="flex items-center space-x-3 mb-8">
        <div className="w-12 h-12 rounded-xl bg-blue-600/20 flex items-center justify-center">
          <Heart className="w-6 h-6 text-blue-400" />
        </div>
        <h2 className="text-2xl font-bold text-white">Credits</h2>
      </div>

      {/* Developer Info */}
      <div className="mb-8">
        <div className="glass-card p-6 bg-white/5">
          <div className="flex items-center space-x-6 mb-6">
            <div className="relative flex-shrink-0">
              <div className="w-24 h-24 rounded-xl overflow-hidden ring-2 ring-blue-400/30 backdrop-blur-sm">
                <img
                  src="https://media.licdn.com/dms/image/v2/D4E03AQHz4NpnjRFJtA/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1730384793075?e=1744243200&v=beta&t=US0c5KkyWOHBNabF3iOWKwmoDZHE3dSf_Ak6GhtLeq0"
                  alt="Nabil Naas Araba"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-blue-600/20 rounded-lg flex items-center justify-center backdrop-blur-sm ring-2 ring-blue-400/30">
                <Award className="w-4 h-4 text-blue-400" />
              </div>
            </div>
            <div>
              <h4 className="text-xl font-semibold text-white">Nabil Naas Araba</h4>
              <p className="text-blue-300">Healthcare Technology Innovator</p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <a
              href="https://www.linkedin.com/in/nabil-naas-araba"
              target="_blank"
              rel="noopener noreferrer"
              className="glass-button px-4 py-2 rounded-lg inline-flex items-center hover:bg-blue-500/20"
            >
              <Linkedin className="w-4 h-4 mr-2" />
              LinkedIn
            </a>
            <a
              href="https://mdose.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="glass-button px-4 py-2 rounded-lg inline-flex items-center hover:bg-blue-500/20"
            >
              <Globe className="w-4 h-4 mr-2" />
              MDose AI
            </a>
          </div>
        </div>
      </div>

      {/* Credentials */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-white mb-4">Credentials</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {credentials.map((cred) => (
            <div key={cred.title} className="glass-card p-4 bg-white/5">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-8 h-8 rounded-lg bg-blue-600/20 flex items-center justify-center">
                  <cred.icon className="w-4 h-4 text-blue-400" />
                </div>
                <h4 className="font-medium text-white">{cred.title}</h4>
              </div>
              <ul className="space-y-2">
                {cred.items.map((item) => (
                  <li key={item} className="flex items-center space-x-2 text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                    <span className="text-white/90">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Technology Stack */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Technology Stack</h3>
        <div className="glass-card p-4 bg-white/5">
          <div className="flex flex-wrap gap-2">
            {technologies.map((tech) => (
              <span
                key={tech}
                className="px-3 py-1.5 rounded-lg bg-blue-600/20 text-sm text-blue-200 font-medium"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 pt-6 border-t border-white/10">
        <p className="text-center text-blue-200">
          Made with ❤️ by the MDose AI team
        </p>
      </div>
    </div>
  );
}