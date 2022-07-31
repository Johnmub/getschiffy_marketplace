import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux/es/exports";
import { GoUnverified } from "react-icons/go"

import { 
  minify_number, 
  resumedAddress, 
  isConnected, 
  copy 
} from '../../utilities/';
import BusdLogo from '../../utilities/resources/token-busd-logo.webp';
import GoldLogo from '../../utilities/resources/token-gold-getschiffy.webp'

function Info()
{
  const accountStore = useSelector((state) => state.account);

  if(!isConnected() || !accountStore.activeLogin) {
    return <Navigate to={'/'} replace={true}/>
  }

  return(
    <div className="w-full">
      {/* Account */}
      <div>
        {/* Title */}
        <div className="select-none border rounded p-3 border-gray-3 text-center sm:text-left"><h4 className="text-white text-[24px] font-bold">Account</h4></div>

        {/* Data */}
        <ul className="mt-4 text-white mx-4">
          {/* Address */}
          <li className="my-4 select-none cursor-pointer" onClick={()=> {copy(accountStore.address)}}>
            <span className="text-lg mr-[6px]">Address:</span>
            <span className="text-yellow font-bold">{resumedAddress(accountStore.address)}</span>
          </li>

          {/* Bnb Balance */}
          <li className='mb-4 flex items-center'>
            <div className='mr-[6px] w-[24px] h-[24px] select-none'><img src={BusdLogo} alt="Bnb Logo Balance"/></div>
            <div><span className='font-bold text-base'>{`${minify_number(accountStore.busdBalance, 6)}`} BUSD</span></div>
          </li>

          {/* Gold Balance */}
          <li className="flex items-center">
            <div className='mr-[6px] w-[25px] h-[25px] select-none'><img src={GoldLogo} alt="Gold Logo Balance"/></div>
            <div><span className='font-bold text-base'>{`${minify_number(accountStore.goldBalance, 6)}`} GOLD</span></div>
          </li>
        </ul>
      </div>

      {/* Game */}
      <div className="mt-[20px]">
        {/* Title */}
        <div className="select-none border rounded p-3 border-gray-3 flex justify-center sm:justify-start items-center">
          <h4 className="text-white text-[24px] font-bold">Game</h4>
          <span className="ml-[6px]"><GoUnverified className="w-[24px] h-[24px] text-red"/></span>
        </div>

        {/* Data */}
        <ul className="mt-4 text-white mx-4">
          {/* Email */}
          <li className="my-4">
            <div className="flex items-center">
              <div className="flex items-center">
                <span className="select-none text-lg mr-[6px]">Login Email:</span>
                <span className="text-yellow font-bold">Empty</span>
              </div>

              {/* Add || Edit */}
              <div className="ml-[12px] select-none">
                <button disabled className="border rounded py-[2px] px-1 text-sm text-red">Add</button>
              </div>
            </div>

            {/* Description */}
            <div className="mt-[-4px]"><p className=" text-sm">Email to login to the game</p></div>
          </li>

          {/* Gold Balance */}
          <li className="my-4">
            <div className="flex items-center">
              {/* Token */}
              <div className="flex items-center">
                <div className='mr-[6px] w-[25px] h-[25px] select-none'><img src={GoldLogo} alt="Gold Logo Balance"/></div>
                <div><span className='font-bold text-base'>{`${minify_number(accountStore.goldBalance, 6)}`} GOLD</span></div>
              </div>

              {/* Claim */}
              <div className="select-none ml-[12px]">
                <button disabled className="border rounded py-[2px] px-1 text-sm text-red">Claim</button>
              </div>
            </div>

            {/* Description */}
            <div className="mt-[2px]"><p className=" text-sm">Gold collected in game</p></div>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Info;