import React, { useState } from 'react';
import { Send, AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface FormErrors {
  [key: string]: string;
}

interface ContactFormProps {
  onSubmit: (data: FormData) => Promise<void>;
}

export function ContactForm({ onSubmit }: ContactFormProps) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: 'General Inquiry',
    message: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = t('contact.form.errors.nameRequired');
    }

    if (!formData.email.trim()) {
      newErrors.email = t('contact.form.errors.emailRequired');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t('contact.form.errors.emailInvalid');
    }

    if (!formData.subject) {
      newErrors.subject = t('contact.form.errors.subjectRequired');
    }

    if (!formData.message.trim()) {
      newErrors.message = t('contact.form.errors.messageRequired');
    } else if (formData.message.trim().length < 20) {
      newErrors.message = t('contact.form.errors.messageLength');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      setFormData({
        name: '',
        email: '',
        subject: 'General Inquiry',
        message: ''
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6" noValidate>
      {/* Name Field */}
      <div>
        <label htmlFor="name" className="block text-base sm:text-lg font-medium text-white mb-1.5 sm:mb-2">
          {t('contact.form.name')}
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className={`glass-input w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-base sm:text-lg bg-white/10 border ${
            errors.name ? 'border-red-400' : 'border-white/20 focus:border-blue-400'
          } placeholder-white/40`}
          placeholder={t('contact.form.namePlaceholder')}
        />
        {errors.name && (
          <div className="mt-1.5 flex items-center text-sm sm:text-base text-red-400">
            <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2" />
            {errors.name}
          </div>
        )}
      </div>

      {/* Email Field */}
      <div>
        <label htmlFor="email" className="block text-base sm:text-lg font-medium text-white mb-1.5 sm:mb-2">
          {t('contact.form.email')}
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className={`glass-input w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-base sm:text-lg bg-white/10 border ${
            errors.email ? 'border-red-400' : 'border-white/20 focus:border-blue-400'
          } placeholder-white/40`}
          placeholder={t('contact.form.emailPlaceholder')}
        />
        {errors.email && (
          <div className="mt-1.5 flex items-center text-sm sm:text-base text-red-400">
            <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2" />
            {errors.email}
          </div>
        )}
      </div>

      {/* Subject Field */}
      <div>
        <label htmlFor="subject" className="block text-base sm:text-lg font-medium text-white mb-1.5 sm:mb-2">
          {t('contact.form.subject')}
        </label>
        <select
          id="subject"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          className="glass-input w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-base sm:text-lg bg-white/10 border border-white/20 focus:border-blue-400 text-white"
        >
          <option value="General Inquiry" className="bg-gray-900 text-white">{t('contact.form.subjects.general')}</option>
          <option value="Bug Report" className="bg-gray-900 text-white">{t('contact.form.subjects.bug')}</option>
          <option value="Feature Request" className="bg-gray-900 text-white">{t('contact.form.subjects.feature')}</option>
          <option value="Business Inquiry" className="bg-gray-900 text-white">{t('contact.form.subjects.business')}</option>
        </select>
      </div>

      {/* Message Field */}
      <div>
        <label htmlFor="message" className="block text-base sm:text-lg font-medium text-white mb-1.5 sm:mb-2">
          {t('contact.form.message')}
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          rows={5}
          className={`glass-input w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-base sm:text-lg bg-white/10 border resize-none ${
            errors.message ? 'border-red-400' : 'border-white/20 focus:border-blue-400'
          } placeholder-white/40`}
          placeholder={t('contact.form.messagePlaceholder')}
        />
        {errors.message && (
          <div className="mt-1.5 flex items-center text-sm sm:text-base text-red-400">
            <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2" />
            {errors.message}
          </div>
        )}
      </div>

      {/* Submit Button */}
      <div className="flex justify-center pt-2 sm:pt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className={`glass-button px-6 sm:px-8 py-2 sm:py-3 rounded-lg inline-flex items-center justify-center text-base sm:text-lg font-medium bg-blue-600/30 hover:bg-blue-500/40 transition-colors ${
            isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isSubmitting ? (
            <>
              <span className="animate-spin mr-1.5 sm:mr-2">
                <Send className="w-4 h-4 sm:w-5 sm:h-5" />
              </span>
              <span>{t('contact.form.sending')}</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2" />
              <span>{t('contact.form.send')}</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}