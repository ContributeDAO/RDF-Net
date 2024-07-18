import React, { useState } from "react";
import CampaignForm from "./CampaignForm";

const CreateCampaign: React.FC = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);

  return (
    <div>
      <button onClick={() => setIsFormOpen(true)}>
        Start Data Crowdfunding
      </button>
      {isFormOpen && <CampaignForm onClose={() => setIsFormOpen(false)} />}
    </div>
  );
};

export default CreateCampaign;
