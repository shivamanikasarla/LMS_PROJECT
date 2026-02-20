// marketingService.js - MOCK IMPLEMENTATION (No Backend)

const STORAGE_KEY = 'lms_marketing_campaigns';

// Helper to simulate delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Helper: Get data
const getStoredCampaigns = () => {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    } catch (e) {
        console.error("Mock storage error", e);
        return [];
    }
};

// Helper: Save data
const saveCampaigns = (campaigns) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(campaigns));
};

export const marketingService = {

    // Executive: Create a new campaign
    createCampaign: async (campaignData) => {
        await delay(500); // Simulate network
        const campaigns = getStoredCampaigns();

        const newCampaign = {
            id: 'cmp_' + Date.now(),
            createdAt: new Date().toISOString(),
            status: 'PENDING_APPROVAL', // Default safety
            spend: 0,
            leads: 0,
            conversionRate: '0%',
            ...campaignData
        };

        campaigns.unshift(newCampaign); // Add to top
        saveCampaigns(campaigns);

        return newCampaign;
    },

    // Admin/Manager: Get all campaigns
    getAllCampaigns: async () => {
        await delay(400);
        return getStoredCampaigns();
    },

    // Executive: Get my campaigns
    getMyCampaigns: async (userId) => {
        await delay(400);
        const all = getStoredCampaigns();
        // Since auth might be mocked, we might be loose with ID matching or match exact string
        if (!userId) return all;
        return all.filter(c => c.createdBy === userId);
    },

    // Admin: Approve/Pause/Archive
    updateCampaignStatus: async (campaignId, status) => {
        await delay(300);
        const campaigns = getStoredCampaigns();
        const index = campaigns.findIndex(c => c.id === campaignId);

        if (index !== -1) {
            campaigns[index].status = status;

            // Mock logic: If active, simulate some stats? 
            if (status === 'Active') {
                campaigns[index].leads = Math.floor(Math.random() * 50);
                campaigns[index].spend = Math.floor(Math.random() * 200);
                campaigns[index].conversionRate = (Math.random() * 5).toFixed(1) + '%';
            }

            saveCampaigns(campaigns);
            return campaigns[index];
        }
        throw new Error("Campaign not found");
    }
};
