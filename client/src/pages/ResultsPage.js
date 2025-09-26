import React, { useState, useEffect } from 'react';
import { getResults } from '../services/api';
import socket from '../services/socket';
import ResultsChart from '../components/ResultsChart';

const ResultsPage = () => {
  const [results, setResults] = useState({ "Option A": 0, "Option B": 0, "Option C": 0 });
  const [lastUpdated, setLastUpdated] = useState(new Date());

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await getResults();
        setResults(res.data.totals);
        setLastUpdated(new Date(res.data.lastUpdated));
      } catch (error) {
        console.error(error);
      }
    };
    fetchResults();

    socket.on('voteUpdate', (data) => {
      setResults(data.results);
      setLastUpdated(new Date(data.lastUpdated));
    });

    return () => {
      socket.off('voteUpdate');
    };
  }, []);

  return (
    <div className="results-page">
      <h1>Voting Results</h1>
      <ResultsChart results={results} />
      <p>Last updated: {lastUpdated.toLocaleString()}</p>
      <div>
        {Object.entries(results).map(([option, count]) => (
          <p key={option}>{option}: {count} votes</p>
        ))}
      </div>
    </div>
  );
};

export default ResultsPage;
