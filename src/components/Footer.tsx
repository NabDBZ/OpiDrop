import React from 'react';
import { Droplet } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Droplet className="h-6 w-6 text-blue-600" />
            <span className="font-semibold text-xl text-gray-900">OptiDrop</span>
          </div>
          <div className="flex space-x-6">
            <a href="#" className="text-gray-500 hover:text-gray-900">Privacy Policy</a>
            <a href="#" className="text-gray-500 hover:text-gray-900">Terms of Service</a>
            <a href="#" className="text-gray-500 hover:text-gray-900">Contact</a>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-200 pt-8">
          <p className="text-center text-gray-400">&copy; {new Date().getFullYear()} OptiDrop. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}