import { ethers } from 'ethers';

// 合约地址 (需要替换为实际部署的 CampaignRegistry 合约地址)
const contractAddress = '0xf18da8f4b4d1163ab35b96817b2901c60aa1152d';

// 连接到 Sepolia 网络
const provider = new ethers.providers.JsonRpcProvider('https://eth-sepolia.g.alchemy.com/v2/T2CHWuaiTeSDQ4jwgxT73pQGfeDQQEao');

// 指定 ABI (已根据新的合约结构更新)
const abi = [
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "address",
          "name": "campaignAddress",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "name",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "content",
          "type": "string"
        }
      ],
      "name": "CampaignRegistered",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "campaignAddress",
          "type": "address"
        },
        {
          "internalType": "string",
          "name": "name",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "content",
          "type": "string"
        }
      ],
      "name": "registerCampaign",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "campaigns",
      "outputs": [
        {
          "internalType": "address",
          "name": "campaignAddress",
          "type": "address"
        },
        {
          "internalType": "string",
          "name": "name",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "content",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "startIndex",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "count",
          "type": "uint256"
        }
      ],
      "name": "getCampaigns",
      "outputs": [
        {
          "components": [
            {
              "internalType": "address",
              "name": "campaignAddress",
              "type": "address"
            },
            {
              "internalType": "string",
              "name": "name",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "content",
              "type": "string"
            }
          ],
          "internalType": "struct CampaignRegistry.CampaignInfo[]",
          "name": "",
          "type": "tuple[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getCampaignsCount",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ]
  ;

async function readContractInfo() {
    try {
        // 创建合约实例
        const contract = new ethers.Contract(contractAddress, abi, provider);

        // 读取已注册的活动数量
        const campaignsCount = await contract.getCampaignsCount();
        console.log('Total Registered Campaigns:', campaignsCount.toString());

        for (let i = 0; i < campaignsCount.toNumber(); i++) {
                const campaign = await contract.campaigns(i);
                console.log(`Campaign ${i}:`);
                console.log('  Address:', campaign.campaignAddress);
                console.log('  Initiator:', campaign.initiator);
                console.log('  Name:', campaign.name);
                console.log('  Content:', campaign.content);
                console.log('---');
            }


    } catch (error) {
        console.error('Error reading contract:', error);
        console.error('Error details:', error.stack);
    }
}

readContractInfo();