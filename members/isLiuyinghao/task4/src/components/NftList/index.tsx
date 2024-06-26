import { Avatar, List, message } from 'antd'
import { useAccount, useReadContract, useWriteContract } from 'wagmi'

import type { ListItem } from '@type/index'
import { NFTMarket, marketplaceAddress } from '@contract/abi'
import { genCoinFuncVars, genGalleryFuncVars } from '@utils/contract'

import NftCardFooter from './NftCardFooter'

const DEFAULT_IMAGE = 'https://api.our-metaverse.xyz/ourms/6_pnghash_0cecc6d080015b34f60bdd253081f36e277ce20ceaf7a6340de3b06d2defad6a_26958469.webp'

function resolveActionText(nft: ListItem, account: any): string {
  if (!account) {
    return 'Buy'
  }

  if (nft.seller === account.address) {
    return nft.listing ? 'Unlist' : 'List'
  }

  return nft.listing ? 'Buy' : 'Not for sale'
}

function NftList() {
  const { address: signer } = useAccount()
  const [messageApi, contextHolder] = message.useMessage()
  const { writeContractAsync } = useWriteContract()
  const result = useReadContract({
    abi: NFTMarket,
    address: marketplaceAddress,
    functionName: 'getAll',
  })
  const data = (result.data || []) as ListItem[]

  // const buyNft = (nft: ListItem) => {
  //   if (!signer) {
  //     return messageApi.warning('Please connect wallet first.')
  //   }

  //   if (!nft.listing) {
  //     return messageApi.warning(`NFT ${nft.nftContract}#${Number(nft.tokenId)} is not for sale.`)
  //   }

  //   const args = [nft.nftContract, nft.tokenId]

  //   if (nft.seller === signer) {
  //     writeContractAsync(genGalleryFuncVars('unlist', args))
  //       .then(res => {
  //         console.log('unlist success: ', res)
  //         messageApi.success('Unlist success')
  //       })
  //       .catch(err => {
  //         console.log('unlist failed', err.message)
  //         messageApi.error('Unlist failed')
  //       })
  //   } else {
  //     writeContractAsync(genCoinFuncVars('approve', [marketplaceAddress, nft.price]))
  //       .then(res => {
  //         console.log('approve success', res)
  //         writeContractAsync(genGalleryFuncVars('buy', args))
  //           .then(res => {
  //             console.log('buy success: ', res)
  //             messageApi.success('Buy success')
  //           })
  //           .catch(err => {
  //             console.log('buy failed', err.message)
  //             messageApi.error('Buy failed')
  //           })
  //       })
  //       .catch(err => {
  //         console.log('approve failed', err.message)
  //         messageApi.error('approve failed')
  //       })
  //   }
  // }
  console.log(result)
  return (
    <>
      <div>
        <div className="mx-auto max-w-7xl grid gap-x-8 gap-y-20 px-6 lg:px-8 xl:grid-cols-3">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">NFT列表</h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">{contextHolder}</p>
          </div>
          <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 sm:gap-y-16 xl:col-span-2">
            <List
              itemLayout="horizontal"
              dataSource={data}
              renderItem={(item, index) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar src={item.tokenUrl} />}
                    title={<a href="https://ant.design">{item.nftContract}</a>}
                    description={<div><p>售价{item.price || 0} LOT</p><p>卖家{item.seller}</p></div>}
                  />
                </List.Item>
              )}
            />
          </div>
        </div>
      </div>

    </>
  )
}

export default NftList
