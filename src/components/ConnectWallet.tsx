import React, { useState } from "react";
import { useWeb3 } from "../hooks/useWeb3";
import { Link } from "react-router-dom";

const ConnectWallet: React.FC = () => {
  const { connect, disconnect, account } = useWeb3();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleButtonClick = () => {
    if (account) {
      setShowDropdown(!showDropdown);
    } else {
      connect();
    }
  };

  return (
    <div className="connect-wallet-container">
      <button onClick={handleButtonClick}>
        {account
          ? `${account.slice(0, 6)}...${account.slice(-4)}`
          : "Connect Wallet"}
      </button>
      {showDropdown && account && (
        <div className="wallet-dropdown">
          <Link to="/profile" onClick={() => setShowDropdown(false)}>
            Profile
          </Link>
          <button
            onClick={() => {
              disconnect();
              setShowDropdown(false);
            }}
          >
            Disconnect
          </button>
        </div>
      )}
    </div>
  );
};

export default ConnectWallet;
