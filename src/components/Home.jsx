import React from 'react'
import NaveBar from './NaveBar'
import Shoe from '../assets/firstShoe.svg'

const Home = () => {
    return (
        <div className='relative min-h-screen'>

            <div className="absolute inset-0 flex">
                <div className="w-[40%] bg-white"></div>
                <div className="w-[60%] bg-gray-100"></div>
            </div>

            <div className='relative z-10'>
                <NaveBar />

                <div className='flex flex-row justify-between '>
                    <div className='flex flex-col w-150 p-30 gap-10'>
                        <h1 className='text-5xl font-extrabold '>Find Your Sole Mate with Us</h1>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod </p>
                        <button className='bg-black p-3 text-white w-30 shadow-lg'>Shop Now</button>
                    </div>

                    <div>
                    <img src={Shoe} alt="" className='' />
                </div>

                </div>

                

            </div>
        </div>
    )
}

export default Home
