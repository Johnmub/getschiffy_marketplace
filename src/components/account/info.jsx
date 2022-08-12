import React, {useEffect} from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux/es/exports";

import { 
  minify_number, 
  resumedAddress, 
  copy 
} from '../../utilities/';
import BusdLogo from '../../utilities/resources/token-busd-logo.webp';
import GoldLogo from '../../utilities/resources/token-gold-getschiffy.webp'

function Info()
{
  const accountStore = useSelector((state) => state.account);

  useEffect(()=> 
  {
    if(!accountStore.activeLogin) {
      return <Navigate to={'/'} replace={true}/>
    }
  },[]);

  return(
    <div className="w-full">
      <div>
        {/* Account info */}
        <div className="select-none border-b p-3 border-gray-3 text-center sm:text-left"><h4 className="text-white text-[24px] font-bold">Account</h4></div>  

        {/* Data */}
        <ul className="mt-4 text-white mx-4">
          {/* Address */}
          <li className="mb-2 select-none">
            <div className="inline-block cursor-pointer" onClick={()=> {copy(accountStore.address)}}>
              <span className="text-lg mr-[6px]">Address:</span>
              <span className="text-yellow font-bold">{resumedAddress(accountStore.address)}</span>
            </div>
          </li>

          {/* Registered */}
          <li className="mb-[1px]">
            <span className="text-base mr-[6px]">Created at:</span>
            <span className="font-bold text-sm">{accountStore.registered}</span>
          </li>

          {/* Last visit */}
          <li>
            <span className="text-base mr-[6px] text-red">Last visit:</span>
            <span className="font-bold text-sm">{accountStore.lastLogin} <span className="text-red">IP</span> <span className="text-yellow">{accountStore.lastDevice}</span></span>
          </li>
        </ul>

        {/* Criptocurrencies */}
        <div className="select-none border-b p-3 border-gray-3 text-center sm:text-left mt-[20px]"><h4 className="text-white text-[24px] font-bold">Cryptocurrencies</h4></div>  

        {/* Data */}
        <ul className="mt-4 text-white mx-4">
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
    </div>
  );
}

export default Info;