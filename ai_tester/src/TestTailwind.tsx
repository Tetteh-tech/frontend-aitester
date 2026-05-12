import React from 'react';

const TestTailwind: React.FC = () => {
  return (
    <div className="p-8">
      <div className="bg-blue-500 text-white p-4 rounded-lg mb-4">
        If this has a blue background and white text, Tailwind is working!
      </div>
      <div className="flex gap-4">
        <button className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">
          Purple Button
        </button>
        <button className="bg-pink-600 text-white px-4 py-2 rounded hover:bg-pink-700">
          Pink Button
        </button>
      </div>
      <div className="mt-4 text-center text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
        Gradient Text Test
      </div>
    </div>
  );
};

export default TestTailwind;