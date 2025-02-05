import React from 'react';
import { Hero } from '../components/Hero';
import { Features } from '../components/Features';
import { AvicennaQuote } from '../components/AvicennaQuote';
import { LegalDisclaimer } from '../components/LegalDisclaimer';

export function HomePage() {
  return (
    <div className="min-h-screen pt-8 sm:pt-16">
      <Hero />
      <div className="relative z-10">
        <Features />
        <AvicennaQuote />
      </div>
      <LegalDisclaimer />
    </div>
  );
}