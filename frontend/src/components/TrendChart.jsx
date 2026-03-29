import React from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js'
import { Line } from 'react-chartjs-2'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler)

const TrendChart = ({ labels = [], data = [], title }) => {
  const chartData = {
    labels,
    datasets: [
      {
        label: title || 'Price',
        data,
        fill: true,
        borderColor: '#42f2ff',
        backgroundColor: 'rgba(66, 242, 255, 0.08)',
        tension: 0.35,
        pointRadius: 0,
      },
    ],
  }

  const options = {
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => `₹${ctx.parsed.y}`,
        },
      },
    },
    scales: {
      x: { grid: { display: false }, ticks: { color: '#94a3b8' } },
      y: { grid: { color: 'rgba(148,163,184,0.1)' }, ticks: { color: '#94a3b8' } },
    },
  }

  return (
    <div className="glass rounded-2xl p-4">
      <Line data={chartData} options={options} />
    </div>
  )
}

export default TrendChart
