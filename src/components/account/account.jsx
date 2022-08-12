import React, {useEffect} from "react";
import { 
  Routes,
  Route,
  NavLink,
  Navigate
} from 'react-router-dom';
import { useSelector } from "react-redux";
import { TbShirt } from 'react-icons/tb';
import { IoGameControllerOutline } from 'react-icons/io5';
import { RiUserLine } from 'react-icons/ri';

import Info from './info';
import Game from './game';
import Nfts from './nfts';

export default function Account()
{
  const accountStore = useSelector((state) => state.account);

  useEffect(()=> 
  {
    if(!accountStore.activeLogin) {
      return <Navigate to={'/'} replace={true}/>
    }
  },[]);

  return(
    <div className="flex flex-col md:flex-row flex-nowrap md:justify-items-stretch">
      {/* Navigation */}
      <div className="w-full md:w-[250px] md:h-full bg-gray-6 border-gray-3 border-b md:border-r text-white select-none fixed">
        <nav className="w-full flex justify-center sm:justify-start md:flex-col">
          <NavLink to={'./'} className="py-4 px-4 hover:bg-gray-3 transition duration-500 border-gray-3 border-l border-r md:border-b sm:border-l-0 md:border-r-0 flex items-center">
            <span className="mr-[6px]"><RiUserLine className="w-[22px] h-[22px]"/></span>Account
          </NavLink>
          <NavLink to={'game'} className="py-4 px-4 hover:bg-gray-3 transition duration-500 border-gray-3 border-r md:border-b md:border-r-0 flex items-center">
            <span className="mr-[6px]"><IoGameControllerOutline className="w-[22px] h-[22px]"/></span>Game
          </NavLink>
          <NavLink to={'nfts'} className="py-4 px-4 hover:bg-gray-3 transition duration-500 border-gray-3 border-r md:border-b md:border-r-0 flex items-center">
            <span className="mr-[6px]"><TbShirt className="w-[22px] h-[22px]"/></span>NFTs
          </NavLink>
        </nav>
      </div>

      {/* Body */}
      <div className='h-auto w-full px-[40px] py-[20px] mt-[56px] md:mt-0 md:ml-[250px]'>
        <Routes>  
          <Route path='/' element={<Info/>}/>
          <Route path='game' element={<Game/>}/>
          <Route path='nfts' element={<Nfts/>}/>
          <Route path="*" element={<Navigate to="/" replace={true}/>} />
        </Routes>
      </div>
    </div>
  );
}