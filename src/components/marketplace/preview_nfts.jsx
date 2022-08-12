import React from "react";
import {TbArrowBackUp} from "react-icons/tb";

export function PreviewNft({article, showSale = false})
{
  const renderAttributes = ()=> 
  {
    if(article.tokenAttributes.length < 1)
      return;

    var attributesNft = {
      hair: '',
      clothes: '',
      mouth: ''
    };

    article.tokenAttributes.forEach(element => 
    {
      switch(element.trait_type)
      {
        case 'Hair':
        case 'hair':
          attributesNft.hair = element.value;
          break;
        case 'clothes':
        case 'Clothes':
        case 'clothing':
        case 'clothing with accs':
          attributesNft.clothes = element.value;
          break;
        case 'mouth':
        case 'Mouth':
        case 'MOUTH':
          attributesNft.mouth = element.value;
          break;
      }
    });

    return(
      <ul>
        <li><span className="font-bold text-lg">Hair: </span><span>{attributesNft.hair}</span></li>
        <li><span className="font-bold text-lg">Mouth: </span><span>{attributesNft.mouth}</span></li>
        <li><span className="font-bold text-lg">Clothes: </span><span>{attributesNft.clothes}</span></li>
      </ul>
    );
  }

  return(
    <div id="previewBox" className="fixed w-full h-full bg-light-gray top-0 left-0 z-[1300] flex justify-center items-center cursor-default select-none">
      <div className="bg-black rounded w-[90%] max-w-[1100px] overflow-hidden p-[30px] border border-gray-1">
        <div id="previewBack-container"><button id="previewBack" className="text-white flex items-center text-lg cursor-pointer font-bold"><span className="text-2xl mr-[6px]"><TbArrowBackUp/></span>Back</button></div>
        <div className="flex justify-center flex-wrap mt-[30px]" id="nftInfoBox">
          {/* Img */}
          <div><img className="object-cover w-[350px] h-[350px]" src={article.tokenUrl} alt={article.tokenDescription}/></div>

          {/* Description */}
          <div className="text-white pl-[40px]">
            <div className="border-b border-gray-3 pb-[4px] mb-[20px]"><span className="text-2xl font-bold text-yellow">{article.tokenDescription}</span></div>

            {/* Attributes */}
            {renderAttributes()}

            {/* Buy */}
            <div className={"mt-[20px] " + (showSale ? 'hidden':'')}>
              <button className="bg-red rounded-sm px-[12px] py-[8px] uppercase font-bold cursor-pointer transition-all duration-300 hover:shadow-sm hover:shadow-red"><span>{article.tokenPrice} BUSD | </span> Buy</button>
            </div>

            {/* Sell */}
            <div className={"mt-[20px] " + (showSale ? '':'hidden')}>
              <button className="bg-transparent border border-gray-3 text-gray-3 rounded-sm px-[12px] py-[8px] uppercase font-bold cursor-default">Sell</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}