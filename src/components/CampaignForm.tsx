import React, { useState } from "react";
import { ethers } from "ethers";
import DataNFTContractABI from "../../artifacts/contracts/DataNFTContract.sol/DataNFTContract.json";

interface CampaignFormProps {
  onClose: () => void;
  onCampaignCreated: (campaign: {
    address: string;
    title: string;
    content: string;
  }) => void;
}

const CreateCampaign: React.FC<CampaignFormProps> = ({
  onClose,
  onCampaignCreated,
}) => {
  const [title, setTitle] = useState("");
  const [campaignContent, setCampaignContent] = useState("");
  const [rewardDescription, setRewardDescription] = useState("");
  const [isDeploying, setIsDeploying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deployedAddress, setDeployedAddress] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsDeploying(true);
    setError(null);

    try {
      if (typeof window.ethereum === "undefined") {
        throw new Error("请安装 MetaMask！");
      }

      await window.ethereum.request({ method: "eth_requestAccounts" });
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      const factory = new ethers.ContractFactory(
        DataNFTContractABI.abi,
        DataNFTContractABI.bytecode,
        signer
      );

      // Combine campaign content and reward description
      const content = `Campaign Content:\n${campaignContent}\n\nReward Description:\n${rewardDescription}`;

      // Deploy contract with initial title and content
      const contract = await factory.deploy(title, content);
      await contract.deployed();

      const contractAddress = contract.address;
      setDeployedAddress(contractAddress);

      console.log("合约部署地址:", contractAddress);
      console.log("Title:", title);
      console.log("Content:", content);

      onCampaignCreated({
        address: contractAddress,
        title,
        content,
      });
    } catch (error: any) {
      console.error("部署合约时出错:", error);
      setError(`发生错误: ${error.message}`);
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
            <label htmlFor="title">Campaign Title:</label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="campaignContent">Campaign Content:</label>
            <textarea
              id="campaignContent"
              value={campaignContent}
              onChange={(e) => setCampaignContent(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="rewardDescription">Reward Description:</label>
            <textarea
              id="rewardDescription"
              value={rewardDescription}
              onChange={(e) => setRewardDescription(e.target.value)}
              required
            />
          </div>
          <div className="button-container">
            <button type="submit" disabled={isDeploying}>
              {isDeploying ? "Deploying..." : "Deploy Campaign"}
            </button>
            <button onClick={onClose} className="close-button">
              Close
            </button>
          </div>
        </form>
        {error && <p className="error">{error}</p>}
        {deployedAddress && (
          <p>Campaign deployed successfully to: {deployedAddress}</p>
        )}
      </div>
    </div>
  );
};

export default CreateCampaign;
