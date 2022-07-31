import React from "react";
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

import { isConnected } from '../../utilities/';
import Info from './info';
import Nfts from './nfts';

export default function Account()
{
  const accountStore = useSelector((state) => state.account);

  if(!isConnected() || !accountStore.activeLogin) {
    return <Navigate to={'/'} replace={true}/>
  }

  return(
    <div className="h-full flex flex-col md:flex-row flex-nowrap md:justify-items-stretch">
      {/* Navigation */}
      <div className="w-full md:w-[280px] md:h-full border-gray-3 border-b md:border-r text-white select-none">
        <nav className="w-full flex md:flex-col">
          <NavLink to={'./'} className="py-4 px-4 hover:bg-gray-3 transition duration-500 border-gray-3 border-r md:border-b md:border-r-0 flex items-center">
            <span className="mr-[6px]"><RiUserLine className="w-[22px] h-[22px]"/></span>Account
          </NavLink>
          <NavLink to={'nfts'} className="py-4 px-4 hover:bg-gray-3 transition duration-500 border-gray-3 border-r md:border-b md:border-r-0 flex items-center">
            <span className="mr-[6px]"><IoGameControllerOutline className="w-[22px] h-[22px]"/></span>Game
          </NavLink>
          <NavLink to={'nfts'} className="py-4 px-4 hover:bg-gray-3 transition duration-500 border-gray-3 border-r md:border-b md:border-r-0 flex items-center">
            <span className="mr-[6px]"><TbShirt className="w-[22px] h-[22px]"/></span>NFTs
          </NavLink>
        </nav>
      </div>

      {/* Body */}
      <div className='h-full w-full px-[40px] py-[20px]'>
        <Routes>  
          <Route path='/' element={<Info/>}/>
          <Route path='nfts' element={<Nfts/>}/>
          <Route path="*" element={<Navigate to="/" replace={true}/>} />
        </Routes>
      </div>
    </div>
  );
}