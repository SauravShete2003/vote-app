import React from 'react';

const options = ['Option A', 'Option B', 'Option C'];

const VoteButtons = ({ onVote }) => {
  return (
    <div className="text-center">
      <h2 className="text-xl font-semibold mb-6 text-gray-800 dark:text-gray-200">
        Choose your option:
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {options.map((option) => (
          <button
            key={option}
            onClick={() => onVote(option)}
            className="py-3 px-6 rounded-lg font-medium text-white bg-gradient-to-r from-blue-500 to-indigo-600 shadow hover:from-blue-600 hover:to-indigo-700 transform hover:scale-105 transition duration-200"
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
};

export default VoteButtons;