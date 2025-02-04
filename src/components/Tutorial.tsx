import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ArrowLeft, Droplet, Hand as HandWash, Clock, Eye, Timer, AlertCircle, Contact, BedDouble, Sparkles, XCircle, CheckCircle2, ArrowDownCircle, ChevronDown, ChevronUp, Play, Pause, RotateCcw, Printer, Share2, BookOpen, CheckCircle, HelpCircle, Info } from 'lucide-react';
import { DrugSymbol } from './DrugSymbol';
import { drugColors } from '../data/drugTypes';

export function Tutorial() {
  const { t } = useTranslation();
  const [expandedStep, setExpandedStep] = useState<string | null>('preparation');
  const [activeDemo, setActiveDemo] = useState<string | null>(null);
  const [progress, setProgress] = useState<Record<string, boolean>>({});
  const [isSimulating, setIsSimulating] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [showTip, setShowTip] = useState<number | null>(null);

  useEffect(() => {
    const savedProgress = localStorage.getItem('userGuideProgress');
    if (savedProgress) {
      setProgress(JSON.parse(savedProgress));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('userGuideProgress', JSON.stringify(progress));
  }, [progress]);

  const steps = [
    {
      id: 'preparation',
      title: t('guide.preparation.title'),
      color: 'indigo',
      items: [
        {
          icon: HandWash,
          title: t('guide.preparation.hands.title'),
          description: t('guide.preparation.hands.description'),
          tip: t('guide.preparation.hands.tip'),
          demo: 'hands-demo'
        },
        {
          icon: Droplet,
          title: t('guide.preparation.bottle.title'),
          description: t('guide.preparation.bottle.description'),
          demo: 'bottle-demo'
        },
        {
          icon: Contact,
          title: t('guide.preparation.contacts.title'),
          description: t('guide.preparation.contacts.description'),
          demo: 'contacts-demo'
        }
      ]
    },
    {
      id: 'positioning',
      title: t('guide.positioning.title'),
      color: 'blue',
      items: [
        {
          icon: BedDouble,
          title: t('guide.positioning.comfort.title'),
          description: t('guide.positioning.comfort.description')
        },
        {
          icon: Eye,
          title: t('guide.positioning.pocket.title'),
          description: t('guide.positioning.pocket.description')
        },
        {
          icon: Sparkles,
          title: t('guide.positioning.hands.title'),
          description: t('guide.positioning.hands.description')
        }
      ]
    },
    {
      id: 'application',
      title: t('guide.application.title'),
      color: 'emerald',
      items: [
        {
          icon: ArrowDownCircle,
          title: t('guide.application.drops.title'),
          description: t('guide.application.drops.description')
        },
        {
          icon: XCircle,
          title: t('guide.application.close.title'),
          description: t('guide.application.close.description'),
          tip: t('guide.application.close.tip')
        },
        {
          icon: Timer,
          title: t('guide.application.tearduct.title'),
          description: t('guide.application.tearduct.description')
        }
      ]
    },
    {
      id: 'waiting',
      title: t('guide.waiting.title'),
      color: 'amber',
      items: [
        {
          icon: Clock,
          title: t('guide.waiting.multiple.title'),
          description: t('guide.waiting.multiple.description')
        }
      ]
    },
    {
      id: 'aftercare',
      title: t('guide.aftercare.title'),
      color: 'purple',
      items: [
        {
          icon: CheckCircle2,
          title: t('guide.aftercare.cleanup.title'),
          description: t('guide.aftercare.cleanup.description')
        },
        {
          icon: Droplet,
          title: t('guide.aftercare.storage.title'),
          description: t('guide.aftercare.storage.description')
        },
        {
          icon: Contact,
          title: t('guide.aftercare.contacts.title'),
          description: t('guide.aftercare.contacts.description')
        }
      ]
    }
  ];

  const quickReferenceSymbols = [
    { 
      symbol: 'petri-dish', 
      label: 'Antibiotics', 
      description: 'For treating eye infections',
      category: 'antibiotics',
      effect: 'antibiotics'
    },
    { 
      symbol: 'leaf', 
      label: 'NSAIDs', 
      description: 'For pain and inflammation',
      category: 'nsaids',
      effect: 'nsaids'
    },
    { 
      symbol: 'sun', 
      label: 'Corticosteroids', 
      description: 'For reducing inflammation',
      category: 'corticosteroids',
      effect: 'corticosteroids'
    },
    { 
      symbol: 'shield', 
      label: 'Antihistamines', 
      description: 'For allergic reactions',
      category: 'antihistamines',
      effect: 'antihistamines'
    },
    { 
      symbol: 'eye', 
      label: 'Parasympathomimetics', 
      description: 'Cholinergic medications',
      category: 'parasympathomimetics',
      effect: 'parasympathomimetics'
    },
    { 
      symbol: 'sunglasses', 
      label: 'Parasympatholytics', 
      description: 'Pupil dilation drops',
      category: 'parasympatholytics',
      effect: 'parasympatholytics'
    },
    { 
      symbol: 'stop', 
      label: 'Beta Blockers', 
      description: 'Pressure-lowering drops',
      category: 'sympatholytics',
      effect: 'sympatholytics'
    },
    { 
      symbol: 'triangle', 
      label: 'Alpha Agonists', 
      description: 'IOP-reducing drops',
      category: 'alpha_agonists',
      effect: 'alpha_agonists'
    },
    { 
      symbol: 'droplet', 
      label: 'Carbonic Inhibitors', 
      description: 'Aqueous suppressants',
      category: 'carbonic_inhibitors',
      effect: 'carbonic_inhibitors'
    },
    { 
      symbol: 'wave', 
      label: 'Prostaglandins', 
      description: 'Outflow enhancers',
      category: 'prostaglandins',
      effect: 'prostaglandins'
    }
  ];

  const handleStepComplete = (stepId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setProgress(prev => ({
      ...prev,
      [stepId]: true
    }));
  };

  const resetProgress = () => {
    setProgress({});
    localStorage.removeItem('userGuideProgress');
  };

  const startSimulation = () => {
    setIsSimulating(true);
    setCurrentStep(0);
    setExpandedStep('preparation');
    
    const simulateSteps = async () => {
      for (let i = 0; i < steps.length; i++) {
        setCurrentStep(i);
        setExpandedStep(steps[i].id);
        await new Promise(resolve => setTimeout(resolve, 3000));
        handleStepComplete(steps[i].id, {} as React.MouseEvent);
      }
      setIsSimulating(false);
    };
    
    simulateSteps();
  };

  const getColorClasses = (color: string) => ({
    bg: `bg-${color}-50`,
    text: `text-${color}-600`,
    border: `border-${color}-200`,
    hover: `hover:bg-${color}-100`,
    darkText: `text-${color}-900`,
    mediumText: `text-${color}-700`
  });

  const progressPercentage = Math.round(
    (Object.values(progress).filter(Boolean).length / steps.length) * 100
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Progress Bar */}
        <div className="mb-8 bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <BookOpen className="h-5 w-5 text-blue-600 mr-2" />
              <span className="font-medium text-gray-900">Your Progress</span>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={startSimulation}
                disabled={isSimulating}
                className={`flex items-center px-4 py-2 rounded-md transition-colors ${
                  isSimulating 
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                }`}
              >
                {isSimulating ? (
                  <>
                    <Pause className="h-5 w-5 mr-2" />
                    Simulating...
                  </>
                ) : (
                  <>
                    <Play className="h-5 w-5 mr-2" />
                    Simulate Guide
                  </>
                )}
              </button>
              <button
                onClick={resetProgress}
                className="flex items-center px-4 py-2 text-red-600 hover:text-red-700 transition-colors"
              >
                <RotateCcw className="h-5 w-5 mr-2" />
                Reset Progress
              </button>
            </div>
          </div>
          <div className="bg-gray-100 rounded-full h-4 overflow-hidden">
            <div 
              className="bg-blue-600 h-full transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <div className="mt-2 text-sm text-gray-600 text-right">
            {progressPercentage}% Complete
          </div>
        </div>

        {/* Steps Section */}
        <div className="space-y-8">
          {steps.map((step, stepIndex) => {
            const colors = getColorClasses(step.color);
            const isExpanded = expandedStep === step.id;
            const isComplete = progress[step.id];
            const isActive = currentStep === stepIndex && isSimulating;

            return (
              <div 
                key={step.id} 
                className={`bg-white rounded-xl shadow-sm transition-all duration-300 transform ${
                  isExpanded ? 'scale-102' : ''
                } ${isActive ? 'ring-2 ring-blue-400' : ''}`}
              >
                <div
                  onClick={() => setExpandedStep(isExpanded ? null : step.id)}
                  className={`p-6 flex items-center justify-between ${colors.hover} rounded-t-xl transition-colors cursor-pointer`}
                >
                  <div className="flex items-center">
                    <div className={`flex items-center justify-center w-12 h-12 rounded-full ${
                      isComplete ? 'bg-green-100 text-green-600' : `${colors.bg} ${colors.text}`
                    } mr-4 transition-colors`}>
                      {isComplete ? (
                        <CheckCircle className="w-6 h-6" />
                      ) : (
                        <span className="text-xl font-bold">{stepIndex + 1}</span>
                      )}
                    </div>
                    <h2 className="text-2xl font-semibold text-gray-900">{step.title}</h2>
                  </div>
                  <div className="flex items-center space-x-4">
                    {!isComplete && (
                      <div
                        onClick={(e) => handleStepComplete(step.id, e)}
                        className={`px-4 py-2 rounded-md ${colors.bg} ${colors.text} hover:opacity-90 transition-opacity cursor-pointer`}
                      >
                        Mark Complete
                      </div>
                    )}
                    {isExpanded ? (
                      <ChevronUp className={`w-6 h-6 ${colors.text}`} />
                    ) : (
                      <ChevronDown className={`w-6 h-6 ${colors.text}`} />
                    )}
                  </div>
                </div>

                {isExpanded && (
                  <div className="p-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {step.items.map((item) => (
                      <div 
                        key={item.title}
                        className={`relative bg-white rounded-xl border ${colors.border} p-6 transition-all duration-300 hover:scale-105 hover:shadow-md`}
                      >
                        <div className={`absolute -top-4 -left-4 w-12 h-12 ${colors.bg} rounded-xl flex items-center justify-center shadow-sm`}>
                          <item.icon className={`w-6 h-6 ${colors.text}`} />
                        </div>
                        <div className="pt-6">
                          <h3 className={`text-lg font-semibold ${colors.darkText} mb-2`}>
                            {item.title}
                          </h3>
                          <p className="text-gray-600">{item.description}</p>
                          {item.tip && (
                            <div className={`mt-4 p-3 ${colors.bg} rounded-lg flex items-start`}>
                              <AlertCircle className={`w-5 h-5 ${colors.text} mr-2 flex-shrink-0 mt-0.5`} />
                              <p className={`text-sm ${colors.mediumText}`}>{item.tip}</p>
                            </div>
                          )}
                          {item.demo && (
                            <div
                              onClick={() => setActiveDemo(activeDemo === item.demo ? null : item.demo)}
                              className={`mt-4 w-full px-4 py-2 rounded-md border ${colors.border} ${colors.text} hover:${colors.bg} transition-colors flex items-center justify-center cursor-pointer`}
                            >
                              {activeDemo === item.demo ? (
                                <>
                                  <Pause className="w-4 h-4 mr-2" />
                                  Stop Demo
                                </>
                              ) : (
                                <>
                                  <Play className="w-4 h-4 mr-2" />
                                  Watch Demo
                                </>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Updated Quick Reference Guide */}
        <div className="mt-16 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-6 mb-8">
          <div className="flex items-center space-x-2 mb-4">
            <Info className="h-5 w-5 text-blue-600" />
            <span className="text-base font-semibold text-gray-900">Medication Categories</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {quickReferenceSymbols.map((item) => {
              const colors = drugColors[item.effect];
              return (
                <div 
                  key={item.symbol} 
                  className="relative group"
                  data-category={item.category}
                >
                  <div className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-200">
                    <div className="flex flex-col items-center text-center space-y-2">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colors.bg}`}>
                        <DrugSymbol symbol={item.symbol as any} className="text-xl" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 text-sm">{item.label}</div>
                        <div className="text-xs text-gray-500 mt-1">{item.description}</div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Additional Help Button */}
        <button 
          className="fixed bottom-8 right-8 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
          onClick={() => {/* Open help modal */}}
        >
          <HelpCircle className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}