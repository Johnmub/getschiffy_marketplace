import React, { useEffect, useState } from  "react";
import { NavLink } from "react-router-dom";
import { FiMenu } from "react-icons/fi";
import { MdClose } from "react-icons/md";

import AccordionLayout from "./accordion_layout";
import ButtonSortBy from "./button_sortBy";
import './marketplace.css';

export default function Marketplace()
{
  const [filtersMobile, setFiltersMobile ] = useState(false);

  useEffect(()=> { eventListeners() });

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
    if(active)
    {
      setFiltersMobile(false);
      return;
    }

    filtersMobile ? setFiltersMobile(false):setFiltersMobile(true);
  };

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
      <div className="border-b border-gray-3 select-none">
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
      <div className="flex flex-nowrap justify-items-stretch h-full">
        {/* Menu Filters */}
        <div className={"z-[800] bg-gray-6 w-[250px] absolute left-[-250px] h-full border-r border-gray-3 text-white md:w-[280px] md:static transition-all ease-in-out duration-500 overflow-hidden " + (filtersMobile ? 'transform translate-x-[250px]':'')}>
          {/* Reset Button */}
          <div className="flex flex-nowrap justify-between text-lg py-[16px] px-[20px] border-b border-gray-3">
            <div className="cursor-default font-bold">Filter</div>
            <div className="cursor-pointer text-yellow select-none">Reset</div>
          </div>

          {/* Class */}
          <div className="border-b border-gray-3 select-none option-nftsClass">
            <AccordionLayout title="Classes" active={true}>
              <div className="select-classNfts">
                {/* Option */}
                <div className="w-full option-classNfts mb-[10px]">
                  <label className="group w-full flex items-center cursor-pointer relative">
                    <input id="normal-nfts"  name="select-nftsClass" type="radio" className="h-5 w-5 invisible input-nftClass" defaultChecked={true} defaultValue={"normal"} />
                    <span className="absolute w-5 h-5 rounded-full flex justify-center items-center transition border border-gray-3 group-hover:border-yellow circle-inputRadio">
                      <span className="absolute w-3 h-3 transition rounded-full circle-intoInputRadio"></span>
                    </span>
                    <span className="ml-2">Normal</span>
                  </label>
                </div>

                {/* Option */}
                <div className="w-full option-classNfts mb-[10px]">
                  <label className="group w-full flex items-center cursor-pointer relative">
                    <input id="silver-nfts"  name="select-nftsClass" type="radio" className="h-5 w-5 invisible input-nftClass" value="silver"/>
                    <span className="absolute w-5 h-5 rounded-full flex justify-center items-center transition border border-gray-3 group-hover:border-yellow circle-inputRadio">
                      <span className="absolute w-3 h-3 transition rounded-full circle-intoInputRadio"></span>
                    </span>
                    <span className="ml-2">Silver</span>
                  </label>
                </div>

                {/* Option */}
                <div className="w-full option-classNfts">
                  <label className="group w-full flex items-center cursor-pointer relative">
                    <input id="gold-nfts"  name="select-nftsClass" type="radio" className="h-5 w-5 invisible input-nftClass" value="gold"/>
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
        <div className="w-full">
          {/* Header */}
          <div className="bg-gray-6 flex flex-col items-center px-[40px] py-[16px] sm:justify-between sm:flex-row">
            {/* Title */}
            <div className="text-white font-bold text-2xl cursor-default mb-[16px] sm:mb-0"><h2>0.00 NFTs</h2></div>

            {/* Sort By */}
            <ButtonSortBy/>
          </div>

          {/* NFTs List */}
          <div className="z-[300] text-center mt-[16px]">
            <p className="font-semibold m-auto text-xl text-white w-[80%] md:w-[35%] border-b border-dotted border-b-gray-3 pb-2">Coming Soon!</p>
          </div>
        </div>
      </div>
    </div>
  );
}