import React, { useState } from "react";

interface ContributeModalProps {
  campaignId: number;
  onClose: () => void;
  onContribute: (campaignId: number, cid: string, password: string) => void;
}

const ContributeModal: React.FC<ContributeModalProps> = ({
  campaignId,
  onClose,
  onContribute,
}) => {
  const [cid, setCid] = useState("");
  const [password, setPassword] = useState("");
  const publicKey = "0xchsd........."; // 这里替换为实际的公钥

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onContribute(campaignId, cid, password);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="contribute-modal">
        <h2>Contribute to Campaign {campaignId}</h2>
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
          <p>公钥加密授权：{publicKey}</p>
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
