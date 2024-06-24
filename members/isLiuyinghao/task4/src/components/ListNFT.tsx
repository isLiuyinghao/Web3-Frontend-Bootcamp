import { useState } from 'react'
import { ethers } from 'ethers'
import { useWriteContract, useSimulateContract } from 'wagmi'

const ListNFT = ({ contractAddress, erc721Abi }) => {
  const [nftAddress, setNftAddress] = useState('')
  const [tokenId, setTokenId] = useState('')
  const [price, setPrice] = useState('')

  const { data } = useSimulateContract({
    address: contractAddress,
    abi: erc721Abi,
    functionName: 'listItem',
    args: [nftAddress, tokenId, ethers.utils.parseUnits(price, 18)],
  })

  const { writeContract } = useWriteContract()

  const handleSubmit = (event) => {
    event.preventDefault()
    writeContract?.(data!.request)
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="NFT Contract Address"
        value={nftAddress}
        onChange={(e) => setNftAddress(e.target.value)}
      />
      <input
        type="text"
        placeholder="Token ID"
        value={tokenId}
        onChange={(e) => setTokenId(e.target.value)}
      />
      <input
        type="text"
        placeholder="Price (in ERC20 tokens)"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />
      <button type="submit">List NFT</button>
    </form>
  )
}

export default ListNFT
