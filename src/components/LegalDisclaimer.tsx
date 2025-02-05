import React, { useState, useEffect } from 'react';
import { AlertTriangle, X } from 'lucide-react';

export function LegalDisclaimer() {
  const [isVisible, setIsVisible] = useState(true);
  const [isClosing, setIsClosing] = useState(false);

  const handleDismiss = () => {
    setIsClosing(true);
    setTimeout(() => setIsVisible(false), 300);
    localStorage.setItem('disclaimerAcknowledged', new Date().toISOString());
  };

  useEffect(() => {
    const acknowledged = localStorage.getItem('disclaimerAcknowledged');
    if (acknowledged) {
      const acknowledgedDate = new Date(acknowledged);
      const now = new Date();
      const daysSinceAcknowledged = (now.getTime() - acknowledgedDate.getTime()) / (1000 * 60 * 60 * 24);
      
      // Show disclaimer again after 7 days
      if (daysSinceAcknowledged > 7) {
        localStorage.removeItem('disclaimerAcknowledged');
      } else {
        setIsVisible(false);
      }
    }
  }, []);

  if (!isVisible) return null;

  return (
    <div className={`fixed bottom-0 left-0 right-0 z-50 p-4 transition-all duration-300 ${
      isClosing ? 'opacity-0 translate-y-full' : 'opacity-100 translate-y-0'
    }`}>
      <div className="max-w-7xl mx-auto">
        <div className="glass-card border-2 border-amber-400/50 p-6">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 rounded-xl bg-amber-600/20 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-amber-400" />
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <h3 className="text-lg font-semibold text-white mb-2">Medical Disclaimer / Avertissement Médical</h3>
                <button
                  onClick={handleDismiss}
                  className="glass-button p-1 rounded-lg hover:bg-white/10"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="prose prose-invert max-w-none">
                {/* English Version */}
                <div className="mb-6">
                  <p className="text-white/90 mb-4">
                    The Eye Drops Calendar Tool is intended for <strong>informational purposes only</strong>. 
                    This tool does <strong>not replace professional medical advice, diagnosis, or treatment</strong>. 
                    Users should consult a <strong>qualified healthcare professional</strong> for any medical 
                    concerns or decisions regarding their eye drop regimen.
                  </p>
                  <p className="text-white/90 mb-4">
                    The developer(s) of this website, including <strong>Nabil Naas Araba and MDose AI</strong>, 
                    <strong> assume no liability</strong> for any misuse, incorrect application of information, 
                    or medical outcomes resulting from reliance on this tool.
                  </p>
                  <p className="text-white/90">
                    For urgent medical concerns, please contact a <strong>medical professional or emergency 
                    services</strong> immediately.
                  </p>
                </div>

                {/* French Version */}
                <div className="pt-6 border-t border-white/10">
                  <p className="text-white/90 mb-4">
                    L'Outil de Calendrier des Gouttes Oculaires est destiné <strong>uniquement à des fins informatives</strong>. 
                    Cet outil <strong>ne remplace pas les conseils médicaux professionnels, le diagnostic ou le traitement</strong>. 
                    Les utilisateurs doivent consulter un <strong>professionnel de santé qualifié</strong> pour toute 
                    préoccupation médicale ou décision concernant leur traitement par gouttes oculaires.
                  </p>
                  <p className="text-white/90 mb-4">
                    Le(s) développeur(s) de ce site web, y compris <strong>Nabil Naas Araba et MDose AI</strong>, 
                    <strong> n'assument aucune responsabilité</strong> pour toute mauvaise utilisation, application incorrecte 
                    des informations ou résultats médicaux découlant de l'utilisation de cet outil.
                  </p>
                  <p className="text-white/90">
                    Pour toute urgence médicale, veuillez contacter immédiatement un <strong>professionnel de 
                    santé ou les services d'urgence</strong>.
                  </p>
                </div>
              </div>
              
              <div className="mt-6 flex items-center justify-end space-x-4">
                <button
                  onClick={handleDismiss}
                  className="glass-button px-6 py-2 rounded-lg bg-amber-600/20 hover:bg-amber-500/30"
                >
                  I Understand / Je Comprends
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}