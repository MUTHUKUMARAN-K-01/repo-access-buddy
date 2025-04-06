
import React from 'react';
import { Button } from './components/ui/button';

const App = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      <main className="container mx-auto py-10 px-4">
        <h1 className="text-3xl font-bold text-center mb-8">
          AI Finance Tracker
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Welcome to your personal finance management assistant.
        </p>
        <div className="flex justify-center">
          <Button className="bg-blue-600 hover:bg-blue-700">
            Get Started
          </Button>
        </div>
      </main>
    </div>
  );
};

export default App;
