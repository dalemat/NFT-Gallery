import Web3 from 'web3';
import axios from 'axios';
import { SMART_CONTRACT, RPC_URL } from '../config/contract';

// Minimal ABI for NFT contract
const MINIMAL_ABI = [
    {
        "inputs": [],
        "name": "totalSupply",
        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{"internalType": "uint256", "name": "index", "type": "uint256"}],
        "name": "tokenByIndex",
        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{"internalType": "uint256", "name": "tokenId", "type": "uint256"}],
        "name": "tokenURI",
        "outputs": [{"internalType": "string", "name": "", "type": "string"}],
        "stateMutability": "view",
        "type": "function"
    }
];

export const fetchNFTs = async () => {
    try {
        console.log('Starting NFT fetch process...');

        // Initialize Web3 with HTTP provider
        const web3 = new Web3(RPC_URL);
        console.log('Web3 initialized');

        // Create contract instance
        const contract = new web3.eth.Contract(MINIMAL_ABI, SMART_CONTRACT);
        console.log('Contract instance created');

        // Get total supply
        const totalSupply = await contract.methods.totalSupply().call();
        console.log('Total supply:', totalSupply);

        const nfts = [];
        const limit = Math.min(50, parseInt(totalSupply));

        console.log(`Fetching ${limit} NFTs...`);

        for (let i = 0; i < limit; i++) {
            try {
                // Get token ID
                const tokenId = await contract.methods.tokenByIndex(i).call();
                console.log(`Fetching token ${i + 1}/${limit}, ID: ${tokenId}`);

                // Get token URI
                const tokenUri = await contract.methods.tokenURI(tokenId).call();
                console.log('Token URI:', tokenUri);

                // Fetch metadata
                const metadata = await fetchMetadata(tokenUri);
                console.log('Metadata:', metadata);

                nfts.push({
                    tokenId: tokenId,
                    name: metadata.name || `NFT #${tokenId}`,
                    description: metadata.description || 'No description available',
                    image: resolveImageUrl(metadata.image),
                    attributes: metadata.attributes || []
                });

                console.log(`Successfully processed NFT #${tokenId}`);
            } catch (error) {
                console.error(`Error fetching NFT ${i}:`, error);
            }
        }

        console.log('Successfully fetched NFTs:', nfts.length);
        return nfts;

    } catch (error) {
        console.error("Error in fetchNFTs:", error);
        throw new Error(`Failed to fetch NFTs: ${error.message}`);
    }
};

const fetchMetadata = async (uri) => {
    try {
        const url = resolveUrl(uri);
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error("Error fetching metadata:", error);
        return {
            name: "Unknown NFT",
            description: "Metadata unavailable",
            image: "https://via.placeholder.com/400",
            attributes: []
        };
    }
};

const resolveUrl = (url) => {
    if (!url) return null;
    if (url.startsWith('ipfs://')) {
        return `https://ipfs.io/ipfs/${url.slice(7)}`;
    }
    return url;
};

const resolveImageUrl = (url) => {
    if (!url) return "https://via.placeholder.com/400";
    if (url.startsWith('ipfs://')) {
        return `https://ipfs.io/ipfs/${url.slice(7)}`;
    }
    return url;
};
