const API_BASE_URL = "/api/courses";

// Helper function to get headers with potentially required authorization
const getHeaders = () => {
    const headers = {
        "Content-Type": "application/json",
    };

    // 1. Try to get token from Local Storage (Real App Flow)
    // This expects that after Login, you do: localStorage.setItem("authToken", token);
    let token = localStorage.getItem("authToken");

    // 2. Fallback to Hardcoded Token (For Development/Testing)
    if (!token) {
        token = "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbkBnbWFpbC5jb20iLCJ1c2VySWQiOjEsInJvbGVzIjpbIlJPTEVfQURNSU4iXSwicGVybWlzc2lvbnMiOlsiQlVTX1JPVVRFX1ZJRVciLCJIT1NURUxfREVMRVRFIiwiTElCUkFSWV9NRU1CRVJfVklFVyIsIkJPT0tfSVNTVUVfREVMRVRFIiwiU1RPUF9QT0lOVF9DUkVBVEUiLCJCT09LX0NSRUFURSIsIkJPT0tfSVNTVUVfVklFV19DSElMRCIsIkhPU1RFTF9GRUVfVklFV19DSElMRCIsIkRPQ1VNRU5UX0NSRUFURSIsIkNPVVJTRV9VUERBVEUiLCJCVVNfUk9VVEVfVVBEQVRFIiwiSE9TVEVMX1JPT01fREVMRVRFIiwiQlVTX1VQREFURSIsIkhPU1RFTF9BTExPQ0FUSU9OX1ZJRVdfQ0hJTEQiLCJCT09LX0NBVEVHT1JZX1ZJRVciLCJUT1BJQ19WSUVXIiwiTElCUkFSWV9GSU5FX0NSRUFURSIsIlZJRVdfUFJPRklMRSIsIlRPUElDX0NPTlRFTlRfQ1JFQVRFIiwiTElCUkFSWV9NRU1CRVJfQ1JFQVRFIiwiRE9DVU1FTlRfVVBEQVRFIiwiQlVTX1JPVVRFX0NSRUFURSIsIk1BTkFHRV9VU0VSUyIsIkJPT0tfQ0FURUdPUllfREVMRVRFIiwiRE9DVU1FTlRfQUNDRVNTX1ZJRVciLCJIT1NURUxfRkVFX1ZJRVciLCJET0NVTUVOVF9WSUVXIiwiRE9DVU1FTlRfQUNDRVNTX0dSQU5UX1NUVURFTlQiLCJIT1NURUxfQ09NUExBSU5UX0RFTEVURSIsIkxJQlJBUllfTUVNQkVSX1VQREFURSIsIkJPT0tfSVNTVUVfQ1JFQVRFIiwiRE9DVU1FTlRfQ0FURUdPUllfREVMRVRFIiwiRE9DVU1FTlRfQ0FURUdPUllfVVBEQVRFIiwiSE9TVEVMX0FMTE9DQVRJT05fQ1JFQVRFIiwiQk9PS19VUERBVEUiLCJUT1BJQ19DT05URU5UX0RFTEVURSIsIkJVU19ST1VURV9ERUxFVEUiLCJIT1NURUxfRkVFX1VQREFURSIsIlRPUElDX0NPTlRFTlRfVklFVyIsIkNPVVJTRV9WSUVXIiwiQlVTX1BBU1NfREVMRVRFIiwiQk9PS19JU1NVRV9WSUVXX1NFTEYiLCJIT1NURUxfQkxPQ0tfVVBEQVRFIiwiSE9TVEVMX0NSRUFURSIsIkhPU1RFTF9ST09NX0NSRUFURSIsIkxJQlJBUllfRklORV9ERUxFVEUiLCJUT1BJQ19ERUxFVEUiLCJCVVNfREVMRVRFIiwiRE9DVU1FTlRfVkVSU0lPTl9WSUVXIiwiQ09VUlNFX0NSRUFURSIsIkhPU1RFTF9ST09NX1ZJRVciLCJIT1NURUxfVVBEQVRFIiwiQlVTX1BBU1NfVklFV19DSElMRCIsIkRPQ1VNRU5UX0NBVEVHT1JZX0NSRUFURSIsIlRPUElDX0NSRUFURSIsIkxJQlJBUllfU0VUVElOR1NfQ1JFQVRFIiwiSE9TVEVMX0JMT0NLX0RFTEVURSIsIkJPT0tfSVNTVUVfVVBEQVRFIiwiQk9PS19DQVRFR09SWV9DUkVBVEUiLCJCT09LX0lTU1VFX1ZJRVciLCJTVE9QX1BPSU5UX1ZJRVciLCJDT1VSU0VfREVMRVRFIiwiRE9DVU1FTlRfVklFV19DSElMRCIsIkJVU19QQVNTX1ZJRVciLCJST1VURV9VUERBQUkiLCJUT1BJQ19DT05URU5UX0FDQ0VTUyIsIkJVU19WSUVXIiwiSE9TVEVMX1JPT01fVVBEQVRFIiwiTElCUkFSWV9GSU5FX1ZJRVciLCJIT1NURUxfVklFVyIsIkhPU1RFTF9GRUVfQ1JFQVRFIiwiRE9DVU1FTlRfQUNDRVNTX1ZJRVdfQ0hJTEQiLCJCVVNfQ1JFQVRFIiwiRE9DVU1FTlRfQUNDRVNTX0dSQU5UIiwiU1RPUF9QT0lOVF9ERUxFVEUiLCJCVVNfUEFTU19VUERBVEUiLCJCT09LX1ZJRVciLCJST1VURV9DUkVBVEUiLCJWSUVXX0NPTlRFTlQiLCJMSUJSQVJZX1NFVFRJTkdTX1ZJRVciLCJIT1NURUxfQ09NUExBSU5UX0NSRUFURSIsIkxJQlJBUllfRklORV9VUERBVEUiLCJIT1NURUxfQUxMT0NBVElPTl9WSUV3IiwiVE9QSUNfVVBEQVRFIiwiRE9DVU1FTlRfVkVSU0lPTl9DUkVBVEUiLCJNQU5BR0VfQ09VUlNFUyIsIlNUT1BfUE9JTlRfVVBEQVRFIiwiSE9TVEVMX0FMTE9DQVRJT05fREVMRVRFIiwiSE9TVEVMX0NPTVBMQUlOVF9VUERBQUkiLCJIT1NURUxfRkVFX0RFTEVURSIsIkxJQlJBUllfU0VUVElOR1NfVVBEQVRFIiwiSE9TVEVMX0JMT0NLX1ZJRVciLCJIT1NURUxfQUxMT0NBVElPTl9VUERBQUkiLCJMSUJSQVJZX1NFVFRJTkdTX0RFTEVURSIsIkJPT0tfREVMRVRFIiwiSE9TVEVMX0JMT0NLX0NSRUFURSIsIkRPQ1VNRU5UX1NIQVJFIiwiQlVTX1BBU1NfQ1JFQVRFIiwiVE9QSUNfQ09OVEVOVF9VUERBVEUiLCJET0NVTUVOVF9DQVRFR09SWV9WSUVXIiwiRE9DVU1FTlRfU0hBUkVfVklFVyIsIlJPVVRFX0RFTEVURSIsIkxJQlJBUllfU0VUVElOR1NfREVMRVRFIiwiQlVTX1JPVVRFX0RFTEVURSIsIlJPVVRFX1ZJRVciLCJIT1NURUxfQ09NUExBSU5UX1ZJRVciLCJET0NVTUVOVF9ERUxFVEUiLCJET0NVTUVOVF9BQ0NFU1NfVklFV19HUkFOVEVEIiwiQk9PS19DQVRFR09SWV9VUERBVEUiXSwiaWF0IjoxNzY3ODUzMzY0fQ.FHf2fSikFX7FPqpAr3QoX5y9Lc-rV1RzgyADfEBzVBstYBlkwt9k0-kP2A401ekQQaEsCslRD3tIX1kHXQ4DlA";
    }

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
};

export const courseService = {
    // Fetch all courses
    getCourses: async () => {
        try {
            const response = await fetch(API_BASE_URL, {
                method: 'GET',
                headers: getHeaders()
            });
            if (!response.ok) {
                throw new Error(`Error fetching courses: ${response.status} ${response.statusText}`);
            }
            return await response.json();
        } catch (error) {
            console.error("Service Error (getCourses):", error);
            throw error;
        }
    },

    // Get a course by ID
    getCourseById: async (id) => {
        try {
            const response = await fetch(`${API_BASE_URL}/${id}`, {
                method: 'GET',
                headers: getHeaders()
            });
            if (!response.ok) {
                throw new Error(`Error fetching course ${id}: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error("Service Error (getCourseById):", error);
            throw error;
        }
    },

    // Create a new course
    createCourse: async (data) => {
        try {
            const response = await fetch(API_BASE_URL, {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify(data)
            });
            if (!response.ok) {
                throw new Error(`Error creating course: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error("Service Error (createCourse):", error);
            throw error;
        }
    },

    // Update an existing course
    updateCourse: async (id, data) => {
        try {
            const response = await fetch(`${API_BASE_URL}/${id}`, {
                method: 'PUT',
                headers: getHeaders(),
                body: JSON.stringify(data)
            });
            if (!response.ok) {
                throw new Error(`Error updating course: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error("Service Error (updateCourse):", error);
            throw error;
        }
    },

    // Delete a course
    deleteCourse: async (id) => {
        try {
            const response = await fetch(`${API_BASE_URL}/${id}`, {
                method: 'DELETE',
                headers: getHeaders()
            });
            if (!response.ok) {
                throw new Error(`Error deleting course: ${response.status}`);
            }
            return true;
        } catch (error) {
            console.error("Service Error (deleteCourse):", error);
            throw error;
        }
    }
};
