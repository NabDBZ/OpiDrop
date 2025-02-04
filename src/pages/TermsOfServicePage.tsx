import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function TermsOfServicePage() {
  const { t } = useTranslation();

  // Helper function to safely handle array translations
  const getTranslationArray = (key: string): string[] => {
    const value = t(key, { returnObjects: true });
    return Array.isArray(value) ? value : [];
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="glass-card p-8 mb-8">
          <div className="flex justify-between items-center mb-8">
            <Link to="/" className="glass-button inline-flex items-center px-4 py-2 rounded-lg">
              <ArrowLeft className="h-5 w-5 mr-2" />
              {t('common.back')}
            </Link>
          </div>
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-4">{t('termsOfService.title')}</h1>
            <div className="text-white/80">
              <p>{t('termsOfService.effectiveDate')}: 03/02/2025</p>
              <p>{t('termsOfService.lastUpdated')}: 04/02/2025</p>
            </div>
          </div>
        </div>

        {/* Terms Content */}
        <div className="glass-card p-8">
          <div className="prose prose-invert max-w-none">
            <p className="text-white/90 mb-8">
              {t('termsOfService.agree')}
            </p>

            <p className="text-white/90 mb-12">
              {t('termsOfService.disagree')}
            </p>

            {/* Description of Service */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-4">
                1. {t('termsOfService.sections.description.title')}
              </h2>
              <p className="text-white/90 mb-6">
                {t('termsOfService.sections.description.content')}
              </p>
              <div className="bg-white/5 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-white mb-4">
                  {t('termsOfService.sections.description.disclaimers.title')}
                </h3>
                <ul className="list-disc pl-6 text-white/90">
                  {getTranslationArray('termsOfService.sections.description.disclaimers.items').map((item, index) => (
                    <li key={index} className="mb-2">{item}</li>
                  ))}
                </ul>
              </div>
              <p className="text-white/90">
                {t('termsOfService.sections.description.discretion')}
              </p>
            </section>

            {/* Eligibility */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-4">
                2. {t('termsOfService.sections.eligibility.title')}
              </h2>
              <p className="text-white/90 mb-4">
                {t('termsOfService.sections.eligibility.content')}
              </p>
              <ul className="list-disc pl-6 text-white/90">
                {getTranslationArray('termsOfService.sections.eligibility.requirements').map((item, index) => (
                  <li key={index} className="mb-2">{item}</li>
                ))}
              </ul>
            </section>

            {/* Medical Disclaimer */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-4">
                3. {t('termsOfService.sections.medicalDisclaimer.title')}
              </h2>
              <p className="text-white/90 mb-6">
                {t('termsOfService.sections.medicalDisclaimer.content')}
              </p>
              <div className="bg-white/5 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">
                  {t('termsOfService.sections.medicalDisclaimer.acknowledgments.title')}
                </h3>
                <ul className="list-disc pl-6 text-white/90">
                  {getTranslationArray('termsOfService.sections.medicalDisclaimer.acknowledgments.items').map((item, index) => (
                    <li key={index} className="mb-2">{item}</li>
                  ))}
                </ul>
              </div>
            </section>

            {/* User Responsibilities */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-4">
                4. {t('termsOfService.sections.userResponsibilities.title')}
              </h2>
              <p className="text-white/90 mb-4">
                {t('termsOfService.sections.userResponsibilities.content')}
              </p>
              <ul className="list-disc pl-6 text-white/90 mb-6">
                {getTranslationArray('termsOfService.sections.userResponsibilities.responsibilities').map((item, index) => (
                  <li key={index} className="mb-2">{item}</li>
                ))}
              </ul>
              <p className="text-white/90">
                {t('termsOfService.sections.userResponsibilities.professional')}
              </p>
            </section>

            {/* Intellectual Property */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-4">
                5. {t('termsOfService.sections.intellectualProperty.title')}
              </h2>
              <p className="text-white/90 mb-6">
                {t('termsOfService.sections.intellectualProperty.content')}
              </p>
              <div className="bg-white/5 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-white mb-4">
                  {t('termsOfService.sections.intellectualProperty.prohibited.title')}
                </h3>
                <ul className="list-disc pl-6 text-white/90">
                  {getTranslationArray('termsOfService.sections.intellectualProperty.prohibited.items').map((item, index) => (
                    <li key={index} className="mb-2">{item}</li>
                  ))}
                </ul>
              </div>
              <div className="bg-white/5 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">
                  {t('termsOfService.sections.intellectualProperty.permitted.title')}
                </h3>
                <ul className="list-disc pl-6 text-white/90">
                  {getTranslationArray('termsOfService.sections.intellectualProperty.permitted.items').map((item, index) => (
                    <li key={index} className="mb-2">{item}</li>
                  ))}
                </ul>
              </div>
            </section>

            {/* Privacy */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-4">
                6. {t('termsOfService.sections.privacy.title')}
              </h2>
              <p className="text-white/90 mb-6">
                {t('termsOfService.sections.privacy.content')}
              </p>
              <ul className="list-disc pl-6 text-white/90 mb-6">
                {getTranslationArray('termsOfService.sections.privacy.acknowledgments').map((item, index) => (
                  <li key={index} className="mb-2">{item}</li>
                ))}
              </ul>
              <p className="text-white/90 italic">
                {t('termsOfService.sections.privacy.note')}
              </p>
            </section>

            {/* Liability */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-4">
                7. {t('termsOfService.sections.liability.title')}
              </h2>
              <p className="text-white/90 mb-6">
                {t('termsOfService.sections.liability.content')}
              </p>
              <ul className="list-disc pl-6 text-white/90 mb-6">
                {getTranslationArray('termsOfService.sections.liability.limitations').map((item, index) => (
                  <li key={index} className="mb-2">{item}</li>
                ))}
              </ul>
              <p className="text-white/90">
                {t('termsOfService.sections.liability.responsibility')}
              </p>
            </section>

            {/* Availability */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-4">
                8. {t('termsOfService.sections.availability.title')}
              </h2>
              <p className="text-white/90 mb-6">
                {t('termsOfService.sections.availability.content')}
              </p>
              <ul className="list-disc pl-6 text-white/90">
                {getTranslationArray('termsOfService.sections.availability.modifications').map((item, index) => (
                  <li key={index} className="mb-2">{item}</li>
                ))}
              </ul>
            </section>

            {/* Third Party */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-4">
                9. {t('termsOfService.sections.thirdParty.title')}
              </h2>
              <p className="text-white/90 mb-6">
                {t('termsOfService.sections.thirdParty.content')}
              </p>
              <ul className="list-disc pl-6 text-white/90">
                {getTranslationArray('termsOfService.sections.thirdParty.disclaimers').map((item, index) => (
                  <li key={index} className="mb-2">{item}</li>
                ))}
              </ul>
            </section>

            {/* Governing Law */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-4">
                10. {t('termsOfService.sections.governing.title')}
              </h2>
              <p className="text-white/90 mb-6">
                {t('termsOfService.sections.governing.content')}
              </p>
              <p className="text-white/90">
                {t('termsOfService.sections.governing.dispute')}
              </p>
            </section>

            {/* Changes */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-4">
                11. {t('termsOfService.sections.changes.title')}
              </h2>
              <p className="text-white/90 mb-6">
                {t('termsOfService.sections.changes.content')}
              </p>
              <ul className="list-disc pl-6 text-white/90">
                {getTranslationArray('termsOfService.sections.changes.notes').map((item, index) => (
                  <li key={index} className="mb-2">{item}</li>
                ))}
              </ul>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
} 