'use client';

import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ChartOptions,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Global font setup for Chart.js matching Montserrat sole font
ChartJS.defaults.font.family = 'var(--font-montserrat), sans-serif';
ChartJS.defaults.color = '#525252';

interface LineChartDataset {
  label: string;
  data: number[];
  color?: string;
  fill?: boolean;
  backgroundColor?: string;
}

export function AnalyticsAreaLineChart({
  labels,
  datasets,
  height = 320,
  currency = false,
}: {
  labels: string[];
  datasets: LineChartDataset[];
  height?: number;
  currency?: boolean;
}) {
  const chartData = {
    labels,
    datasets: datasets.map((ds) => {
      const baseColor = ds.color || '#14a800';
      return {
        label: ds.label,
        data: ds.data,
        borderColor: baseColor,
        backgroundColor:
          ds.backgroundColor ||
          (ds.fill !== false ? `${baseColor}18` : 'transparent'),
        fill: ds.fill !== false,
        tension: 0.38,
        pointRadius: labels.length > 20 ? 2 : 4,
        pointHoverRadius: 6,
        pointBackgroundColor: baseColor,
        borderWidth: 2.5,
      };
    }),
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        align: 'end',
        labels: {
          boxWidth: 10,
          boxHeight: 10,
          usePointStyle: true,
          font: { size: 12, weight: 'bold' },
          color: '#262626',
        },
      },
      tooltip: {
        backgroundColor: '#171717',
        titleFont: { size: 12, weight: 'bold' },
        bodyFont: { size: 12 },
        padding: 12,
        cornerRadius: 10,
        callbacks: {
          label: (ctx) => {
            const val = ctx.parsed.y;
            return currency
              ? ` ${ctx.dataset.label}: ৳${val?.toLocaleString()}`
              : ` ${ctx.dataset.label}: ${val?.toLocaleString()}`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: { size: 11, weight: 'normal' },
          color: '#737373',
          maxRotation: 0,
        },
      },
      y: {
        grid: {
          color: '#f0f0f0',
        },
        ticks: {
          font: { size: 11, weight: 'normal' },
          color: '#737373',
          callback: (value) => {
            const num = Number(value);
            if (currency) {
              if (num >= 1000000) return `৳${(num / 1000000).toFixed(1)}M`;
              if (num >= 1000) return `৳${(num / 1000).toFixed(0)}k`;
              return `৳${num}`;
            }
            if (num >= 1000) return `${(num / 1000).toFixed(0)}k`;
            return num;
          },
        },
      },
    },
  };

  return (
    <div style={{ height }}>
      <Line data={chartData} options={options} />
    </div>
  );
}

interface BarChartDataset {
  label: string;
  data: number[];
  color?: string;
}

export function AnalyticsBarChart({
  labels,
  datasets,
  height = 320,
  currency = false,
}: {
  labels: string[];
  datasets: BarChartDataset[];
  height?: number;
  currency?: boolean;
}) {
  const chartData = {
    labels,
    datasets: datasets.map((ds) => ({
      label: ds.label,
      data: ds.data,
      backgroundColor: ds.color || '#14a800',
      borderRadius: 6,
      maxBarThickness: 36,
    })),
  };

  const options: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        align: 'end',
        labels: {
          boxWidth: 10,
          boxHeight: 10,
          usePointStyle: true,
          font: { size: 12, weight: 'bold' },
        },
      },
      tooltip: {
        backgroundColor: '#171717',
        titleFont: { size: 12, weight: 'bold' },
        bodyFont: { size: 12 },
        padding: 12,
        cornerRadius: 10,
        callbacks: {
          label: (ctx) => {
            const val = ctx.parsed.y;
            return currency
              ? ` ${ctx.dataset.label}: ৳${val?.toLocaleString()}`
              : ` ${ctx.dataset.label}: ${val?.toLocaleString()}`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { font: { size: 11 }, color: '#737373' },
      },
      y: {
        grid: { color: '#f0f0f0' },
        ticks: {
          font: { size: 11 },
          color: '#737373',
          callback: (value) => {
            const num = Number(value);
            if (currency) {
              if (num >= 1000) return `৳${(num / 1000).toFixed(0)}k`;
              return `৳${num}`;
            }
            return num;
          },
        },
      },
    },
  };

  return (
    <div style={{ height }}>
      <Bar data={chartData} options={options} />
    </div>
  );
}

export function AnalyticsDoughnutChart({
  labels,
  data,
  colors,
  height = 240,
}: {
  labels: string[];
  data: number[];
  colors?: string[];
  height?: number;
}) {
  const chartColors = colors || [
    '#14a800',
    '#3b82f6',
    '#10b981',
    '#f59e0b',
    '#8b5cf6',
    '#ec4899',
  ];

  const chartData = {
    labels,
    datasets: [
      {
        data,
        backgroundColor: chartColors.slice(0, data.length),
        borderWidth: 2,
        borderColor: '#ffffff',
      },
    ],
  };

  const options: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '68%',
    plugins: {
      legend: {
        position: 'right',
        labels: {
          boxWidth: 10,
          boxHeight: 10,
          usePointStyle: true,
          font: { size: 11, weight: 'bold' },
          padding: 12,
        },
      },
      tooltip: {
        backgroundColor: '#171717',
        titleFont: { size: 12, weight: 'bold' },
        bodyFont: { size: 12 },
        padding: 12,
        cornerRadius: 10,
      },
    },
  };

  return (
    <div style={{ height }}>
      <Doughnut data={chartData} options={options} />
    </div>
  );
}
