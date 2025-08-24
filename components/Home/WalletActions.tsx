import {  useAccount,
  useConnect,
  useDisconnect,
  useSendTransaction,
  useSwitchChain,
  useWalletClient
} from 'wagmi'
import { useState } from 'react'
import { useFrame } from '../farcaster-provider'
import { parseEther, encodeFunctionData } from 'viem/utils'
import { monadTestnet } from 'viem/chains'
import { farcasterMiniApp as miniAppConnector } from '@farcaster/miniapp-wagmi-connector'


// ABI mínima para PayLinkNative
const PAYLINK_ABI = [
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_treasury",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "_feeRecipient",
				"type": "address"
			},
			{
				"internalType": "uint16",
				"name": "_feeBps",
				"type": "uint16"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [],
		"name": "InvalidBps",
		"type": "error"
	},
	{
		"inputs": [],
		"name": "NoValue",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "resourceId",
				"type": "string"
			}
		],
		"name": "pay",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "TransferFailed",
		"type": "error"
	},
	{
		"inputs": [],
		"name": "ZeroAddress",
		"type": "error"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "buyer",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "resourceId",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "ts",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "fee",
				"type": "uint256"
			}
		],
		"name": "PaymentReceived",
		"type": "event"
	},
	{
		"stateMutability": "payable",
		"type": "receive"
	},
	{
		"inputs": [],
		"name": "feeBps",
		"outputs": [
			{
				"internalType": "uint16",
				"name": "",
				"type": "uint16"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "feeRecipient",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "treasury",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`

export function WalletActions() {
  const { isEthProviderAvailable } = useFrame()
  const { isConnected, address, chainId } = useAccount()
  const { disconnect } = useDisconnect()
  const { data: hash, sendTransaction } = useSendTransaction()
  const { switchChain } = useSwitchChain()
  const { connect } = useConnect()
  const { data: walletClient } = useWalletClient()
  const [paying, setPaying] = useState(false)
  const [payTx, setPayTx] = useState<string | null>(null)
  const [payError, setPayError] = useState<string | null>(null)

  // Ejemplo: resourceId y precio
  const resourceId = 'demo-pdf-1mon'
  const price = '0.01' // 0.01 MON

async function payWithMonad() {
  if (!walletClient) return
  setPaying(true)
  setPayError(null)
  try {
    const data = encodeFunctionData({
      abi: PAYLINK_ABI,
      functionName: 'pay',
      args: [resourceId],
    })
    const hash = await walletClient.sendTransaction({
      to: CONTRACT_ADDRESS,
      value: parseEther(price),
      data, // use the encoded data here
      chain: monadTestnet,
    })
    setPayTx(hash)
  } catch (e: any) {
    setPayError(e.message || 'Error')
  } finally {
    setPaying(false)
  }
}

  async function sendTransactionHandler() {
    sendTransaction({
      to: '0x7f748f154B6D180D35fA12460C7E4C631e28A9d7',
      value: parseEther('1'),
    })
  }

  if (isConnected) {
    return (
      <div className="space-y-4 border border-[#333] rounded-md p-4">
        <div className="flex flex-row space-x-4 justify-start items-start">
          <div className="flex flex-col space-y-4 justify-start">
            <p className="text-sm text-left">
              Connected to wallet:{' '}
              <span className="bg-white font-mono text-black rounded-md p-[4px]">
                {address}
              </span>
            </p>
            <p className="text-sm text-left">
              Chain Id:{' '}
              <span className="bg-white font-mono text-black rounded-md p-[4px]">
                {chainId}
              </span>
            </p>
            {chainId === monadTestnet.id ? (
              <div className="flex flex-col space-y-2 border border-[#333] p-4 rounded-md">
                <h2 className="text-lg font-semibold text-left">
                  Pagar con Monad (PayLinkNative)
                </h2>
                <div className="text-sm mb-2">Producto: PDF Demo<br/>Precio: {price} MON<br/>resourceId: {resourceId}</div>
                <button
                  type="button"
                  className="bg-blue-500 text-white rounded-md p-2 text-sm disabled:opacity-50"
                  onClick={payWithMonad}
                  disabled={paying}
                >
                  {paying ? 'Pagando...' : 'Pagar con Monad'}
                </button>
                {payTx && (
                  <button
                    type="button"
                    className="bg-white text-black rounded-md p-2 text-sm"
                    onClick={() =>
                      window.open(
                        `https://testnet.monadexplorer.com/tx/${payTx}`,
                        '_blank',
                      )
                    }
                  >
                    Ver transacción
                  </button>
                )}
                {payError && <div className="text-red-500 text-xs">{payError}</div>}
              </div>
            ) : (
              <button
                type="button"
                className="bg-white text-black rounded-md p-2 text-sm"
                onClick={() => switchChain({ chainId: monadTestnet.id })}
              >
                Switch to Monad Testnet
              </button>
            )}

            <button
              type="button"
              className="bg-white text-black rounded-md p-2 text-sm"
              onClick={() => disconnect()}
            >
              Disconnect Wallet
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (isEthProviderAvailable) {

    return (
      <div className="space-y-4 border border-[#333] rounded-md p-4">
        <h2 className="text-xl font-bold text-left">sdk.wallet.ethProvider</h2>
        <div className="flex flex-row space-x-4 justify-start items-start">
          <button
            type="button"
            className="bg-white text-black w-full rounded-md p-2 text-sm"
            onClick={() => connect({ connector: miniAppConnector() })}
          >
            Connect Wallet
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4 border border-[#333] rounded-md p-4">
      <h2 className="text-xl font-bold text-left">sdk.wallet.ethProvider</h2>
      <div className="flex flex-row space-x-4 justify-start items-start">
        <p className="text-sm text-left">Wallet connection only via Warpcast</p>
      </div>
    </div>
  )
}
