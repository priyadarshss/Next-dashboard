import AreaChart from './AreaChart'
import Barchart from './BarChart'
import React from 'react'

const index = () => {
  return (
    <div className='w-full mt-20 flex flex-col justify-center items-center'>
      <AreaChart />
      <div className='w-full h-1 bg-gray-800 my-20'></div>
      <Barchart />
    </div>
  )
}

export default index
