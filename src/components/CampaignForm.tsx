import React, { useState } from 'react';
import { ethers } from 'ethers';
import DataPunkContractABI from '../solidity/contracts/artifacts/RebellionDataFunder.json';
import { CampaignDetail } from '../types/campaign';

interface CampaignFormProps {
    onClose: () => void;
    onCampaignCreated: (campaign: CampaignDetail) => Promise<void>;
}

const CreateCampaign: React.FC<CampaignFormProps> = ({
    onClose,
    onCampaignCreated,
}) => {
    const [title, setTitle] = useState('');
    const [campaignContent, setCampaignContent] = useState('');
    const [org, setOrg] = useState('');
    const [rewardAmount, setRewardAmount] = useState('');
    const [isDeploying, setIsDeploying] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [deployedTaskId, setDeployedTaskId] = useState<number | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsDeploying(true);
        setError(null);

        try {
            if (typeof window.ethereum === 'undefined') {
                throw new Error('请安装 MetaMask！');
            }

            await window.ethereum.request?.({ method: 'eth_requestAccounts' });
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();

            // 使用新的合约地址
            const contractAddress =
                '0xA9b59771959e5d8d5897A48f4fc557cf82739085';
            const contract = new ethers.Contract(
                contractAddress,
                DataPunkContractABI.abi,
                signer,
            );

            // 调用 deployTask 方法
            const reward = ethers.utils.parseEther(rewardAmount);
            const transaction = await contract.publishTask(title, reward);
            console.log('Transaction:', transaction);

            contract.on(
                'TaskPublished',
                async (
                    publisher: string,
                    taskName: string,
                    rewardAmount: string,
                    taskID: number,
                ) => {
                    if (publisher !== (await signer.getAddress())) {
                        return;
                    }
                    console.log('TaskCreated:', taskID);
                    onCampaignCreated({
                        taskID,
                        org,
                        title: taskName,
                        content: campaignContent,
                        reward: rewardAmount,
                    });
                    contract.removeAllListeners('TaskPublished');
                },
            );

            const receipt = await transaction.wait();

            console.log('Transaction receipt:', receipt);

            // // 从事件中获取 taskId
            // // const taskCreatedEvent = receipt.events.pop();
            // // console.log(taskCreatedEvent);

            // const taskID = taskCreatedEvent?.args?.taskId.toNumber();

            // if (taskID === undefined) {
            //     throw new Error('Failed to get taskId from event');
            // }

            // setDeployedTaskId(taskID);
            // console.log('Task deployed with ID:', taskID);
            // console.log('Title:', title);
            // console.log('Content:', campaignContent);
            // console.log('Reward:', rewardAmount);
        } catch (error: any) {
            console.error('部署任务时出错:', error);
            setError(`发生错误: ${error.message}`);
        } finally {
            setIsDeploying(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="campaign-form-modal">
                <h2>Create New Campaign</h2>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="title">Campaign Title:</label>
                        <input
                            id="title"
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="org">Organization:</label>
                        <input
                            id="org"
                            type="text"
                            value={org}
                            onChange={(e) => setOrg(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="campaignContent">
                            Campaign Content:
                        </label>
                        <textarea
                            id="campaignContent"
                            value={campaignContent}
                            onChange={(e) => setCampaignContent(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="rewardAmount">
                            Reward Amount (ETH):
                        </label>
                        <input
                            id="rewardAmount"
                            type="number"
                            step="0.01"
                            value={rewardAmount}
                            onChange={(e) => setRewardAmount(e.target.value)}
                            required
                        />
                    </div>
                    <div className="button-container">
                        <button type="submit" disabled={isDeploying}>
                            {isDeploying ? 'Deploying...' : 'Deploy Campaign'}
                        </button>
                        <button onClick={onClose} className="close-button">
                            Close
                        </button>
                    </div>
                </form>
                {error && <p className="error">{error}</p>}
                {deployedTaskId !== null && (
                    <p>
                        Campaign deployed successfully with Task ID:{' '}
                        {deployedTaskId}
                    </p>
                )}
            </div>
        </div>
    );
};

export default CreateCampaign;
