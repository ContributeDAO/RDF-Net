import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { Campaign } from '../types/campaign';
import { CAMPAIGN_ABI, CAMPAIGN_FACTORY_ADDRESS } from '../utils/constants';

export const useWeb3 = () => {
  const [account, setAccount] = useState<string | null>(null);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);

  const connect = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0]);
      } catch (error) {
        console.error("Failed to connect wallet:", error);
      }
    }
  };

  const disconnect = () => {
    setAccount(null);
    // Note: MetaMask doesn't provide a way to programmatically disconnect
    // We're just clearing the local state here
  };

  const createCampaign = async (title: string, goal: number) => {
    // 实现创建众筹的逻辑
  };

  const contribute = async (campaignId: string, amount: number) => {
    // 实现参与众筹的逻辑
  };

  useEffect(() => {
    // 获取众筹列表的逻辑
  }, [account]);

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        setAccount(accounts[0] || null);
      });

      // Clean up listener on component unmount
      return () => {
        window.ethereum.removeListener('accountsChanged', (accounts: string[]) => {
          setAccount(accounts[0] || null);
        });
      };
    }
  }, []);

  return { connect, disconnect, account, campaigns, createCampaign, contribute };
};