import React from 'react';
import { FiPlus } from "react-icons/fi";
import CourseFilters from './components/CourseFilters';
import CourseGrid from './components/CourseGrid';
import CourseModal from './components/CourseModal';
import CourseDetailsModal from './components/CourseDetailsModal';
import { useCourses } from './hooks/useCourses';
import { useCourseFilters } from './hooks/useCourseFilters';
import './styles/courses.css';
import { useNavigate } from 'react-router-dom';

import CourseShareModal from './components/CourseShareModal';

const CoursesPage = () => {
  const navigate = useNavigate();
  const [viewCourse, setViewCourse] = React.useState(null);
  const [shareCourse, setShareCourse] = React.useState(null);

  // 1. Data & Form Logic
  const {
    courses,
    showModal,
    setShowModal,
    openModal,
    handleDelete,
    handleSave,
    handleInputChange,
    handleImageChange,
    formData,
    step,
    setStep,
    editIndex
  } = useCourses();

  // 2. Filter Logic (NO type filter)
  const {
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    filteredCourses
  } = useCourseFilters(courses);

  return (
    <div className="courses-container">
      <header className="courses-header">
        <div className="header-content">
          <h1>Course Management</h1>
          <p>Create, manage and assign courses.</p>
        </div>

        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <CourseFilters
            search={search}
            setSearch={setSearch}
          />

          <button className="btn-primary-add" onClick={() => openModal()}>
            <FiPlus size={18} /> Add New Course
          </button>
        </div>
      </header>

      <CourseGrid
        courses={filteredCourses}
        onEdit={openModal}
        onDelete={handleDelete}
        onOpenModal={openModal}
        onManageContent={(id) => navigate(`/courses/builder/${id}`)}
        onShowDetails={(course) => setViewCourse(course)}
        onShare={(course) => setShareCourse(course)}
      />

      <CourseModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        step={step}
        setStep={setStep}
        formData={formData}
        handleInputChange={handleInputChange}
        handleImageChange={handleImageChange}
        handleSave={handleSave}
        isEdit={editIndex !== null}
      />

      <CourseDetailsModal
        isOpen={!!viewCourse}
        onClose={() => setViewCourse(null)}
        course={viewCourse}
      />

      <CourseShareModal
        isOpen={!!shareCourse}
        onClose={() => setShareCourse(null)}
        course={shareCourse}
      />
    </div>
  );
};

export default CoursesPage;
