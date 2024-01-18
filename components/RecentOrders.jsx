import React from 'react'
import { data } from '../data/data.js'
import { FaShoppingBag } from 'react-icons/fa'

const RecentOrders = () => {
  return (
    <div className='w-full col-span-1 relative lg:h-[70vh] h-[50vh] m-auto p-4 border rounded-lg bg-gray-900 overflow-y-scroll overflow-x-hidden '>
      <h1>RecentOrders</h1>
      <ul>
        {data.map((item, i) => (
          <li
            key={i}
            className='bg-gray-900 hover:bg-gray-800 rounded-lg my-3 p-2 flex items-center cursor-pointer'
          >
            <div className='bg-gray-800 rounded-lg p-3'>
              <FaShoppingBag className='text-white' />
            </div>
            <div className='pl-4'>
              <p className='font-bold'>${item.total}</p>
              <p className='text-gray-400 text-md'>{item.name.first}</p>
            </div>
            <p className='lg:flex md:hidden absolute right-6 text-sm'>
              {item.date}
            </p>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default RecentOrders
