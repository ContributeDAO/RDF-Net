import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import ContributeModal from "./ContributeModal";
import CampaignRegistryABI from "../abi/CampaignRegistry.json";
import { kv } from "@vercel/kv";

const REGISTRY_ADDRESS = "0xc71ef9f2b682971fb4a56c02b892823205d58f59";

interface Campaign {
  id: number;
  address: string;
  // initiator: string;
  title: string;
  content: string;
}

const CampaignList: React.FC = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        setCampaigns((await kv.get("campaigns")) as Campaign[]);
      } catch (err) {
        console.error("Error fetching campaigns:", err);
        setError(
          "Failed to load campaigns. Please make sure you're connected to the correct network and try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

  const handleContribute = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
  };

  const handleCloseModal = () => {
    setSelectedCampaign(null);
  };

  if (loading)
    return <div className="campaign-list-container">Loading campaigns...</div>;
  if (error)
    return <div className="campaign-list-container error">{error}</div>;

  return (
    <div className="campaign-list-container">
      {campaigns.length > 0 ? (
        <div className="campaign-grid">
          {campaigns.map((campaign) => (
            <div key={campaign.address} className="campaign-card">
              <h2>{campaign.title}</h2>
              <p>{campaign.content}</p>
              <button onClick={() => handleContribute(campaign)}>
                Contribute
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="no-campaigns">No active campaigns at the moment.</p>
      )}
      {selectedCampaign && (
        <ContributeModal
          campaignId={selectedCampaign.id}
          campaignAddress={selectedCampaign.address}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default CampaignList;
