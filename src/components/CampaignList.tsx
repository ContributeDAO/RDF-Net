import React, { useState } from "react";
import ContributeModal from "./ContributeModal";

const CampaignList: React.FC = () => {
  const [campaigns, setCampaigns] = useState([
    { id: 1, title: "Campaign 1", goal: 10 },
    { id: 2, title: "Campaign 2", goal: 20 },
  ]);
  const [selectedCampaign, setSelectedCampaign] = useState<number | null>(null);

  const handleContribute = (campaignId: number) => {
    setSelectedCampaign(campaignId);
  };

  const handleCloseModal = () => {
    setSelectedCampaign(null);
  };

  const handleSubmitContribution = (
    campaignId: number,
    cid: string,
    password: string
  ) => {
    console.log(
      `Contributing to campaign ${campaignId} with CID: ${cid} and password: ${password}`
    );
    // 在实际应用中，这里应该调用合约方法
    handleCloseModal(); // 关闭模态框
  };

  return (
    <div>
      {campaigns.length > 0 ? (
        campaigns.map((campaign) => (
          <div key={campaign.id} className="campaign-item">
            <h3>{campaign.title}</h3>
            <p>Goal: {campaign.goal} ETH</p>
            <button onClick={() => handleContribute(campaign.id)}>
              Contribute
            </button>
          </div>
        ))
      ) : (
        <p>No active campaigns at the moment.</p>
      )}
      {selectedCampaign !== null && (
        <ContributeModal
          campaignId={selectedCampaign}
          onClose={handleCloseModal}
          onContribute={handleSubmitContribution}
        />
      )}
    </div>
  );
};

export default CampaignList;
