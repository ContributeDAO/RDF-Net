import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { registryKV } from "../kv";
import { CampaignDetail } from "../types/campaign";

const CampaignList: React.FC = () => {
  const [campaigns, setCampaigns] = useState<CampaignDetail[]>([]);
  const [selectedCampaign, setSelectedCampaign] = useState<CampaignDetail | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        setCampaigns((await registryKV.get("campaigns")) as CampaignDetail[]);
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

  const handleContribute = (campaign: CampaignDetail) => {
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
          {campaigns.map((campaign, index) => (
            <div key={index} className="campaign-card">
              <h2>{campaign.title}</h2>
              <p>{campaign.content}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="no-campaigns">No active campaigns at the moment.</p>
      )}
    </div>
  );
};

export default CampaignList;
