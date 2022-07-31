import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

import { isConnected } from '../../utilities/';

export default function Nfts()
{
  const accountStore = useSelector((state) => state.account);

  if(!isConnected() || !accountStore.activeLogin) {
    return <Navigate to={'/'} replace={true}/>
  }

  return(
    <div className="w-full h-full flex flex-col items-center justify-center">
      {/* Title */}
      <div className="w-full sm:max-w-[400px] md:w-1/2">
        <h4 className="text-3xl text-white text-center font-bold">Join our white list and take advantage of our offers</h4>
      </div>

      {/* Text */}
      <div className="mt-[20px] w-full sm:w-4/5 md:w-auto">
        <p className="text-white text-center">We will use your name and wallet address to identify you. By joining you are accepting our <a className="text-red underline" href="https://whitepaper.getschiffy.com/faqs/terms-of-use" target={"_blank"} rel="noreferrer">terms of use.</a></p>
      </div>
    </div>
  );
}