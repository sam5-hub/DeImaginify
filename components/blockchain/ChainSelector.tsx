"use client";
import React from 'react';

interface ChainSelectorProps {
    selectedChain: any;
    onSelectedChain: (chain: any) => void;
    getChains: any;
}
const ChainSelector = ({ selectedChain, onSelectedChain, getChains }: ChainSelectorProps) => {
    return (
        <>
            <p>MainNet Chains</p>
            <div className="flex flex-row gap-4">
                {getChains.map((chain: any) => {
                    const backgroundColor = selectedChain!==null && chain.name === selectedChain.name ? 'bg-gray-900' : 'bg-white';
                    const textColor = selectedChain!==null && chain.name === selectedChain.name ? 'text-white' : 'text-black';
                    const hoverColor = selectedChain!==null && chain.name === selectedChain.name ? 'bg-gray-900' : 'bg-gray-300';

                    return (
                        <div
                            className={`flex flex-col gap-2 items-center 
                                p-4 rounded-2xl w-24 h-24
                                ${backgroundColor} hover:${hoverColor} cursor-pointer`}
                            onClick={() => {
                                onSelectedChain(chain)
                            }}
                            key={chain.name}
                        >
                            <img src={chain.image} alt={chain.name} className="h-10 w-10 object-contain"/>
                            <p className={`${textColor} text-sm`}>{chain.name}</p>
                        </div>
                    );
                })}
            </div>
        </>
    );
};

export default ChainSelector;
