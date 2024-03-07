"use client";
import React, {useEffect, useState} from 'react';
import {Chain, Coin, getChains, getCoins} from "@/components/blockchain/coindata";
import { Skeleton } from "@/components/ui/skeleton"
import ChainSelector from "@/components/blockchain/ChainSelector";
import CoinSelector from "@/components/blockchain/CoinSelector";
import {ethers, Signer} from "ethers";
import {Button} from "@/components/ui/button";
import {toast} from "@/components/ui/use-toast";



declare global {
    interface Window {
        ethereum?: any; // Optional property
    }
}
interface CryptoPaymentProps {
    amount: number;
    onSuccess: (data: any) => void;
    onFail: (data: any) => void;
}
const CryptoPayment = ({ amount, onSuccess, onFail } : CryptoPaymentProps) => {

    const [isLoading, setIsLoading] = useState(false);
    const [selectedChain, setSelectedChain] = useState<Chain | null>(null);
    const [selectedCoin, setSelectedCoin] = useState<Coin | null>(null);
    const [selectNetwork, setSelectNetwork] = useState<number | null>(null);
    const [selectContract, setSelectContract] = useState<string | null>(null);
    const [signer, setSigner] = useState<Signer | null >(null);
    const [userAddress, setUserAddress] = useState<string | null>(null);
    const recipientAddress = process.env.CRYPTO_RECIPIENT_ADDRESS || "0xc146401f1c5dfb20e2b77fe9ae3892bec2a0b01b";

    useEffect(() => {
        connectToWallet();
    }, []);
    const connectToWallet = async () => {
        if (window.ethereum == null) {
            alert("MetaMask not installed; using read-only defaults");
            setSigner(null);
            setUserAddress(null);
        } else {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            await provider.send('eth_requestAccounts', []); // <- this promps user to connect metamask
            const signer = provider.getSigner();
            setSigner(signer);
            // Get user address
            const address = await signer.getAddress();
            setUserAddress(address);
        }
    };

    const switchNetwork = async (chainId: number) => {
        if (chainId === selectNetwork) {
            return;
        }
        let networkParams;
        const chainHexString = '0x' + chainId.toString(16);
        networkParams = { chainId: chainHexString };

        try {
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [networkParams],
            });

            const provider = new ethers.providers.Web3Provider(window.ethereum);
            await provider.send('eth_requestAccounts', []); // <- this prompts user to connect metamask
            const signer = provider.getSigner();
            setSigner(signer);
            setSelectNetwork(chainId);

        } catch (error: any) {
            console.error('Error switching network:', error.message);
        }
    }

    function onSelectedChain(chain: Chain) {
        setSelectedChain(chain);
        switchNetwork(chain.chainId).then(r => {
            console.log("SwitchNetwork done")
        });
    }
    function onSelectCoin(coin: Coin) {
        setSelectedCoin(coin);
        setSelectContract(coin.contract || null);
    }

    const sendTrans = async () => {

        setIsLoading(true)

        if (selectContract !== null && signer !== null && userAddress !== null) {
            const abiErc20 = [
                "function balanceOf(address) public view returns(uint)",
                "function deposit() public payable",
                "function transfer(address, uint) public returns (bool)",
                "function withdraw(uint) public",
            ];
            const contract = new ethers.Contract(selectContract, abiErc20, signer)
            const amountEther = ethers.utils.parseUnits(amount + "", 18);
            const transferData = contract.interface.encodeFunctionData("transfer", [
                recipientAddress,
                amountEther,
            ]);
            const transaction = {
                to: recipientAddress,
                data: transferData,
                value: amountEther,
                gasLimit: 50000,
            };
            signer?.sendTransaction(transaction)
                .then((tx) => {
                    console.log("Transaction sent:", tx);
                    // Extract key information
                    const hash = tx.hash;
                    const data = {
                        hash,
                    };
                    onSuccess(data);
                    setTimeout(() => {
                        setIsLoading(false)
                    }, 1500);
                })
                .catch((error) => {
                    console.error("Error sending transaction:", error);
                    setIsLoading(false)
                    onFail(transaction);

                });
        }

    };


    return (
        <div className="h-[70vh] w-[480px] bg-gradient-to-br from-blue-800 to-blue-900 rounded-lg flex justify-center text-white relative">
            {isLoading ? (
                <div className="flex flex-col gap-4 items-center justify-center">
                    <Skeleton className="h-[225px] w-[250px] rounded-xl"/>
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-[250px]"/>
                        <Skeleton className="h-4 w-[200px]"/>
                    </div>
                    <p>Transaction Processing...</p>
                </div>
            ) : (
                <div className="flex flex-col gap-4 w-full p-10 items-center">
                    <ChainSelector
                        selectedChain={selectedChain}
                        onSelectedChain={onSelectedChain}
                        getChains={getChains()}
                    />
                    <CoinSelector
                        selectedCoin={selectedCoin}
                        onSelectCoin={onSelectCoin}
                        getCoins={getCoins(selectedChain ? selectedChain.name : null)}
                    />

                    <p className={"text-[50px] text-white text-center p-4"}>${amount}</p>


                    {userAddress === null &&  <Button className="w-full p-4 bg-blue-800 text-white rounded-2xl" onClick={connectToWallet}>Connect to Wallet</Button>}
                    <div className="flex flex-col gap-2 p-1">
                        {(userAddress !== null && selectContract !== null && signer !== null) &&
                            (<div className="flex flex-col gap-4">
                                <Button onClick={sendTrans} className="w-[300px] p-4 bg-blue-800 text-white rounded-2xl hover:bg-blue-700">Pay</Button>
                            </div>)
                        }
                    </div>

                    <div className={"flex flex-col items-center justify-center  bottom-1 p-1"}>
                        <p className="text-sm">Select a chain and a coin & Pay</p>
                        {userAddress != null &&
                        <p className="text-sm p-2 w-full absolute bottom-0 bg-blue-800 text-white text-center hover:bg-blue-700">{userAddress}</p>}
                    </div>
                </div>
            )}

        </div>
    );
};

export default CryptoPayment;