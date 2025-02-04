import React, { useState } from 'react';
import { Send, AlertCircle } from 'lucide-react';

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
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.subject) {
      newErrors.subject = 'Please select a subject';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 20) {
      newErrors.message = 'Message must be at least 20 characters long';
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
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      {/* Name Field */}
      <div>
        <label htmlFor="name" className="block text-lg font-medium text-white mb-2">
          Full Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className={`glass-input w-full px-4 py-3 rounded-lg text-lg bg-white/10 border ${
            errors.name ? 'border-red-400' : 'border-white/20 focus:border-blue-400'
          } placeholder-white/40`}
          placeholder="Enter your full name"
        />
        {errors.name && (
          <div className="mt-2 flex items-center text-base text-red-400">
            <AlertCircle className="w-5 h-5 mr-2" />
            {errors.name}
          </div>
        )}
      </div>

      {/* Email Field */}
      <div>
        <label htmlFor="email" className="block text-lg font-medium text-white mb-2">
          Email Address
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className={`glass-input w-full px-4 py-3 rounded-lg text-lg bg-white/10 border ${
            errors.email ? 'border-red-400' : 'border-white/20 focus:border-blue-400'
          } placeholder-white/40`}
          placeholder="Enter your email address"
        />
        {errors.email && (
          <div className="mt-2 flex items-center text-base text-red-400">
            <AlertCircle className="w-5 h-5 mr-2" />
            {errors.email}
          </div>
        )}
      </div>

      {/* Subject Field */}
      <div>
        <label htmlFor="subject" className="block text-lg font-medium text-white mb-2">
          Subject
        </label>
        <select
          id="subject"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          className="glass-input w-full px-4 py-3 rounded-lg text-lg bg-white/10 border border-white/20 focus:border-blue-400 text-white"
        >
          <option value="General Inquiry" className="bg-gray-900 text-white">General Inquiry</option>
          <option value="Bug Report" className="bg-gray-900 text-white">Bug Report</option>
          <option value="Feature Request" className="bg-gray-900 text-white">Feature Request</option>
          <option value="Business Inquiry" className="bg-gray-900 text-white">Business Inquiry</option>
        </select>
      </div>

      {/* Message Field */}
      <div>
        <label htmlFor="message" className="block text-lg font-medium text-white mb-2">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          rows={5}
          className={`glass-input w-full px-4 py-3 rounded-lg text-lg bg-white/10 border resize-none ${
            errors.message ? 'border-red-400' : 'border-white/20 focus:border-blue-400'
          } placeholder-white/40`}
          placeholder="Enter your message (minimum 20 characters)"
        />
        {errors.message && (
          <div className="mt-2 flex items-center text-base text-red-400">
            <AlertCircle className="w-5 h-5 mr-2" />
            {errors.message}
          </div>
        )}
      </div>

      {/* Submit Button */}
      <div className="flex justify-center">
        <button
          type="submit"
          disabled={isSubmitting}
          className={`glass-button px-8 py-3 rounded-lg inline-flex items-center justify-center text-lg font-medium bg-blue-600/30 hover:bg-blue-500/40 transition-colors ${
            isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isSubmitting ? (
            <>
              <span className="animate-spin mr-2">
                <Send className="w-5 h-5" />
              </span>
              <span>Sending...</span>
            </>
          ) : (
            <>
              <Send className="w-5 h-5 mr-2" />
              <span>Send Message</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}