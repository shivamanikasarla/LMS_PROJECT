
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const useAffiliateTracker = () => {
    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const refCode = params.get('ref');

        if (refCode) {
            // Basic validation to prevent XSS or junk
            if (/^[A-Za-z0-9-_]+$/.test(refCode)) {
                localStorage.setItem('affiliate_ref', refCode);

                // Optional: Set a timestamp to expire it after 30 days
                const expiry = new Date().getTime() + (30 * 24 * 60 * 60 * 1000); // 30 days
                localStorage.setItem('affiliate_expiry', expiry);

                console.log(`[Affiliate] Valid referral code captured: ${refCode}`);
            }
        }

        // Check expiry logic on load
        const expiry = localStorage.getItem('affiliate_expiry');
        if (expiry && new Date().getTime() > parseInt(expiry)) {
            localStorage.removeItem('affiliate_ref');
            localStorage.removeItem('affiliate_expiry');
            console.log('[Affiliate] Referral code expired');
        }

    }, [location]);
};

export default useAffiliateTracker;
