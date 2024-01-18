import React, { useEffect, useState } from 'react'
import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const BarChart = () => {
  const [charData, setCharData] = useState({
    datasets: [],
  })
  const [chartOptions, setChartOptions] = useState({})

  useEffect(() => {
    setCharData({
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
      datasets: [
        {
          label: 'Revenue',
          data: [4000, 5000, 3000, 7000, 8000, 2000, 3000],
            backgroundColor: '#10B981',
            borderColor: 'black',
        },
      ],
    })

    setChartOptions({
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: 'Revenue',
        },
      },
      maintainAspectRatio: false,
      responsive: true,
    })
  })

  return (
    <>
      <div className='w-full md:col-span-2 relative lg:h-[70vh] h-[50vh] m-auto p-4 border border-gray-700 rounded-lg bg-gray-900'>
        <Bar data={charData} options={chartOptions} />
      </div>
    </>
  )
}

export default BarChart
