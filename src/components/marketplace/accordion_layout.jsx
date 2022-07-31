import React, { useState } from 'react';
import { HiChevronDown } from "react-icons/hi";

export default function AccordionLayout({title, active, children}) 
{
  const [activated, setActivated] = useState(active);
  
  const toggleAccordion = () => {activated ? setActivated(false): setActivated(true);};

  return (
    <div className='py-[16px] px-[20px]'>
      {/* Title */}
      <div onClick={() => toggleAccordion()} className='flex flex-nowrap justify-between cursor-pointer'>
        <div className=' font-bold'>{title}</div>
        <div className={'transition-all ease-in-out duration-500'+(activated ? ' rotate-180':'')}><HiChevronDown className='h-6 w-6'/></div>
      </div>

      {/* Children */}
      <div className={'transition-all ease-in-out duration-500 h-0 overflow-hidden'+(activated > 0 ? ' pt-[16px] h-[110px]':'')}>
        {children}
      </div>
    </div>
  );
};