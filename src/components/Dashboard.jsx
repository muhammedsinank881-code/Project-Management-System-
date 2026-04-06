import React from 'react'
import NaveBar from './NaveBar'
import { Outlet } from 'react-router-dom'

const Dashboard = () => {
  return (
    // <div className="min-h-screen bg-gradient-to-tr from-white to-sky-200">

    //   {/* NAVBAR */}
    //   <NaveBar />

    //   {/* CONTENT */}

    //   <div className="pt-24 px-6">
    //     <Outlet />
    //   </div>



    <div className="min-h-screen bg-gradient-to-tr from-white to-sky-200 flex items-center justify-center">

      {/* NAVBAR */}
      <NaveBar />

      {/* CONTENT */}

      <div className="ml-20 h-screen flex justify-center p-4 md:p-10  overflow-y-auto no-scrollbar">
        <Outlet />
      </div>



    </div>

  )
}

export default Dashboard
