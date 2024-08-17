import React, { useEffect, useState } from 'react';
import { registryKV } from '../kv';
import CampaignForm from './CampaignForm';
import { CampaignDetail } from '../types/campaign';

const CreateCampaign: React.FC = () => {
    const [isFormOpen, setIsFormOpen] = useState(false);

    const handleCampaignCreated = async (campaign: CampaignDetail) => {
        console.log('New campaign created:', campaign);
        let currentCampaigns = (await registryKV.get('campaigns')) as any[];
        currentCampaigns.push({
            id: campaign.taskID,
            title: campaign.title,
            description: campaign.content,
            organization: '',
            themes: [],
            creationDate: new Date().toISOString(),
        });
        await registryKV.set('campaigns', JSON.stringify(currentCampaigns));
        console.log(currentCampaigns);

        setIsFormOpen(false);
        // Add any additional logic here, such as updating a list of campaigns
    };

    useEffect(() => {
        registryKV.get('campaigns').then((v: unknown) => {
            console.log(v);
            registryKV.set('campaigns', v as CampaignDetail[]);
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
