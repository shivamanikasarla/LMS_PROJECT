import React, { useMemo } from 'react';
import { FiPlus, FiSearch, FiFilter } from "react-icons/fi";
import { useNavigate } from 'react-router-dom';

import { useBatches } from './hooks/useBatches';
import BatchCard from './components/BatchCard';
import BatchModal from './components/BatchModal';
import BatchStats from './components/BatchStats';
import BatchesEmptyState from './components/BatchesEmptyState';
import { BATCH_TABS } from './constants/batchConstants';
import { MOCK_COURSES } from '../../data/mockCourses';
import { MOCK_USERS } from '../../data/mockUsers';

import './styles/batches.css';

const Batches = () => {
    const navigate = useNavigate();

    // TEMP: replace with API / store later
    const courses = MOCK_COURSES;
    const instructors = useMemo(() => MOCK_USERS.filter(u => u.role === 'Instructor' || u.role === 'Admin'), []);

    const {
        batches,
        allBatches,
        stats,
        showModal,
        openModal,
        closeModal,
        handleSave,
        handleDelete,
        handleInputChange,
        formData,
        isEdit,
        currentTab,
        setCurrentTab,
        searchQuery,
        setSearchQuery,
        courseFilter,
        setCourseFilter,
        instructorFilter,
        setInstructorFilter
    } = useBatches(courses);

    return (
        <div className="batches-page">

            {/* Header */}
            <div className="batches-header-premium">
                <div className="header-titles">
                    <h1>Batch Management</h1>
                    <p>Manage batch schedules, pricing, and access.</p>
                </div>
                <div className="header-actions">
                    <button className="btn-primary-add" onClick={() => openModal()}>
                        <FiPlus size={18} /> Create New Batch
                    </button>
                </div>
            </div>

            {/* Stats */}
            <BatchStats stats={stats} />

            {/* Tabs + Search */}
            <div className="batches-controls-bar">
                <div className="tabs-container">
                    {Object.values(BATCH_TABS).map(tab => (
                        <button
                            key={tab}
                            className={`tab-btn ${currentTab === tab ? 'active' : ''}`}
                            onClick={() => setCurrentTab(tab)}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                <div className="search-filter-group">
                    {/* Course Filter */}
                    <div className="filter-select-wrapper">
                        <select
                            className="filter-select"
                            value={courseFilter}
                            onChange={(e) => setCourseFilter(e.target.value)}
                        >
                            <option value="All">All Courses</option>
                            {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                    </div>

                    {/* Instructor Filter */}
                    <div className="filter-select-wrapper">
                        <select
                            className="filter-select"
                            value={instructorFilter}
                            onChange={(e) => setInstructorFilter(e.target.value)}
                        >
                            <option value="All">All Instructors</option>
                            {instructors.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
                        </select>
                    </div>

                    <div className="search-box-wrapper">
                        <FiSearch className="search-icon" />
                        <input
                            type="text"
                            placeholder="Search batches..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Grid */}
            {batches.length > 0 ? (
                <div className="batches-grid-layout">
                    {batches.map(batch => (
                        <BatchCard
                            key={batch.id}
                            batch={batch}
                            courses={courses}
                            onEdit={openModal}
                            onDelete={handleDelete}
                            onManageContent={(id) =>
                                navigate(`/batches/builder/${id}`)
                            }
                        />
                    ))}
                </div>
            ) : (
                <div className="no-results-area">
                    {allBatches.length === 0 ? (
                        <BatchesEmptyState onCreate={openModal} />
                    ) : (
                        <div className="search-empty">
                            <p>No batches found matching your filters.</p>
                            <button
                                className="text-btn"
                                onClick={() => {
                                    setCurrentTab(BATCH_TABS.ALL);
                                    setSearchQuery('');
                                    setCourseFilter('All');
                                    setInstructorFilter('All');
                                }}
                            >
                                Clear Filters
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* Modal */}
            <BatchModal
                isOpen={showModal}
                onClose={closeModal}
                formData={formData}
                handleInputChange={handleInputChange}
                handleSave={handleSave}
                isEdit={isEdit}
                courses={courses}
                instructors={instructors}
            />
        </div>
    );
};

export default Batches;
