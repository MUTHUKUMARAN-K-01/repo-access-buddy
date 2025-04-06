
import React from 'react';

const App = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-center text-blue-800 mb-8">
          AI Finance Tracker
        </h1>
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto">
          <p className="text-gray-700 mb-4">
            Welcome to your AI-powered finance tracking application!
          </p>
          <p className="text-gray-600">
            This platform helps you manage your finances, track expenses, and receive AI-powered insights to improve your financial health.
          </p>
        </div>
      </div>
    </div>
  );
};

export default App;
