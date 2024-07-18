import React, { useEffect, useState } from "react";
import { kv } from "@vercel/kv";
import CampaignForm from "./CampaignForm";

const CreateCampaign: React.FC = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleCampaignCreated = async (campaign: {
    address: string;
    title: string;
    content: string;
  }) => {
    console.log("New campaign created:", campaign);
    let currentCampaigns = (await kv.get("campaigns")) as any[];
    currentCampaigns.push({
      address: campaign.address,
      title: campaign.title,
      description: campaign.content,
      organization: "",
      themes: [],
      creationDate: new Date().toISOString(),
    });
    await kv.set("campaigns", JSON.stringify(currentCampaigns));
    console.log(currentCampaigns);

    setIsFormOpen(false);
    // Add any additional logic here, such as updating a list of campaigns
  };

  useEffect(() => {
    kv.get("campaigns").then((v) => {
      console.log(v);
      kv.set("campaigns", v);
    });
  });

  return (
    <div>
      <button onClick={() => setIsFormOpen(true)}>
        Start Data Crowdfunding
      </button>
      {isFormOpen && (
        <CampaignForm
          onClose={() => setIsFormOpen(false)}
          onCampaignCreated={handleCampaignCreated}
        />
      )}
    </div>
  );
};

export default CreateCampaign;
