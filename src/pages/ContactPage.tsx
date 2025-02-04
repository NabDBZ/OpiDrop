import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Send, AlertTriangle, Loader2, Building2, Mail, Linkedin, Github, Globe, GraduationCap, Briefcase, Award, Heart } from 'lucide-react';
import { ContactForm } from '../components/ContactForm';
import { Credits } from '../components/Credits';
import { errorHandler } from '../utils/errorHandling';
import { debugLogger } from '../utils/debugLogger';
import { useTranslation } from 'react-i18next';

export function ContactPage() {
  const { t } = useTranslation();
  const [formStatus, setFormStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  const handleFormSubmit = async (formData: any) => {
    try {
      setFormStatus({ type: null, message: '' });
      
      // Simulate form submission delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Log form submission
      debugLogger.info('Contact form submitted:', formData);
      
      setFormStatus({
        type: 'success',
        message: t('contact.form.success')
      });
    } catch (error) {
      errorHandler.wrap(async () => {
        setFormStatus({
          type: 'error',
          message: t('contact.form.error')
        });
        throw error;
      });
    }
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="glass-card p-8 mb-12">
          <div className="flex justify-between items-center mb-8">
            <Link to="/" className="glass-button inline-flex items-center px-4 py-2 rounded-lg">
              <ArrowLeft className="h-5 w-5 mr-2" />
              {t('common.back')}
            </Link>
          </div>
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-4">{t('contact.title')}</h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              {t('contact.subtitle')}
            </p>
          </div>
        </div>

        <div className="grid gap-12 lg:grid-cols-2">
          {/* Contact Form Section */}
          <div className="glass-card p-8">
            <div className="flex items-center space-x-3 mb-8">
              <div className="w-12 h-12 rounded-xl bg-blue-600/20 flex items-center justify-center">
                <Mail className="w-6 h-6 text-blue-400" />
              </div>
              <h2 className="text-2xl font-bold text-white">{t('contact.getInTouch.title')}</h2>
            </div>
            
            <ContactForm onSubmit={handleFormSubmit} />

            {formStatus.type && (
              <div className={`mt-6 p-4 rounded-lg ${
                formStatus.type === 'success' 
                  ? 'bg-green-600/20 text-green-400' 
                  : 'bg-red-600/20 text-red-400'
              }`}>
                <div className="flex items-center space-x-2">
                  {formStatus.type === 'success' ? (
                    <Send className="w-5 h-5 flex-shrink-0" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                  )}
                  <p>{formStatus.message}</p>
                </div>
              </div>
            )}
          </div>

          {/* Credits Section */}
          <Credits />
        </div>
      </div>
    </div>
  );
}