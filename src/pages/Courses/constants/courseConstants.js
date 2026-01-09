/* Course Types */
export const COURSE_TYPES = {
    FREE: 'Free',
    PAID: 'Paid',
};

export const COURSE_STATUS = {
    ALL: 'All',
    COMPLETED: 'Completed',
    UPCOMING: 'Upcoming',
    LIVE: 'Live'
};

/* Initial Form State */
export const INITIAL_FORM_DATA = {
    name: "",
    desc: "",
    overview: "",
    toolsCovered: "",
    toolsCovered: "",
    img: null,
    imgPreview: null,

    // Advanced Options
    price: "", // Added for Course Fee
    duration: "", // Added for Duration
    showValidity: false,
    validityDuration: "", // New field for validity duration
    accessPlatforms: ['Website'], // Default to Website
    allowOffline: false,
    showLearnInfo: false,
    provideCertificate: false,
    certificateTemplate: "" // New field for certificate template
};
