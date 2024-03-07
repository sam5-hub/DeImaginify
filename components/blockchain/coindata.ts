export interface Chain {
    id: number;
    name: string;
    image: string; // Remote image URL
    localImage: string; // Path to local image
    chainId: number;
}
const getChains: () => Chain[] = () => [
    {
        id: 4,
        name: "BSC",
        image:"https://cryptologos.cc/logos/binance-coin-bnb-logo.svg",
        localImage:"/coin/bsc.svg",
        chainId: 56
    },

    {
        id: 3,
        name: "Polygon",
        image:"https://cryptologos.cc/logos/polygon-matic-logo.svg",
        localImage:"/coin/polygon.svg",
        chainId: 137
    },
    {
        id: 2,
        name: "Ethereum",
        image:"https://cryptologos.cc/logos/ethereum-eth-logo.svg",
        localImage:"/coin/ethereum.svg",
        chainId: 1,
    },

];
export interface Coin {
    name: string;
    chain: string;
    image: string;
    secondImage: string;
    enable: number;
    contract?: string; // Optional property
}

const getCoins = (chainName: string | null): Coin[] => {
    const coins: Coin[] = [
        {
            name: "BNB-USDT",
            chain: "BSC",
            image: "https://cryptologos.cc/logos/binance-coin-bnb-logo.svg",
            secondImage: "https://cryptologos.cc/logos/tether-usdt-logo.svg",
            enable: 0,
            contract: "0x55d398326f99059ff775485246999027b3197955",
        },
        {
            name: "MATIC-USDT",
            chain: "Polygon",
            image: "https://cryptologos.cc/logos/polygon-matic-logo.svg",
            secondImage: "https://cryptologos.cc/logos/tether-usdt-logo.svg",
            enable: 0,
            contract: "0x2791bca1f2de4661ed88a30c99a7a9449aa84174",
        },
        {
            name: "ETH-USDT",
            chain: "Ethereum",
            image: "https://cryptologos.cc/logos/ethereum-eth-logo.svg",
            secondImage: "https://cryptologos.cc/logos/tether-usdt-logo.svg",
            enable: 0,
            contract: "0xdac17f958d2ee523a2206206994597c13d831ec7",
        },
    ];

    if (chainName !== null) {
        coins.forEach((coin) => {
            coin.enable = coin.chain === chainName ? 1 : 0;
        });
    }

    return coins;
};


export { getChains, getCoins };