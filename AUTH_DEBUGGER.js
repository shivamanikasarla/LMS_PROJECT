// ========================================
// AUTH TOKEN DEBUGGER
// ========================================
// Copy and paste this ENTIRE block into your browser console

console.log('=== AUTH TOKEN DEBUGGER ===\n');

// 1. Check if token exists
const token = localStorage.getItem('authToken');
if (!token) {
    console.error('❌ NO TOKEN FOUND IN LOCALSTORAGE!');
    console.log('\n📋 FIX: Run this command to set the token:\n');
    console.log(`localStorage.setItem('authToken', "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbkBnbWFpbC5jb20iLCJ1c2VySWQiOjEsInJvbGVzIjpbIlJPTEVfQURNSU4iXSwicGVybWlzc2lvbnMiOlsiQ09VUlNFX0NSRUFURSIsIkNPVVJTRV9VUERBVEUiLCJDT1VSU0VfREVMRVRFIiwiQ09VUlNFX1ZJRVciLCJUT1BJQ19DUkVBVEUiLCJUT1BJQ19VUERBVEUiLCJUT1BJQ19ERUxFVEUiLCJUT1BJQ19WSUVXIiwiQ09OVEVOVF9BREQiLCJDT05URU5UX1VQREFURSIsIkNPTlRFTlRfREVMRVRFIiwiQ09OVEVOVF9WSUVXIiwiQ09OVEVOVF9BQ0NFU1MiLCJWRUhJQ0xFX0FERCIsIlZFSElDTEVfVklFVyIsIlZFSElDTEVfVVBEQVRFIiwiVkVISUNMRV9ERUxFVEUiLCJST1VURV9BREQiLCJST1VURV9WSUVXIiwiUk9VVEVfVVBEQVRFIiwiUk9VVEVfREVMRVRFIiwiRFJJVkVSX0FERCIsIkRSSVZFUl9WSUVXIiwiRFJJVkVSX1VQREFURSIsIkRSSVZFUl9ERUxFVEUiLCJDT05EVUNUT1JfQUREIiwiQ09ORFVDVE9SX1ZJRVciLCJDT05EVUNUT1JfVVBEQVRFIiwiQ09ORFVDVE9SX0RFTEVURSIsIkdQU19BREQiLCJHUFNfVklFVyIsIkdQU19VUERBVEUiLCJHUFNfREVMRVRFIiwiVFJBTlNQT1JUX0FUVEVOREFOQ0VfQUREIiwiVFJBTlNQT1JUX0FUVEVOREFOQ0VfVklFVyIsIlRSQU5TUE9SVF9BVFRFTkRBTkNFX1VQREFURSIsIlRSQU5TUE9SVF9BVFRFTkRBTkNFX0RFTEVURSIsIk1BTkFHRV9VU0VSUyIsIk1BTkFHRV9DT1VSU0VTIiwiVklFV19DT05URU5UIiwiVklFV19QUk9GSUxFIiwiQkFUQ0hfQ1JFQVRFIiwiQkFUQ0hfVVBEQVRFIiwiQkFUQ0hfREVMRVRFIiwiQkFUQ0hfVklFVyIsIlNFU1NJT05fQ1JFQVRFIiwiU0VTU0lPTl9VUERBVEUiLCJTRVNTSU9OX0RFTEVURSIsIlNFU1NJT05fVklFVyIsIlNFU1NJT05fQ09OVEVOVF9DUkVBVEUiLCJTRVNTSU9OX0NPTlRFTlRfVVBEQVRFIiwiU0VTU0lPTl9DT05URU5UX0RFTEVURSIsIlNFU1NJT05fQ09OVEVOVF9WSUVXIiwiU0VTU0lPTl9DT05URU5UX1BSRVZJRVciLCJTRVNTSU9OX0NPTlRFTlRfRE9XTkxPQUQiLCJDT1VSU0VfQkFUQ0hfU1RBVFNfVklFVyIsIlNUVURFTlRfQkFUQ0hfQ1JFQVRFIiwiU1RVREVOVF9CQVRDSF9VUERBVEUiLCJTVFVERU5UX0JBVENIX0RFTEVURSIsIlNUVURFTlRfQkFUQ0hfVklFVyJdLCJpYXQiOjE3Njg5ODEwOTR9.8n5uR84wEXjtl5spjKsjB0NhJPff9Q71hqAtndq4zr7Y9IJv5r1KMy9DiOfPRS63zZkPAFa_PB-uvIXJl8KODg");`);
    console.log('\nThen refresh the page (F5)');
} else {
    console.log('✅ Token found in localStorage');
    console.log('Token preview:', token.substring(0, 50) + '...');

    // 2. Parse JWT to check expiry
    try {
        const parts = token.split('.');
        if (parts.length === 3) {
            const payload = JSON.parse(atob(parts[1]));
            console.log('\n📋 Token Info:');
            console.log('- User:', payload.sub);
            console.log('- User ID:', payload.userId);
            console.log('- Roles:', payload.roles);
            console.log('- Issued At:', new Date(payload.iat * 1000).toLocaleString());

            // Check if token has expiry
            if (payload.exp) {
                const expiryDate = new Date(payload.exp * 1000);
                const now = new Date();
                if (expiryDate < now) {
                    console.error('\n❌ TOKEN EXPIRED!');
                    console.log('Expired on:', expiryDate.toLocaleString());
                    console.log('\n🔄 You need a fresh token from the backend');
                } else {
                    console.log('✅ Token expires:', expiryDate.toLocaleString());
                }
            }

            // Check permissions
            if (payload.permissions && payload.permissions.includes('VEHICLE_VIEW')) {
                console.log('✅ Has VEHICLE_VIEW permission');
            } else {
                console.warn('⚠️ Missing VEHICLE_VIEW permission!');
            }
        }
    } catch (e) {
        console.error('❌ Failed to parse token:', e.message);
    }
}

// 3. Test API call
console.log('\n🧪 Testing API call...');
fetch('/transport/vehicles', {
    headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    }
})
    .then(response => {
        console.log(`\n📡 Response Status: ${response.status} ${response.statusText}`);
        if (response.status === 403) {
            console.error('❌ 403 FORBIDDEN - Token is invalid or missing required permissions');
        } else if (response.status === 401) {
            console.error('❌ 401 UNAUTHORIZED - Token is missing or malformed');
        } else if (response.ok) {
            console.log('✅ SUCCESS! API is working');
            return response.json();
        }
    })
    .then(data => {
        if (data) {
            console.log('✅ Vehicles fetched:', data.length, 'vehicles');
        }
    })
    .catch(err => {
        console.error('❌ Network Error:', err.message);
    });

console.log('\n=== END DEBUGGER ===');
