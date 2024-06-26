import { useAccount, useConnect, useDisconnect } from 'wagmi'

export default function ConnectWallet() {
  const { addresses, isConnected } = useAccount()
  const { connect, connectors } = useConnect()
  const { disconnect } = useDisconnect()

  if (isConnected) {
    return (
      <div>
        <div>
          已授权账号地址：{addresses?.map(address => (
            <p>{address}</p>
          ))}
        </div>
        <button className="bg-sky-500 hover:bg-sky-700" onClick={() => disconnect()}> Disconnect </button>
      </div>
    )
  }


  return (
    <div>
      {
        connectors.map((connector) => (
          <button key={connector.id} onClick={() => connect({ connector })} className="bg-sky-500 hover:bg-sky-700">
            Connect with {connector.name}
          </button>
        ))}
    </div>
  )
}