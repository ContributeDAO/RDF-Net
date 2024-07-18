import React from "react";
import { useWeb3 } from "../hooks/useWeb3";

const Profile: React.FC = () => {
  const { account } = useWeb3();

  return (
    <div className="profile-container">
      <h1>User Profile</h1>
      <p>Wallet Address: {account}</p>

      <div className="crowdfund-section">
        <h2>My Crowdfunds</h2>
        <ul>
          <li>Example Crowdfund 1 (Status: Active)</li>
          <li>Example Crowdfund 2 (Status: Completed)</li>
        </ul>
      </div>

      <div className="contribute-section">
        <h2>My Contributions</h2>
        <ul>
          <li>Contributed to Project A (Amount: 1 ETH)</li>
          <li>Contributed to Project B (Amount: 0.5 ETH)</li>
        </ul>
      </div>
    </div>
  );
};

export default Profile;
