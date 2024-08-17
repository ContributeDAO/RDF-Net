import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import JSEncrypt from "jsencrypt";
import DataNFTContractABI from "../solidity/contracts/artifacts/RebellionDataFunder.json";

const REGISTRY_ADDRESS = '0x65bC5ed6a981A48E2f191bdDB8FADF3317aDe9A5';

interface ContributeModalProps {
  campaignId: number;
  campaignAddress: string;
  onClose: () => void;
}

interface CampaignDetails {
  name: string;
  content: string;
}

const ContributeModal: React.FC<ContributeModalProps> = ({
  campaignId,
  campaignAddress,
  onClose,
}) => {
  const [cid, setCid] = useState("");
  const [password, setPassword] = useState("");
  const [tag, setTag] = useState("");
  const [campaignDetails, setCampaignDetails] =
    useState<CampaignDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCampaignDetails = async () => {
      try {
        const provider = new ethers.providers.Web3Provider(
          window.ethereum as any
        );
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const registry = new ethers.Contract(
          REGISTRY_ADDRESS,
          CampaignRegistryABI,
          signer
        );

        const [, , name, content] = await registry.campaigns(campaignId);

        setCampaignDetails({
          name,
          content,
        });
      } catch (err) {
        console.error("Error fetching campaign details:", err);
        setError(
          "Failed to load campaign details. Please make sure you're connected to the correct network and try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCampaignDetails();
  }, [campaignId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!campaignDetails) return;

    try {
      const provider = new ethers.providers.Web3Provider(
        window.ethereum as any
      );
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        campaignAddress,
        DataNFTContractABI.abi,
        signer
      );

      // Fetch public key from the DataNFTContract
      const publicKey = await contract.getPublicKey();

      // Encrypt CID and password using the campaign deployer's public key
      const encryptedData = await encryptData(cid, password, publicKey);

      // Contribute data to the campaign
      const tx = await contract.contributeData(tag, encryptedData);
      await tx.wait();

      console.log("Data contributed successfully");
      onClose();
    } catch (err) {
      console.error("Error contributing data:", err);
      setError(
        "Failed to contribute data. Please make sure you're connected to the correct network and try again."
      );
    }
  };

  const encryptData = async (
    cid: string,
    password: string,
    publicKey: string
  ) => {
    try {
      const dataToEncrypt = JSON.stringify({ cid, password });
      const encrypt = new JSEncrypt();
      encrypt.setPublicKey(publicKey);

      const encrypted = encrypt.encrypt(dataToEncrypt);

      if (!encrypted) {
        throw new Error("Encryption failed");
      }

      return ethers.utils.hexlify(ethers.utils.toUtf8Bytes(encrypted));
    } catch (error) {
      console.error("Encryption error:", error);
      throw new Error("Failed to encrypt data");
    }
  };

  if (loading) return <div>Loading campaign details...</div>;
  if (error) return <div>{error}</div>;
  if (!campaignDetails) return null;

  return (
    <div className="modal-overlay">
      <div className="contribute-modal">
        <h2>Contribute to Campaign</h2>
        <div className="campaign-details">
          <h3>Campaign Details:</h3>
          <p>
            <strong>Name:</strong> {campaignDetails.name}
          </p>
          <p>
            <strong>Content:</strong> {campaignDetails.content}
          </p>
        </div>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="cid">IPFS CID:</label>
            <input
              id="cid"
              type="text"
              value={cid}
              onChange={(e) => setCid(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="password">File Password:</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="tag">Tag:</label>
            <input
              id="tag"
              type="text"
              value={tag}
              onChange={(e) =>
                setTag(
                  e.target.value.startsWith("#")
                    ? e.target.value
                    : `#${e.target.value}`
                )
              }
              required
            />
          </div>
          <p>Campaign Address: {campaignAddress}</p>
          <div className="button-container">
            <button type="submit">Encrypt and Submit</button>
            <button onClick={onClose} className="close-button">
              Close
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContributeModal;
