export const authService = {
    login: async (email, password) => {
        console.log(`Checking connection to: /auth/login for user: ${email}`);
        try {
            const res = await fetch('/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email,
                    username: email, // Fallback for backends expecting 'username'
                    password
                })
            });

            if (!res.ok) {
                const errorBody = await res.text();
                console.error('Login failed status:', res.status);
                console.error('Error Response Body:', errorBody);
                throw new Error(errorBody || `Login failed with status ${res.status}`);
            }

            // Backend returns the raw token string, not JSON
            const text = await res.text();
            console.log('Login successful, received token length:', text.length);
            try {
                return JSON.parse(text); // Try parsing just in case it IS json
            } catch (e) {
                return { token: text }; // If not json, it's the raw token string
            }
        } catch (error) {
            console.error('Auth Service Error:', error);
            throw error;
        }
    },

    logout: () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('auth_user');
        window.location.href = '/login';
    }
};
