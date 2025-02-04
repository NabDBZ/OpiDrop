import React from 'react';
import { Hero } from '../components/Hero';
import { QuickGuide } from '../components/QuickGuide';
import { Features } from '../components/Features';
import { DrugLegend } from '../components/DrugLegend';
import { AvicennaQuote } from '../components/AvicennaQuote';
import { LegalDisclaimer } from '../components/LegalDisclaimer';

export function HomePage() {
  return (
    <div className="min-h-screen">
      <Hero />
      <div className="relative z-10">
        <QuickGuide />
        <Features />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <DrugLegend />
        </div>
        <AvicennaQuote />
      </div>
      <LegalDisclaimer />
    </div>
  );
}