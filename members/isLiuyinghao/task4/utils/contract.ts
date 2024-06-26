import { LiuToken, LiuNFT, NFTMarket, LiuTokenAddress, LiuNFTAddress, marketplaceAddress } from '@contract/abi'

function genCoinFuncVars(functionName: string, args?: any[]) {
  return { abi: LiuToken, address: LiuTokenAddress, functionName, args } as any
}

function genNftFuncVars(functionName: string, args?: any[]) {
  return { abi: LiuNFT, address: LiuNFTAddress, functionName, args } as any
}

function genGalleryFuncVars(functionName: string, args?: any[]) {
  return { abi: NFTMarket, address: marketplaceAddress, functionName, args } as any
}

export { genCoinFuncVars, genNftFuncVars, genGalleryFuncVars }
