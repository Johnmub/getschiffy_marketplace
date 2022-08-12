import React, { useEffect, useState } from  "react";
import Web3 from 'web3';
import { NavLink } from "react-router-dom";
import { FiMenu } from "react-icons/fi";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";
import { MdClose } from "react-icons/md";

import AccordionLayout from "./accordion_layout";
import ArticleNft from "./article_nft";
// import ButtonSortBy from "./button_sortBy";
import Loading from "../utilities/loading";
import { contractNormal_addressAbi, 
  contractSilver_addressAbi, 
  contractGold_addressAbi 
} from "../../services/tokens";
import { minify_number, removeWords } from "../../utilities/";
import './marketplace.css';

const SHOW_PER_PAGE = 12;

export default function Marketplace()
{
  var _web3 = undefined;

  const [showPages, setShowPages] = useState(0);
  const [pageSelected, setPageSelected] = useState(1);
  const [nftInfo, setNftInfo] = useState({});
  const [itemsToRender, setItemsRender] = useState([]);

  const [filtersMobile, setFiltersMobile ] = useState(false);
  const [loadMarket, setLoadMarket] = useState(false);
  const [classNfts, setClassNfts] = useState('normal');

  useEffect(()=> { 
    eventListeners() 
  });

  useEffect(()=> {
    setLoadMarket(true);
    settingNfts_list(classNfts);
  }, []);

  const eventListeners = () =>
  {
    window.addEventListener('resize', (ev) => 
    {
      if(filtersMobile)
        setFiltersMobile(false);
    });

    document.addEventListener('click', (ev) => 
    {
      let target = ev.target;

      try 
      {
        if(filtersMobile && target.id !== 'iconMenuFilter' && target.id !== 'button_menuFilter') {
          setFiltersMobile(false);
        }
      } catch (error) {
        return;
      }
    });
  }

  const toggle_menuFilter_mobile = (active = false) => 
  {
    if(active) {
      setFiltersMobile(false);
      return;
    }

    filtersMobile ? setFiltersMobile(false):setFiltersMobile(true);
  };

  // Web3
  const settingNfts_list = async (selectedClass) => 
  {
    _web3 = new Web3(window.ethereum);
    var nftsData = undefined,
    nftslInst = undefined;

    if(selectedClass === 'gold') {nftsData = contractGold_addressAbi();} 
    else if (selectedClass === 'silver') {nftsData = contractSilver_addressAbi();} 
    else {nftsData = contractNormal_addressAbi();}
    nftslInst = new _web3.eth.Contract(nftsData.ABI, nftsData.ADDRESS);

    const MAX_SUPPLY    = await nftslInst.methods.MAX_SUPPLY().call();
    const TOTAL_SUPPLY  = await nftslInst.methods.totalSupply().call();
    const PRICE         = await nftslInst.methods.PRICE().call();
    const PAGES_COUNT   = ((MAX_SUPPLY - TOTAL_SUPPLY) / SHOW_PER_PAGE);

    setNftInfo({
      max_supply: MAX_SUPPLY,
      total_supply: TOTAL_SUPPLY,
      price: parseInt(String(PRICE).substring(0, 3)),
      ipfs: nftsData.IPFS
    });
    setShowPages(Number.isInteger(PAGES_COUNT) ? PAGES_COUNT: Math.trunc(PAGES_COUNT)+1);
    setPageSelected(1);

    collectNfts(TOTAL_SUPPLY, parseInt(String(PRICE).substring(0, 3)), nftsData.IPFS);
  }

  const collectNfts = async (START_COUNT = 0, PRICE, IPFS = '', currentPage = 1) =>
  {
    const initRender = ((currentPage*SHOW_PER_PAGE)-SHOW_PER_PAGE) < 1 ? 1: ((currentPage*SHOW_PER_PAGE)-SHOW_PER_PAGE)+1;
    const limitRender = (parseInt(START_COUNT)+(currentPage*SHOW_PER_PAGE));

    var itemsRender = [];

    for (let index = (parseInt(START_COUNT)+initRender); index <= limitRender; index++) 
    {
      try 
      {
        let ipfAddress = (IPFS+'/'+index+'.json');
        const tokenMetadata = await fetch(ipfAddress).then((response) => response.json());

        itemsRender.push({
          tokenIndex: index,
          tokenDescription: removeWords(tokenMetadata.description),
          tokenAttributes: tokenMetadata.attributes,
          tokenPrice: PRICE,
          tokenUrl: tokenMetadata.image
        });
      } catch (error) {
        break;
      }
    }

    setLoadMarket(false);
    setItemsRender(itemsRender);
  }

  const selectpage = (selected = 1) =>
  {
    if(selected === pageSelected)
      return;

    setLoadMarket(true);

    if(selected > showPages || selected < 0) {
      setPageSelected(1);
    }

    setPageSelected(selected);
    collectNfts(nftInfo.total_supply, nftInfo.price, nftInfo.ipfs, selected);
  }

  const selectBack = () => {
    if(pageSelected-1 < 1)
      return;

    setLoadMarket(true);
    setPageSelected(pageSelected-1);
    collectNfts(nftInfo.total_supply, nftInfo.price, nftInfo.ipfs, (pageSelected-1));
  }

  const selectNext = () => {
    if(pageSelected+1 > showPages)
      return;
      
    setLoadMarket(true);
    setPageSelected(pageSelected+1);
    collectNfts(nftInfo.total_supply, nftInfo.price, nftInfo.ipfs, (pageSelected+1));
  }

  const resetFilters = () => 
  {
    setLoadMarket(true);
    setClassNfts('normal');
    settingNfts_list('normal');

    document.querySelector('#normal-nfts').checked = true;
  }

  const changeClass_browse = (e) => 
  {
    setLoadMarket(true);
    setClassNfts(e.target.value);
    settingNfts_list(e.target.value);
  }

  // Render return
  const listNfts = () =>
  {
    if(loadMarket) {
      return(<Loading/>);
    } else if(itemsToRender.length > 0) {
      return(
        itemsToRender.map((item) => {
          return (
            <div key={item.tokenIndex}>
              <ArticleNft article={item}/>
            </div>
          );
        })
      );
    } else {
      return(
        <div className="w-full text-center max-w-[550px] select-none">
          <span className="text-red text-xl font-bold">All of our Ntfs have been sold. We suggest you keep an eye out, when someone puts your nfts up for sale.</span>
        </div>
      );
    }
  }

  const navSearchMenu = () =>
  {
    if(showPages > 1 && !loadMarket)
    { 
      let showMore = (pageSelected+4)
      let options = [];

      for (let index = pageSelected; index <= showPages && index < showMore; index++) {
        options.push(index);
      }

      return(
        <div className="w-full py-[20px] select-none">
          <ul className="flex justify-center items-center">
            <li className="w-[32px] h-[32px] md:w-[38px] md:h-[38px] flex justify-center items-center cursor-pointer text-black bg-yellow p-[4px] rounded-sm font-bold text-xl opacity-80 transition-all duration-300 hover:opacity-100" onClick={selectBack}><span><HiChevronLeft/></span></li>

            {options.map((item)=> {
              return(
                <li className={"flex items-center justify-center w-[32px] h-[32px] md:w-[38px] md:h-[38px] cursor-pointer text-black bg-white p-[4px] rounded-sm font-bold text-xl mx-[6px] opacity-80 transition-all duration-300 hover:opacity-100"+ (pageSelected === item ? ' opacity-100':'')} key={item} onClick={() => selectpage(item)}>
                  <span className="text-base">{item}</span>
                </li>
              );
            })}
            
            <li className="w-[32px] h-[32px] md:w-[38px] md:h-[38px] flex justify-center items-center cursor-pointer text-black bg-yellow p-[4px] rounded-sm font-bold text-xl opacity-80 transition-all duration-300 hover:opacity-100" onClick={selectNext}><span><HiChevronRight/></span></li>
          </ul>
        </div>
      );
    }
  }

  const iconMenuFilter = () =>
  {
    if(filtersMobile)
      return <MdClose id="iconMenuFilter" className='w-[22px] h-[22px]'/>
    else
      return <FiMenu id="iconMenuFilter" className="w-[22px] h-[22px]"/>
  }

  return(
    <div className="h-full">
      {/* Navbar Marketplace */}
      <div className="border-b border-gray-3 select-none fixed w-full top-[75px] left-0 z-[1000] bg-gray-6">
        <ul className="text-white font-bold flex flex-nowrap justify-between">
          <div className="flex flex-nowrap justify-start">             
            <li>
              <NavLink className={ ({isActive}) => (isActive ? 'bg-gray-1':'') + " transition-all duration-500 option-character flex items-center py-[16px] pl-[50px] pr-[20px]"} to="/characters">Characters
              </NavLink>
            </li>
          </div>

          <div className="pr-4 md:hidden flex justify-center items-center">
            <button onClick={() => toggle_menuFilter_mobile()} className={"p-1 border-2 rounded transition-all duration-500 " + (filtersMobile ? 'border-red':'')} id="button_menuFilter">
              <span>{iconMenuFilter()}</span>
            </button>
          </div>
        </ul>
      </div>

      {/* NFTs Market */}
      <div className="mt-[131px] flex flex-nowrap justify-items-stretch h-full">
        {/* Menu Filters */}
        <div className={"z-[800] bg-gray-6 w-[250px] fixed left-[-250px] h-full border-r border-gray-3 text-white md:left-0 md:w-[280px] transition-all ease-in-out duration-500 " + (filtersMobile ? 'transform translate- translate-x-[250px]':'')}>
          {/* Reset Button */}
          <div className="flex flex-nowrap justify-between text-lg py-[16px] px-[20px] border-b border-gray-3">
            <div className="cursor-default font-bold">Filter</div>
            <div className="cursor-pointer text-yellow select-none" onClick={resetFilters}>Reset</div>
          </div>

          {/* Class */}
          <div className="border-b border-gray-3 select-none option-nftsClass">
            <AccordionLayout title="Classes" active={true}>
              <div className="select-classNfts">
                {/* Option */}
                <div className="w-full option-classNfts mb-[10px]">
                  <label className="group w-full flex items-center cursor-pointer relative">
                    <input id="normal-nfts"  name="select-nftsClass" type="radio" className="h-5 w-5 invisible input-nftClass" defaultChecked={true} defaultValue={"normal"} onClick={changeClass_browse} />
                    <span className="absolute w-5 h-5 rounded-full flex justify-center items-center transition border border-gray-3 group-hover:border-yellow circle-inputRadio">
                      <span className="absolute w-3 h-3 transition rounded-full circle-intoInputRadio"></span>
                    </span>
                    <span className="ml-2">Normal</span>
                  </label>
                </div>

                {/* Option */}
                <div className="w-full option-classNfts mb-[10px]">
                  <label className="group w-full flex items-center cursor-pointer relative">
                    <input id="silver-nfts"  name="select-nftsClass" type="radio" className="h-5 w-5 invisible input-nftClass" value="silver" onClick={changeClass_browse} />
                    <span className="absolute w-5 h-5 rounded-full flex justify-center items-center transition border border-gray-3 group-hover:border-yellow circle-inputRadio">
                      <span className="absolute w-3 h-3 transition rounded-full circle-intoInputRadio"></span>
                    </span>
                    <span className="ml-2">Silver</span>
                  </label>
                </div>

                {/* Option */}
                <div className="w-full option-classNfts">
                  <label className="group w-full flex items-center cursor-pointer relative">
                    <input id="gold-nfts"  name="select-nftsClass" type="radio" className="h-5 w-5 invisible input-nftClass" value="gold" onClick={changeClass_browse} />
                    <span className="absolute w-5 h-5 rounded-full flex justify-center items-center transition border border-gray-3 group-hover:border-yellow circle-inputRadio">
                      <span className="absolute w-3 h-3 transition rounded-full circle-intoInputRadio"></span>
                    </span>
                    <span className="ml-2">Gold</span>
                  </label>
                </div>
              </div>
            </AccordionLayout>
          </div>
        </div>

        {/* NFTs */}
        <div className="w-full md:ml-[280px]">
          {/* Header */}
          <div className="bg-gray-6 flex flex-col items-center px-[40px] py-[16px] sm:justify-between sm:flex-row">
            {/* Title */}
            <div className="text-white font-bold text-2xl cursor-default mb-[16px] sm:mb-0"><h2>{minify_number((nftInfo.max_supply - nftInfo.total_supply), 3)} NFTs</h2></div>

            {/* Sort By */}
            {/* <ButtonSortBy/> */}
          </div>

          {/* NFTs List */}
          <div className="z-[300] w-full px-[20px] py-[10px] container-nfts">
            {/* Box NFts */}
            <div className="w-full h-full flex flex-wrap justify-center">
              {listNfts()}
            </div>

            {/* Nav */}
            {navSearchMenu()}
          </div>
        </div>
      </div>
    </div>
  );
}