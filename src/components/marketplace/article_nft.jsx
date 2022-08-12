import React, { useState } from "react";
import { PreviewNft } from "./preview_nfts";
import LoaderNft from '../utilities/loader_nft'; 

export default function ArticleNft({article, showSale = false})
{
  const [imageLoaded, setImageLoaded] = useState(false);
  const [openPreview, setOpenPreview] = useState(false);

  const showSale_button = (article) => 
  {
    if(!imageLoaded)
      return(<></>);

    if(!showSale) {
      return(
      <div className={"font-bold text-lg text-center px-[4px] py-[8px] border border-gray-3 rounded-bl-sm rounded-br-sm " + (imageLoaded ? "":'hidden')}>
        <span className="text-white select-none">Price: </span>
        <span className="text-yellow">{article.tokenPrice} BUSD</span>
      </div>
      );
    }

    return(
      <div key={article.tokenIndex} className={"cursor-pointer font-bold text-base text-center px-[4px] py-[8px] border border-gray-3 rounded-bl-sm rounded-br-sm " + (imageLoaded ? "":'hidden')}><span className="text-gray-1 select-none">Sell</span></div>
    );
  }

  const toggleOpen_preview = (event) => 
  {
    let idTarget = event.target.id;

    if(openPreview && (idTarget == 'previewBox' || idTarget == 'previewBack-container' || idTarget == 'previewBack')) {
      setOpenPreview(false);
      return;
    }
    
    setOpenPreview(true);
  }

  const showPreview = () => 
  {
    if(!openPreview || !imageLoaded)
      return;

    return(<PreviewNft article={article} showSale={showSale}/>);
  }

  return(
    <div className="cursor-pointer max-w-[190px] group m-[12px]" key={article.tokenIndex} onClick={toggleOpen_preview}>
      {!imageLoaded && <LoaderNft/>}

      {showPreview()}

      {/* Image */}
      <div className={"rounded-tl-sm rounded-tr-sm overflow-hidden select-none " + (imageLoaded ? "":'hidden')}>
        <img src={article.tokenUrl} alt={article.tokenDescription} className={"object-cover w-[190px] h-[190px] group-hover:scale-[1.05] transition-all duration-500"} onLoad={()=> setTimeout(()=> setImageLoaded(true), 1000)}/>
      </div>
      
      {/* Description */}
      <div className={"text-base text-center px-[4px] max-h-[46px] py-[8px] border border-gray-3 border-b-0 rounded-bl-sm rounded-br-sm overflow-hidden " + (imageLoaded? "":'hidden')}><span className="text-white select-none">{article.tokenDescription}</span></div>

      {showSale_button(article)}
    </div>
  );
}