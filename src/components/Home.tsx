import React from "react";
import CreateCampaign from "./CreateCampaign";
import CampaignList from "./CampaignList";

const Home: React.FC = () => {
  return (
    <>
      <section className="create-campaign">
        <h2>Create New Campaign</h2>
        <CreateCampaign />
      </section>
      <section className="campaign-list">
        <h2>Active Campaigns</h2>
        <CampaignList />
      </section>
    </>
  );
};

export default Home;
