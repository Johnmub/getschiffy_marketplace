import React from "react"
import ContentLoader from "react-content-loader"

const LoaderNft = (props) => (
  <ContentLoader 
    speed={3}
    width={190}
    height={277}
    viewBox="0 0 190 277"
    backgroundColor="#46567421"
    foregroundColor="#ffffff00"
    {...props}
  >
    <rect x="25" y="206" rx="1" ry="1" width="140" height="10" /> 
    <rect x="0" y="0" rx="1" ry="1" width="190" height="190" /> 
    <rect x="25" y="232" rx="1" ry="1" width="140" height="10" />
  </ContentLoader>
)

export default LoaderNft

