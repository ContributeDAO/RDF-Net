import { ethers } from 'ethers';

// 合约地址
const contractAddress = '0x98b0843643b2D402043545c2E33449Bf5e6eD643';

// 简化的合约 ABI
const abi = [
    {
      "inputs": [],
      "name": "owner",
      "outputs": [{"internalType": "address", "name": "", "type": "address"}],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [{"internalType": "uint256", "name": "_tokenId", "type": "uint256"}],
      "name": "getDataEntry",
      "outputs": [
        {"internalType": "string", "name": "", "type": "string"},
        {"internalType": "string", "name": "", "type": "string"}
      ],
      "stateMutability": "view",
      "type": "function"
    }
];

// 连接到 Sepolia 网络
const provider = new ethers.providers.JsonRpcProvider('https://eth-sepolia.g.alchemy.com/v2/T2CHWuaiTeSDQ4jwgxT73pQGfeDQQEao');

async function readContractInfo() {
    try {
        console.log('Connecting to contract at address:', contractAddress);
        const contract = new ethers.Contract(contractAddress, abi, provider);

        try {
            const owner = await contract.owner();
            console.log('Contract Owner (Deployer Wallet Address):', owner);
        } catch (error) {
            console.error('Error reading owner:', error.message);
        }

        console.log('Attempting to read data entries...');
        let foundEntries = false;
        for (let i = 0; i < 10; i++) { // 尝试读取前10个tokenId
            try {
                console.log(`Attempting to read tokenId: ${i}`);
                const data = await contract.getDataEntry(i);
                console.log(`Data for tokenId ${i}:`, data);
                foundEntries = true;
                
                console.log('Data Entry:');
                console.log('  Token ID:', i);
                console.log('  Title:', data[0]);
                console.log('  Content:', data[1]);
            } catch (error) {
                console.log(`Error reading tokenId ${i}:`, error.message);
                // 不立即退出循环，继续尝试下一个tokenId
            }
        }

        if (!foundEntries) {
            console.log('No valid data entries found in the first 10 tokenIds.');
        }

    } catch (error) {
        console.error('Fatal error reading contract:', error);
        console.error('Error details:', error.stack);
    }
}

readContractInfo();