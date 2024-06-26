import dayjs from 'dayjs'
import type { PropsWithChildren } from 'react'

import type { NftItem } from '@type/index'

type NftCardFooterProps = PropsWithChildren<{ dataSource: NftItem }>

function NftCardFooter(props: NftCardFooterProps) {
  const { dataSource } = props

  return (
    <div className="NftCardFooter">
      <div>
        <span>合约地址</span>
        {/* <Address address={dataSource.nftContract} ellipsis={{ headClip: 8, tailClip: 6 }} copyable /> */}
        {dataSource.nftContract}
      </div>
      <div>
        <span>卖家地址</span>
        {dataSource.seller}
      </div>
      <div>
        <span>上架时间</span>
        <span>{dayjs(Number(dataSource.listedAt) * 1000).format('YYYY-MM-DD HH:mm:ss')}</span>
      </div>
    </div>
  )
}

export default NftCardFooter
