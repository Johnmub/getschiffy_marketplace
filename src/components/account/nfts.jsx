import React, {useEffect, useState} from "react";
import Web3 from 'web3';
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

import ArticleNft from '../marketplace/article_nft';
import Loading from '../utilities/loading';
import Tokens, {
  contractGold_addressAbi, 
  contractNormal_addressAbi, 
  contractSilver_addressAbi
} from '../../services/tokens';
import { removeWords } from '../../utilities/';

export default function Nfts()
{
  const [nftsNormal, setNftsNormal] = useState(undefined);
  const [nftsSilver, setNftsSilver] = useState(undefined);
  const [nftsGold, setNftsGold] = useState(undefined);

  const [loadPage, setLoadPage] = useState(false);
  const accountStore = useSelector((state) => state.account);

  useEffect(()=> {
    if(!accountStore.activeLogin) {
      return <Navigate to={'/'} replace={true}/>
    }

    if(!loadPage && nftsNormal !== undefined) {
      setLoadPage(true);
    }
  });

  useEffect(()=> {
    getNfts_balance();
  },[]);

  const getNfts_balance = async () => 
  {
    var _web3 = new Web3(window.ethereum);
    var _tokens = new Tokens(_web3);

    const normalCount = await _tokens.balance_normalNfts(accountStore.address);
    const SilverCount = await _tokens.balance_silverNfts(accountStore.address);
    const GoldCount = await _tokens.balance_goldNfts(accountStore.address);

    setNftsNormal(await getNfts_data(normalCount, 'normal'));
    setNftsSilver(await getNfts_data(SilverCount, 'silver'));
    setNftsGold(await getNfts_data(GoldCount, 'gold'));
  }

  const getNfts_data = async (count = [], classNft = '') => 
  {
    if(count.length < 1) {
      return [];
    }

    var nftsData = undefined;
    var nftsArray = count;
    var itemsRender = [];

    if(classNft === 'gold') {nftsData = contractGold_addressAbi();} 
    else if (classNft === 'silver') {nftsData = contractSilver_addressAbi();} 
    else {nftsData = contractNormal_addressAbi();}

    for (let index = 0; index < nftsArray.length; index++) 
    {
      try 
      {
        let ipfAddress = (nftsData.IPFS+'/'+nftsArray[index]+'.json');
        const tokenMetadata = await fetch(ipfAddress).then((response) => response.json());

        itemsRender.push({
          tokenIndex: nftsArray[index],
          tokenDescription: removeWords(tokenMetadata.description),
          tokenAttributes: tokenMetadata.attributes,
          tokenUrl: tokenMetadata.image
        });
      } catch (error) {
        break;
      }
    }

    return itemsRender;
  }

  const nftsRender =  (classNft) => 
  {
    if(!loadPage) {
      return (<Loading/>);
    }

    const showNfts = classNft;
    var _nftsData = [];

    if(showNfts === 'gold') {_nftsData = nftsGold;} 
    else if (showNfts === 'silver') {_nftsData = nftsSilver;} 
    else {_nftsData = nftsNormal;}

    if(_nftsData.length < 1) {
      return(<span className="font-bold text-lg sm:text-xl uppercase text-gray-3">Empty</span>);
    }

    return(_nftsData.map((nft) => 
    {
      return (
        <ArticleNft article={nft} showSale={true} key={nft.tokenIndex}/>
      );
    }));
  }

  return(
    <div className="w-full h-full">
      {/* Description */}
      <div className=" text-white text-base text-bold pt-[12px]">
        <p>Nfts available in your wallet</p>
        <p>Amount of gold collected</p>
      </div>

      {/* Normal Nfts */}
      <div className="w-full mt-[40px] max-w-[1100px] select-none">
        <div className="bg-gray-1 rounded-tl-sm rounded-tr-sm px-[14px] py-[10px] inline-block font-bold text-white text-lg sm:text-xl">
          <span>Normal | </span>
          <span className="text-yellow uppercase text-base">0.00 GOLD</span>
        </div>

        {/* Items */}
        <div className="border border-gray-1 rounded-sm rounded-tl-0 w-full min-h-[190px] flex flex-wrap justify-center items-center select-none">
          {nftsRender('normal')}
        </div>
      </div>

      {/* Silver Nfts */}
      <div className="w-full mt-[40px] max-w-[1100px] select-none">
        <div className="bg-gray-1 rounded-tl-sm rounded-tr-sm px-[14px] py-[10px] inline-block font-bold text-white text-lg sm:text-xl">
          <span>Silver | </span>
          <span className="text-yellow uppercase text-base">0.00 GOLD</span>
        </div>

        {/* Items */}
        <div className="border border-gray-1 rounded-sm rounded-tl-0 w-full min-h-[190px] flex  flex-wrap justify-center items-center select-none">
          {nftsRender('silver')}
        </div>
      </div>

      {/* Gold Nfts */}
      <div className="w-full mt-[40px] max-w-[1100px] select-none">
        <div className="bg-gray-1 rounded-tl-sm rounded-tr-sm px-[14px] py-[10px] inline-block font-bold text-white text-lg sm:text-xl">
          <span>Gold | </span>
          <span className="text-yellow uppercase text-base">0.00 GOLD</span>
        </div>

        {/* Items */}
        <div className="border border-gray-1 rounded-sm rounded-tl-0 w-full min-h-[190px] flex flex-wrap justify-center items-center select-none">
          {nftsRender('gold')}
        </div>
      </div>
    </div>
  );
}