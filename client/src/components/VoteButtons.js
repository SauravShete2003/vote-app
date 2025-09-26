import React from 'react';

const options = ['Option A', 'Option B', 'Option C'];

const VoteButtons = ({ onVote }) => {
  return (
    <div className="vote-buttons">
      <h2>Choose your option:</h2>
      {options.map((option) => (
        <button
          key={option}
          onClick={() => onVote(option)}
          className="vote-btn"
        >
          {option}
        </button>
      ))}
    </div>
  );
};

export default VoteButtons;
