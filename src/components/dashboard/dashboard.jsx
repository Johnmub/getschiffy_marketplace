import React, { useEffect, useState } from "react";
import Web3 from 'web3';
import { TbShirt } from 'react-icons/tb';
import { contractNormal_addressAbi, 
  contractSilver_addressAbi, 
  contractGold_addressAbi 
} from "../../services/tokens";

import bannerDasboard from '../../utilities/resources/banner-dashboard.webp';

const classesNfts = ['normal', 'silver', 'gold'];

export default function Dashboard() 
{
  const [saleRecords, setSalesRecords] = useState({
    sold: 0,
    onSale: 0,
    total: 0
  });

  useEffect(()=> 
  {
    const getSales_records = () => 
    {
      var _web3 = new Web3(window.ethereum);
      var nftsRecords = {
        sold: 0,
        onSale: 0,
        total: 0
      }

      classesNfts.forEach(async (nftClass) => 
      {
        let nftData = undefined;

        if(nftClass === 'gold') {nftData = contractGold_addressAbi();} 
        else if (nftClass === 'silver') { nftData = contractSilver_addressAbi();} 
        else {nftData = contractNormal_addressAbi();}

        let nftlInst = new _web3.eth.Contract(nftData.ABI, nftData.ADDRESS);

        const MAX_SUPPLY    = parseInt(await nftlInst.methods.MAX_SUPPLY().call());
        const TOTAL_SUPPLY  = parseInt(await nftlInst.methods.totalSupply().call());

        nftsRecords.sold += TOTAL_SUPPLY;
        nftsRecords.onSale += (MAX_SUPPLY-TOTAL_SUPPLY);
        nftsRecords.total += MAX_SUPPLY;
        
        if(nftClass === 'gold') { setSalesRecords(nftsRecords)}
      });
    }

    getSales_records();
  }, []);

  return(
    <div className="px-[20px] sm:px-[30px] md:px-[40px] py-[40px] flex flex-col items-center">
      {/* News */}
      <div className="bg-gray-3 rounded-sm overflow-hidden w-full max-w-[900px] max-h-[180px] mb-[60px] select-none">
        <img className="w-full max-h-[180px]" src={bannerDasboard} alt="getschiffy news" />
      </div>

      <div className="w-full flex flex-col items-center">
        {/* Info */}
        <div className="flex text-white rounded-sm overflow-hidden">
          <div className="flex items-center text-base sm:text-lg font-bold select-none bg-yellow border-y border-yellow text-black py-[6px] px-[8px] sm:py-[8px] ms:px-[12px] md:text-xl md:py-[10px] md:px-[14px]">
            <span className="mr-[6px]"><TbShirt className="w-[22px] h-[22px]"/></span>
            <span>NFTS</span>
          </div>

          <div className="flex items-center font-bold text-base sm:text-lg select-none py-[6px] px-[8px] sm:py-[8px] ms:px-[12px] md:text-xl md:py-[10px] md:px-[14px] uppercase border-y border-gray-1">
            <span className="mr-[6px] text-gray-3">Sold:</span>
            <span className="select-text">{saleRecords.sold}</span> 
          </div>

          <div className="flex items-center font-bold text-base sm:text-lg select-none py-[6px] px-[8px] sm:py-[8px] ms:px-[12px] md:text-xl md:py-[10px] md:px-[14px] uppercase border sm:border-r-0 sm:border-l sm:border-y border-gray-1">
            <span className="mr-[6px] text-gray-3">On sale :</span>
            <span className="select-text">{saleRecords.onSale}</span> 
          </div>

          <div className="hidden sm:flex items-center text-base sm:text-lg select-none font-bold py-[6px] px-[8px] sm:py-[8px] ms:px-[12px] md:text-xl md:py-[10px] md:px-[14px] uppercase border border-gray-1">
            <span className="mr-[6px] text-gray-3">Total :</span>
            <span className="select-text">{saleRecords.total}</span> 
          </div>
        </div>

        {/* Your nfts on sale */}
        <div className="w-full mt-[60px] max-w-[1100px] select-none">
          <div className="bg-gray-1 rounded-tl-sm rounded-tr-sm px-[14px] py-[10px] inline-block">
            <span className="font-bold text-white text-lg sm:text-xl">Your nfts for sale</span>
          </div>
          <div className="border border-gray-1 rounded-sm rounded-tl-0 w-full min-h-[190px] flex justify-center items-center select-none">
            <span className="font-bold text-lg sm:text-xl uppercase text-gray-3">Empty</span>
          </div>
        </div>

        {/* Listing nfts */}
        <div className="w-full mt-[60px] max-w-[1100px] select-none">
          <div className="bg-gray-1 rounded-tl-sm rounded-tr-sm px-[14px] py-[10px] inline-block">
            <span className="font-bold text-white text-lg sm:text-xl">Latest Nfts</span>
          </div>
          <div className="border border-gray-1 rounded-sm rounded-tl-0 w-full min-h-[190px] flex justify-center items-center select-none">
            <span className="font-bold text-lg sm:text-xl uppercase text-gray-3">Empty</span>
          </div>
        </div>
      </div>
    </div>
  );
}