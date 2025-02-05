import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ArrowLeft, Droplet, Hand as HandWash, Clock, Eye, Timer, AlertCircle, Contact, BedDouble, Sparkles, XCircle, CheckCircle2, ArrowDownCircle, ChevronDown, ChevronUp, Play, Pause, RotateCcw, Printer, Share2, BookOpen, CheckCircle, HelpCircle, ArrowRight } from 'lucide-react';
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
  const [expandedStep, setExpandedStep] = useState<string | null>(null);
  const [activeDemo, setActiveDemo] = useState<string | null>(null);
  const [progress, setProgress] = useState<Record<string, boolean>>({});
  const [isSimulating, setIsSimulating] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isMobileView, setIsMobileView] = useState(false);
  const [showCompletionMessage, setShowCompletionMessage] = useState(false);

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
      const parsedProgress = JSON.parse(savedProgress);
      setProgress(parsedProgress);
      // Find the first incomplete step
      const firstIncompleteStep = steps.find(step => !parsedProgress[step.id]);
      setExpandedStep(firstIncompleteStep?.id || steps[0].id);
    } else {
      setExpandedStep(steps[0].id);
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
    const newProgress = {
      ...progress,
      [stepId]: true
    };
    setProgress(newProgress);
    
    // Check if this was the last step
    const isLastStep = stepId === steps[steps.length - 1].id;
    const allCompleted = steps.every(step => newProgress[step.id]);
    
    if (isLastStep && allCompleted) {
      setShowCompletionMessage(true);
      // Hide message after 5 seconds
      setTimeout(() => setShowCompletionMessage(false), 5000);
    } else {
      // Move to next step automatically
      const currentIndex = steps.findIndex(step => step.id === expandedStep);
      if (currentIndex < steps.length - 1) {
        setExpandedStep(steps[currentIndex + 1].id);
      }
    }
  };

  const resetProgress = () => {
    setProgress({});
    localStorage.removeItem('userGuideProgress');
    setExpandedStep(steps[0].id);
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
        {/* Success Message */}
        {showCompletionMessage && (
          <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-4 duration-200">
            <div className="glass-card bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2">
              <CheckCircle className="h-5 w-5" />
              <span className="font-medium">Congratulations! You've completed the guide!</span>
            </div>
          </div>
        )}
        
        {/* Header Section */}
        <div className="glass-card p-4 sm:p-8 mb-6">
          <div className="flex justify-between items-center mb-6">
            <Link to="/" className="glass-button inline-flex items-center px-3 py-1.5 rounded-lg text-sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t('common.back')}
            </Link>
            <button className="glass-button px-3 py-1.5 rounded-lg text-sm">
              <Share2 className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Share</span>
            </button>
          </div>
          <div className="text-center">
            <h1 className="text-2xl sm:text-4xl font-bold text-white mb-2">{t('guide.title')}</h1>
            <p className="text-base sm:text-xl text-white/90 max-w-3xl mx-auto">{t('guide.description')}</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="glass-card p-4 sm:p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-xl bg-blue-600/20 flex items-center justify-center">
                <BookOpen className="h-4 w-4 text-white" />
              </div>
              <span className="text-base font-semibold text-white">Progress: {progressPercentage}%</span>
            </div>
            <button
              onClick={resetProgress}
              className="text-sm glass-button px-3 py-1.5 rounded-lg inline-flex items-center"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </button>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Guide Steps */}
        <div className="space-y-4">
          {steps.map((step, index) => {
            const colors = getColorClasses(step.color);
            const isExpanded = expandedStep === step.id;
            const isComplete = progress[step.id];
            const isPrevious = steps.slice(0, index).every(s => progress[s.id]);
            const isAccessible = isPrevious || isComplete;

            return (
              <div
                key={step.id}
                className={`glass-card transition-all duration-300 ${
                  isAccessible ? 'opacity-100' : 'opacity-50'
                }`}
              >
                <button
                  onClick={() => isAccessible && setExpandedStep(isExpanded ? null : step.id)}
                  className="w-full px-4 py-3 sm:px-6 sm:py-4 flex items-center justify-between"
                  disabled={!isAccessible}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      isComplete ? 'bg-green-500' : 'bg-gray-500/20'
                    }`}>
                      {isComplete ? (
                        <CheckCircle className="h-5 w-5 text-white" />
                      ) : (
                        <span className="text-white font-medium">{index + 1}</span>
                      )}
                    </div>
                    <span className="font-medium text-white">{step.title}</span>
                  </div>
                  {isAccessible && (
                    <div className="flex items-center space-x-2">
                      {isComplete ? (
                        <div className="px-4 py-2 rounded-lg bg-green-500 text-white flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4" />
                          <span>Completed</span>
                        </div>
                      ) : (
                        <button
                          onClick={(e) => handleStepComplete(step.id, e)}
                          className="glass-button-primary px-4 py-2 rounded-lg text-sm inline-flex items-center"
                        >
                          {index === steps.length - 1 ? (
                            <>
                              Complete Guide
                              <CheckCircle className="h-4 w-4 ml-2" />
                            </>
                          ) : (
                            <>
                              Next Step
                              <ArrowRight className="h-4 w-4 ml-2" />
                            </>
                          )}
                        </button>
                      )}
                      {isExpanded ? (
                        <ChevronUp className="h-5 w-5 text-white" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-white" />
                      )}
                    </div>
                  )}
                </button>

                {isExpanded && (
                  <div className="px-4 pb-4 sm:px-6 sm:pb-6 space-y-4">
                    {step.items.map((item, itemIndex) => (
                      <div
                        key={itemIndex}
                        className="glass-card-inner p-4 rounded-lg space-y-3"
                      >
                        <div className="flex items-start space-x-3">
                          <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                            <item.icon className="h-5 w-5 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-medium text-white">{item.title}</h3>
                            <p className="text-white/80 text-sm mt-1">{item.description}</p>
                            {item.tip && (
                              <div className="mt-2 flex items-start space-x-2 text-amber-300">
                                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                                <p className="text-sm">{item.tip}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    <div className="flex justify-between items-center pt-4">
                      {index > 0 && (
                        <button
                          onClick={() => setExpandedStep(steps[index - 1].id)}
                          className="glass-button px-4 py-2 rounded-lg text-sm inline-flex items-center"
                        >
                          <ArrowLeft className="h-4 w-4 mr-2" />
                          Previous
                        </button>
                      )}
                      <button
                        onClick={(e) => handleStepComplete(step.id, e)}
                        className="glass-button-primary px-4 py-2 rounded-lg text-sm inline-flex items-center ml-auto"
                      >
                        {index === steps.length - 1 ? (
                          <>
                            Complete Guide
                            <CheckCircle className="h-4 w-4 ml-2" />
                          </>
                        ) : (
                          <>
                            Next Step
                            <ArrowRight className="h-4 w-4 ml-2" />
                          </>
                        )}
                      </button>
                    </div>
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