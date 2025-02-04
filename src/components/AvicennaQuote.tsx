import React from 'react';

export function AvicennaQuote() {
  return (
    <div className="bg-gradient-to-r from-gray-900 via-blue-900 to-gray-900 py-16 sm:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative bg-white/5 backdrop-blur-lg rounded-3xl p-6 sm:p-12 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 items-center">
            {/* Portrait Section */}
            <div className="lg:col-span-2 max-w-sm mx-auto lg:max-w-none">
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/20">
                <img
                  src="https://www.lafeuillecharbinoise.com/wp-content/uploads/2013/02/portrait-avicenne.jpg"
                  alt="Portrait of Avicenna (Ibn Sīnā)"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-center">
                  <h3 className="text-lg font-serif text-white">Avicenna (Ibn Sīnā)</h3>
                  <p className="text-sm text-blue-200">980-1037 CE</p>
                </div>
              </div>
            </div>

            {/* Quote Section */}
            <div className="lg:col-span-3 text-center space-y-8 lg:space-y-12">
              <div className="space-y-8">
                {/* Arabic Quote */}
                <div className="flex justify-center">
                  <p 
                    className="text-2xl sm:text-3xl font-serif text-amber-400 leading-relaxed max-w-2xl" 
                    style={{ direction: 'rtl', fontFamily: 'Noto Naskh Arabic, serif' }}
                  >
                    "العلم هو الزينة الحقيقية وكرامة الإنسان."
                  </p>
                </div>
                
                {/* Latin Quote */}
                <div className="flex justify-center">
                  <p className="text-xl sm:text-2xl font-serif italic text-blue-200 leading-relaxed max-w-2xl">
                    "Scientia est vera hominis ornamentum et dignitas."
                  </p>
                </div>
                
                {/* English Quote */}
                <div className="flex justify-center">
                  <p className="text-xl sm:text-2xl font-serif text-white leading-relaxed max-w-2xl">
                    "Knowledge is the true ornament and dignity of man."
                  </p>
                </div>
              </div>
              
              <div className="text-blue-200 font-serif space-y-3">
                <p className="text-lg">— Avicenna (Ibn Sīnā)</p>
                <p className="text-sm text-blue-300">Persian Polymath & Father of Early Modern Medicine</p>
                <div className="flex justify-center">
                  <p className="text-sm text-blue-300 max-w-xl">
                    A pioneering figure in medicine, philosophy, and science, Avicenna's works, including 
                    "The Canon of Medicine," shaped medical education for centuries.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="absolute left-0 top-0 w-full h-full -z-10 overflow-hidden rounded-3xl opacity-10">
            <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-blue-900 to-gray-900" />
            <div className="absolute left-0 top-0 w-1/2 h-full">
              <img
                src="https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?auto=format&fit=crop&w=200&q=80"
                alt="Ancient manuscript"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute right-0 top-0 w-1/2 h-full">
              <img
                src="https://images.unsplash.com/photo-1583482183021-4aa35998584c?auto=format&fit=crop&w=200&q=80"
                alt="Ancient medicine"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}