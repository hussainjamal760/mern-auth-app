import React from 'react'
import Navbar from '../components/Navbar'
import Header from '../components/Header'

const Home = () => {
  return (
    <>
      <div className='min-h-screen bg-[url("/bg_img.png")] bg-cover bg-center'>

        <Navbar />

        <div className="flex items-center justify-center px-4 py-12">
          <Header />
        </div>

      </div>
    </>
  )
}

export default Home
