import React from 'react';
import { Hero } from '../components/Hero';
import { Features } from '../components/Features';
import { DrugLegend } from '../components/DrugLegend';
import { AvicennaQuote } from '../components/AvicennaQuote';
import { LegalDisclaimer } from '../components/LegalDisclaimer';

export function HomePage() {
  return (
    <div className="min-h-screen pt-8 sm:pt-16">
      <Hero />
      <div className="relative z-10">
        <Features />
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-4 sm:py-8">
          <DrugLegend />
        </div>
        <AvicennaQuote />
      </div>
      <LegalDisclaimer />
    </div>
  );
}