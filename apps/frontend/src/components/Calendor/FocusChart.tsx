import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import type { FC } from 'react';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

type Props = {
  data: Record<string, number>;
};

const FocusChart: FC<Props> = ({ data }) => {
  // Generate 24-hour labels and map to data
  const allHours = Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, '0')}:00`);
  const values = allHours.map(hour => {
    const hourNum = parseInt(hour.split(':')[0]);
    return data[hourNum] ?? 0;
  });

  return (
    <Bar
      data={{
        labels: allHours,
        datasets: [
          {
            data: values,
            backgroundColor: '#6DBF8B',
            borderRadius: 4,
            barThickness: 12,
          },
        ],
      }}
      options={{
        indexAxis: 'x' as const,
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            padding: 8,
            titleFont: { size: 12 },
            bodyFont: { size: 11 },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: { color: '#999', font: { size: 11 } },
            grid: { color: '#eee' },
          },
          x: {
            ticks: { color: '#999', font: { size: 10 } },
            grid: { display: false },
          },
        },
      }}
    />
  );
};

export default FocusChart;