import { Inter } from 'next/font/google'
import Header from '@/components/Header'
import TopCards from '@/components/TopCards'
import BarChart from '@/components/BarChart'
import RecentOrders from '@/components/RecentOrders'
import D3Chart from '@/components/D3Chart'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <main className=''>
      <Header />
      <TopCards />
      <D3Chart />
      <div className='p-4 grid md:grid-cols-3 grid-cols-1 gap-4'>
        <BarChart />
        <RecentOrders />
      </div>
    </main>
  )
}
