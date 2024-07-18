import React, { useState } from "react";
import { ethers } from "ethers";
import DataNFTContractABI from "../../artifacts/contracts/DataNFTContract.sol/DataNFTContract.json";

interface CampaignFormProps {
  onClose: () => void;
}

const CampaignForm: React.FC<CampaignFormProps> = ({ onClose }) => {
  const [title, setTitle] = useState("");
  const [introduction, setIntroduction] = useState("");
  const [reward, setReward] = useState("");
  const [isDeploying, setIsDeploying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deployedAddress, setDeployedAddress] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsDeploying(true);
    setError(null);

    try {
      if (typeof window.ethereum === "undefined") {
        throw new Error("Please install MetaMask!");
      }

      await window.ethereum.request({ method: "eth_requestAccounts" });

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      // 创建合约工厂
      const factory = new ethers.ContractFactory(
        DataNFTContractABI.abi,
        DataNFTContractABI.bytecode,
        signer
      );

      // 部署合约
      const contract = await factory.deploy();

      // 等待合约部署完成
      await contract.waitForDeployment();

      // 获取部署的合约地址
      const contractAddress = await contract.getAddress();
      setDeployedAddress(contractAddress);

      // 调用合约方法添加内容
      const tx = await contract.contributeData(introduction);
      await tx.wait();

      console.log("Contract deployed to:", contractAddress);
      console.log("Data contributed successfully");
    } catch (error) {
      console.error("Error deploying contract:", error);
      setError(
        error instanceof Error ? error.message : "An unknown error occurred"
      );
    } finally {
      setIsDeploying(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="campaign-form-modal">
        <h2>Create New Campaign</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="title">Title:</label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="introduction">Introduction:</label>
            <textarea
              id="introduction"
              value={introduction}
              onChange={(e) => setIntroduction(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="reward">Reward:</label>
            <input
              id="reward"
              type="text"
              value={reward}
              onChange={(e) => setReward(e.target.value)}
              required
            />
          </div>
          <div className="button-container">
            <button type="submit" disabled={isDeploying}>
              {isDeploying ? "Deploying..." : "Deploy Contract"}
            </button>
            <button onClick={onClose} className="close-button">
              Close
            </button>
          </div>
        </form>
        {error && <p className="error">{error}</p>}
        {deployedAddress && (
          <p>Contract deployed successfully to: {deployedAddress}</p>
        )}
      </div>
    </div>
  );
};

export default CampaignForm;
