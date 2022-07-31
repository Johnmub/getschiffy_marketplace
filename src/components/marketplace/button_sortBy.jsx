import React, { useState } from 'react';
import { HiChevronDown } from "react-icons/hi";

export default function ButtonSortBy()
{
  const [activeMenu, setActiveMenu] = useState(false);
  const [titleMenu, setTitleMenu] = useState('Lowest Price');

  const ToggleButtonMenu = () => {
    activeMenu ? setActiveMenu(false): setActiveMenu(true);
  };

  const ChangeOrder = (sort) => 
  {
    // Aqui haremos la logica para ordenar los NFTs
    setTitleMenu(sort);
  };

  document.addEventListener('click', (ev) => 
  {
    if(ev.target.id !== 'sortBy_button' && ev.target.id !== 'arrowDown_sortby')
      setActiveMenu(false)
  });

  return(
    <div className='relative select-none z-[1]'>
      {/* Button */}
      <div>
        <button onClick={ToggleButtonMenu} className='w-[170PX] flex flex-nowrap justify-between items-center text-white border border-gray-3 rounded px-[20px] py-[8px] transition ease-in-out duration-500 hover:bg-gray-3' id='sortBy_button'>{titleMenu}<span className={'transition ease-in-out duration-500'+(activeMenu? ' rotate-180':'')}><HiChevronDown className='w-5 h-5' id='arrowDown_sortby'/></span>
        </button>
      </div>

      {/* Menu */}
      <div className={'bg-gray-6 mt-[4px] border transition-all ease-in-out duration-500 h-0 w-full absolute rounded overflow-hidden'+(activeMenu? ' h-[132px] border-gray-3':' border-transparent')} id='sortBy_menu'>
        <ul className='text-white'>
          <li onClick={()=> ChangeOrder('Lowest Price')} className='px-[12px] py-[10px] cursor-pointer hover:bg-gray-3 transition duration-500'>Lowest Price</li>
          <li onClick={()=> ChangeOrder('Highest Price')} className='px-[12px] py-[10px] cursor-pointer hover:bg-gray-3 transition duration-500'>Highest Price</li>
          <li onClick={()=> ChangeOrder('Lates')} className='px-[12px] py-[10px] cursor-pointer hover:bg-gray-3 transition duration-500'>Lates</li>
        </ul>
      </div>
    </div>
  );
}