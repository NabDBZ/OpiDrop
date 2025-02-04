import React, { useState } from 'react';
import { Search, Calendar, CheckCircle2, ArrowRight, Play } from 'lucide-react';

export function QuickGuide() {
  const [activeStep, setActiveStep] = useState<number | null>(null);

  const steps = [
    {
      title: 'Select Your Medications',
      description: 'Choose from our comprehensive database of eye medications',
      details: [
        'Search by medication or brand name',
        'Filter by category or effect',
        'View detailed drug information',
        'Compare different options'
      ],
      image: 'https://images.unsplash.com/photo-1585435557343-3b092031a831?auto=format&fit=crop&w=800&q=80',
      icon: Search
    },
    {
      title: 'Create Your Schedule',
      description: 'Get an optimized treatment schedule based on your prescriptions',
      details: [
        'Automatic sequence optimization',
        'Smart conflict detection',
        'Customizable time slots',
        'Duration management'
      ],
      image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80',
      icon: Calendar
    },
    {
      title: 'Track Your Progress',
      description: 'Monitor your treatment and stay on track with reminders',
      details: [
        'Mark completed doses',
        'View progress statistics',
        'Get smart reminders',
        'Share with your doctor'
      ],
      image: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?auto=format&fit=crop&w=800&q=80',
      icon: CheckCircle2
    }
  ];

  return (
    <div className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">How It Works</h2>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            Create your personalized eye drop schedule in three simple steps
          </p>
        </div>

        <div className="grid gap-12 lg:grid-cols-3">
          {steps.map((step, index) => (
            <div 
              key={index} 
              className="relative"
              onMouseEnter={() => setActiveStep(index)}
              onMouseLeave={() => setActiveStep(null)}
            >
              <div className="glass-card transform transition-all duration-300 hover:scale-105">
                <div className="relative h-48 overflow-hidden rounded-t-xl">
                  <img
                    src={step.image}
                    alt={step.title}
                    className="w-full h-full object-cover transition-transform duration-500 transform hover:scale-110"
                  />
                  {activeStep === index && (
                    <div className="absolute inset-0 bg-blue-600/20 flex items-center justify-center">
                      <Play className="w-16 h-16 text-white" />
                    </div>
                  )}
                </div>
                <div className="p-8">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-blue-600/20 rounded-xl flex items-center justify-center">
                      <step.icon className="h-6 w-6 text-blue-400" />
                    </div>
                    <h3 className="ml-4 text-2xl font-semibold text-white">{step.title}</h3>
                  </div>
                  <p className="text-white/80 mb-6">{step.description}</p>
                  <div className="space-y-3">
                    {step.details.map((detail, i) => (
                      <div 
                        key={i}
                        className="flex items-center space-x-2 bg-white/5 p-3 rounded-lg transition-colors hover:bg-white/10"
                      >
                        <div className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
                        <span className="text-sm text-white/90">{detail}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-6 transform -translate-y-1/2">
                  <ArrowRight className="w-8 h-8 text-blue-400" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}