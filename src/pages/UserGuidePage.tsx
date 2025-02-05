import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ArrowLeft, Droplet, Hand as HandWash, Clock, Eye, Timer, AlertCircle, Contact, BedDouble, Sparkles, XCircle, CheckCircle2, ArrowDownCircle, ChevronDown, ChevronUp, Play, Pause, RotateCcw, Printer, Share2, BookOpen, CheckCircle, HelpCircle } from 'lucide-react';
import { LucideIcon } from 'lucide-react';

interface GuideItem {
  icon: LucideIcon;
  title: string;
  description: string;
  tip?: string;
  demo?: string;
}

interface GuideStep {
  id: string;
  title: string;
  color: string;
  items: GuideItem[];
}

export function UserGuidePage() {
  const { t } = useTranslation();
  const [expandedStep, setExpandedStep] = useState<string | null>('preparation');
  const [activeDemo, setActiveDemo] = useState<string | null>(null);
  const [progress, setProgress] = useState<Record<string, boolean>>({});
  const [isSimulating, setIsSimulating] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isMobileView, setIsMobileView] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobileView(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const savedProgress = localStorage.getItem('userGuideProgress');
    if (savedProgress) {
      setProgress(JSON.parse(savedProgress));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('userGuideProgress', JSON.stringify(progress));
  }, [progress]);

  const steps: GuideStep[] = [
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

  const handleStepComplete = (stepId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setProgress(prev => ({
      ...prev,
      [stepId]: true
    }));
    
    if (isMobileView) {
      // Move to next step automatically on mobile
      const currentIndex = steps.findIndex(step => step.id === expandedStep);
      if (currentIndex < steps.length - 1) {
        setExpandedStep(steps[currentIndex + 1].id);
      }
    }
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
    <div className="min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12">
        {/* Header Section */}
        <div className="glass-card p-4 sm:p-8 mb-6 sm:mb-12">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 space-y-4 sm:space-y-0">
            <Link to="/" className="glass-button inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-sm sm:text-base">
              <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
              {t('common.back')}
            </Link>
            <div className="flex items-center space-x-2 sm:space-x-4 w-full sm:w-auto justify-end">
              <button className="glass-button px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-sm sm:text-base">
                <Printer className="h-4 w-4 sm:h-5 sm:w-5 sm:mr-2" />
                <span className="hidden sm:inline">Print Guide</span>
              </button>
              <button className="glass-button px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-sm sm:text-base">
                <Share2 className="h-4 w-4 sm:h-5 sm:w-5 sm:mr-2" />
                <span className="hidden sm:inline">Share</span>
              </button>
            </div>
          </div>
          <div className="text-center">
            <h1 className="text-2xl sm:text-4xl font-bold text-white mb-2 sm:mb-4">{t('guide.title')}</h1>
            <p className="text-base sm:text-xl text-white/90 max-w-3xl mx-auto">{t('guide.description')}</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="glass-card p-4 sm:p-8 mb-6 sm:mb-12">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-blue-600/20 flex items-center justify-center">
                <BookOpen className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
              </div>
              <span className="text-base sm:text-lg font-semibold text-white">Your Progress</span>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4 w-full sm:w-auto justify-end">
              <button
                onClick={startSimulation}
                disabled={isSimulating}
                className={`glass-button px-3 py-1.5 sm:px-6 sm:py-2.5 rounded-lg text-sm sm:text-base ${
                  isSimulating ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isSimulating ? (
                  <>
                    <Pause className="h-4 w-4 sm:h-5 sm:w-5 sm:mr-2" />
                    <span className="hidden sm:inline">Simulating...</span>
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 sm:h-5 sm:w-5 sm:mr-2" />
                    <span className="hidden sm:inline">Simulate Guide</span>
                  </>
                )}
              </button>
              <button
                onClick={resetProgress}
                className="glass-button px-3 py-1.5 sm:px-6 sm:py-2.5 rounded-lg text-sm sm:text-base text-red-400 hover:text-red-300"
              >
                <RotateCcw className="h-4 w-4 sm:h-5 sm:w-5 sm:mr-2" />
                <span className="hidden sm:inline">Reset Progress</span>
              </button>
            </div>
          </div>
          <div className="relative h-3 sm:h-4 bg-white/10 rounded-full overflow-hidden">
            <div 
              className="absolute inset-y-0 left-0 bg-blue-600/50 transition-all duration-500 rounded-full"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <div className="mt-2 sm:mt-3 flex justify-between text-xs sm:text-sm text-white/80">
            <span>Progress</span>
            <span>{progressPercentage}% Complete</span>
          </div>
        </div>

        {/* Guide Steps */}
        <div className="space-y-6">
          {steps.map((step, index) => {
            const isExpanded = expandedStep === step.id;
            const isComplete = progress[step.id];
            const colors = getColorClasses(step.color);
            const showStep = !isMobileView || isExpanded || (!isExpanded && index === steps.findIndex(s => !progress[s.id]));

            if (!showStep) return null;

            return (
              <div
                key={step.id}
                className={`glass-card transition-all duration-300 ${
                  isExpanded ? 'p-6' : 'p-4'
                }`}
              >
                <button
                  onClick={() => setExpandedStep(isExpanded ? null : step.id)}
                  className="w-full"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-xl ${colors.bg} flex items-center justify-center`}>
                        {isComplete ? (
                          <CheckCircle className={`h-5 w-5 ${colors.text}`} />
                        ) : (
                          <span className={`text-lg font-semibold ${colors.text}`}>{index + 1}</span>
                        )}
                      </div>
                      <h3 className={`text-lg font-semibold ${isComplete ? 'text-white/70' : 'text-white'}`}>
                        {step.title}
                      </h3>
                    </div>
                    {!isMobileView && (
                      <div className="flex items-center space-x-4">
                        {!isComplete && (
                          <button
                            onClick={(e) => handleStepComplete(step.id, e)}
                            className={`glass-button px-4 py-2 rounded-lg ${colors.text} ${colors.hover}`}
                          >
                            Mark as Done
                          </button>
                        )}
                        {isExpanded ? (
                          <ChevronUp className="h-5 w-5 text-white/70" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-white/70" />
                        )}
                      </div>
                    )}
                  </div>
                </button>

                {isExpanded && (
                  <div className="mt-6 space-y-6">
                    {step.items.map((item, itemIndex) => (
                      <div
                        key={itemIndex}
                        className={`p-4 rounded-xl ${colors.bg} ${colors.border} border`}
                      >
                        <div className="flex items-start space-x-4">
                          <div className={`p-2 rounded-lg ${colors.bg}`}>
                            <item.icon className={`h-5 w-5 ${colors.text}`} />
                          </div>
                          <div className="flex-1">
                            <h4 className={`font-medium ${colors.darkText} mb-2`}>
                              {item.title}
                            </h4>
                            <p className={`${colors.mediumText}`}>
                              {item.description}
                            </p>
                            {item.tip && (
                              <div className="mt-4 flex items-start space-x-2">
                                <HelpCircle className={`h-4 w-4 ${colors.text} mt-0.5`} />
                                <p className={`text-sm ${colors.text}`}>
                                  {item.tip}
                                </p>
                              </div>
                            )}
                          </div>
                          {isMobileView && !isComplete && (
                            <button
                              onClick={(e) => handleStepComplete(step.id, e)}
                              className="p-2 rounded-lg bg-white/10 hover:bg-white/20"
                            >
                              <CheckCircle className={`h-5 w-5 ${colors.text}`} />
                            </button>
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

        {/* Additional Tips Section */}
        <div className="mt-12 glass-card p-8">
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-purple-600/20 flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-purple-400" />
            </div>
            <h2 className="text-2xl font-semibold text-white">
              {t('guide.additionalTips.title')}
            </h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {['anxiety', 'contamination', 'missedDose'].map((tip, index) => (
              <div key={tip} className="glass-card p-6 hover:scale-[1.02] transition-transform">
                <div className="flex items-start space-x-3">
                  <AlertCircle className={`w-6 h-6 ${
                    index === 0 ? 'text-blue-400' :
                    index === 1 ? 'text-indigo-400' :
                    'text-purple-400'
                  }`} />
                  <div>
                    <h3 className="font-semibold text-white">
                      {t(`guide.additionalTips.${tip}.title`)}
                    </h3>
                    <p className="mt-2 text-white/80 text-sm leading-relaxed">
                      {t(`guide.additionalTips.${tip}.description`)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Help Button */}
        <button 
          className="fixed bottom-8 right-8 glass-button p-4 rounded-full"
          onClick={() => {/* Open help modal */}}
        >
          <HelpCircle className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}