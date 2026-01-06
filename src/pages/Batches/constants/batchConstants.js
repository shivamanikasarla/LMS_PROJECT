
export const BATCH_STATUS = {
    UPCOMING: 'Upcoming',
    ONGOING: 'Ongoing',
    COMPLETED: 'Completed'
};

export const INITIAL_BATCH_FORM = {
    name: "",
    courseId: "", // Linked Course
    courseName: "", // For display/denormalization
    startDate: "",
    endDate: "",
    price: "",
    classesPerWeek: "",
    mode: "Online",
    validity: "",
    status: "Upcoming",
    pricingType: "paid", // 'free' | 'paid'
    price: "",
    maxStudents: "",
    instructorId: ""
};

export const BATCH_TABS = {
    ALL: 'All',
    UPCOMING: 'Upcoming',
    ONGOING: 'Ongoing',
    COMPLETED: 'Completed'
};
