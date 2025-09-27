import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ResultsChart = ({ results }) => {
  const data = {
    labels: Object.keys(results),
    datasets: [
      {
        label: 'Votes',
        data: Object.values(results),
        backgroundColor: [
          'rgba(37, 99, 235, 0.5)',
          'rgba(16, 185, 129, 0.5)',
          'rgba(239, 68, 68, 0.5)',
        ],
        borderColor: [
          'rgba(37, 99, 235, 1)',
          'rgba(16, 185, 129, 1)',
          'rgba(239, 68, 68, 1)',
        ],
        borderWidth: 2,
        borderRadius: 5,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'bottom', labels: { color: '#fff' } },
      title: {
        display: true,
        text: '📊 Voting Results',
        color: '#374151',
        font: { size: 18, weight: 'bold' },
      },
    },
    scales: {
      x: { ticks: { color: '#9CA3AF' } },
      y: { beginAtZero: true, ticks: { color: '#9CA3AF' } },
    },
  };

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg">
      <Bar data={data} options={options} />
    </div>
  );
};

export default ResultsChart;