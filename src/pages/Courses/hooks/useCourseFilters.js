
import { useState } from 'react';

export const useCourseFilters = (courses) => {
    const [search, setSearch] = useState("");
    const [filterType, setFilterType] = useState("All");


    const filteredCourses = courses.filter(c => {
        const courseName = c.name ? c.name.toLowerCase() : "";
        const mentor = c.mentorName ? c.mentorName.toLowerCase() : "";
        const query = search.toLowerCase();

        const matchesSearch = courseName.includes(query) || mentor.includes(query);
        const matchesType = filterType === "All" || c.courseType === filterType;

        return matchesSearch && matchesType;
    });

    return {
        search,
        setSearch,
        filterType,
        setFilterType,
        filteredCourses
    };
};
