import React from 'react';
import { FiSearch } from "react-icons/fi";
import { COURSE_STATUS } from '../constants/courseConstants';

const CourseFilters = ({
    search,
    setSearch
}) => {
    return (
        <div className="courses-actions-bar">
            <div className="course-search-wrapper">
                <FiSearch className="search-icon-abs" />
                <input
                    type="text"
                    className="course-search-input"
                    placeholder="Search courses..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

        </div>
    );
};

export default CourseFilters;
