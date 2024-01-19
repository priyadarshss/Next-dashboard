import Link from 'next/link'
import { RxDashboard, RxPerson } from 'react-icons/rx'
import { HiOutlineShoppingBag } from 'react-icons/hi'
import { FiSettings } from 'react-icons/fi'
import { GoHome } from 'react-icons/go'

const Sidebar = ({ children }) => {
  const router = useRouter()

  return (
    <div className='flex'>
      <div className='fixed w-20 h-screen p-4 bg-gray-900 border-r-[1px] flex flex-col justify-between'>
        <div className='flex flex-col items-center'>
          <Link href='/'>
            <div className='bg-purple-900 text-white p-3 rounded-lg inline-block'>
              <GoHome size={20} />
            </div>
          </Link>
          <span className='border-b-[1px] Iborder-gray-200 w-full p-2'></span>
          <Link href='/'>
            <div
              className={`${
                router.pathname === '/'
                  ? 'bg-gray-600 text-white'
                  : 'bg-gray-800 hover:bg-gray-700'
              } cursor-pointer my-4 p-3 rounded-lg inline-block`}
            >
              {' '}
              <RxDashboard size={20} />
            </div>
          </Link>
          <Link href='/customers'>
            <div
              className={`${
                router.pathname === '/customers'
                  ? 'bg-gray-600 text-white'
                  : 'bg-gray-800 hover:bg-gray-700'
              } cursor-pointer my-4 p-3 rounded-lg inline-block`}
            >
              <RxPerson size={20} />
            </div>
          </Link>
          <Link href='/orders'>
            <div
              className={`${
                router.pathname === '/orders'
                  ? 'bg-gray-600 text-white'
                  : 'bg-gray-800 hover:bg-gray-700'
              } cursor-pointer my-4 p-3 rounded-lg inline-block`}
            >
              {' '}
              <HiOutlineShoppingBag size={20} />
            </div>
          </Link>
          <Link href='/'>
            <div className='bg-gray-800 hover:bg-gray-700 cursor-pointer my-4 p-3 rounded-lg inline-block'>
              <FiSettings size={20} />
            </div>
          </Link>
        </div>
      </div>
      <main className='ml-20 w-full'>{children}</main>
    </div>
  )
}

export default Sidebar
