import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { vote, getResults, getMe } from '../services/api';
import socket from '../services/socket';
import { toast } from 'react-toastify';
import VoteButtons from '../components/VoteButtons';
import ResultsChart from '../components/ResultsChart';

const VotePage = () => {
  const [results, setResults] = useState({ "Option A": 0, "Option B": 0, "Option C": 0 });
  const [voted, setVoted] = useState(false);
  const [userOption, setUserOption] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await getMe();
        setVoted(res.data.voted);
        setUserOption(res.data.option);
      } catch (error) {
        navigate('/');
      }
    };
    fetchMe();

    const fetchResults = async () => {
      try {
        const res = await getResults();
        setResults(res.data.totals);
      } catch (error) {
        console.error(error);
      }
    };
    fetchResults();

    socket.on('voteUpdate', (data) => {
      setResults(data.results);
    });

    return () => {
      socket.off('voteUpdate');
    };
  }, [navigate]);

  const handleVote = async (option) => {
    try {
      await vote(option);
      setVoted(true);
      setUserOption(option);
      toast.success('Vote recorded!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Vote failed');
    }
  };

  return (
    <div className="vote-page">
      <h1>Vote Now</h1>
      {!voted ? (
        <VoteButtons onVote={handleVote} />
      ) : (
        <div>
          <p>You voted for: {userOption}</p>
          <ResultsChart results={results} />
          <button onClick={() => navigate('/results')}>View Full Results</button>
        </div>
      )}
    </div>
  );
};

export default VotePage;
