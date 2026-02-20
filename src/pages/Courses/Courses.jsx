import React from "react";
import { FiPlus } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

import CourseFilters from "./components/CourseFilters";
import CourseGrid from "./components/CourseGrid";
import CourseModal from "./components/CourseModal";
import CourseDetailsModal from "./components/CourseDetailsModal";
import CourseShareModal from "./components/CourseShareModal";

import { useCourses } from "./hooks/useCourses";
import { useCourseFilters } from "./hooks/useCourseFilters";

import "./styles/courses.css";

const CoursesPage = () => {
  const navigate = useNavigate();

  const [viewCourse, setViewCourse] = React.useState(null);
  const [shareCourse, setShareCourse] = React.useState(null);

  /* ======================
     Data & Logic
  ====================== */
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
    toggleCourseStatus,
    toggleBookmark
  } = useCourses();

  /* ======================
     Filters
  ====================== */
  const {
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    filteredCourses,
  } = useCourseFilters(courses);

  // Manual Enrichment for Learners Count
  const [enrichedCourses, setEnrichedCourses] = React.useState([]);

  React.useEffect(() => {
    const enrichCourses = async () => {
      // If we are filtering, we enrich the filtered list. If not, we enrich the main list?
      // Actually usually better to enrich the base list, but we only display filteredCourses.
      // Let's enrich filteredCourses for display.
      if (!filteredCourses) return;

      try {
        // Dynamic import to avoid circular dependencies if any, though likely safe to import normally
        const { batchService } = await import('../Batches/services/batchService');
        const { enrollmentService } = await import('../Batches/services/enrollmentService');

        const [batches, enrollments] = await Promise.all([
          batchService.getAllBatches().catch(() => []),
          enrollmentService.getAllEnrollments()
        ]);

        const updated = filteredCourses.map(course => {
          // 1. Find all batches for this course
          const courseBatches = batches.filter(b => String(b.courseId) === String(course.id));
          const batchIds = courseBatches.map(b => String(b.batchId));

          // 2. Find all enrollments in these batches
          const courseEnrollments = enrollments.filter(e => batchIds.includes(String(e.batchId)));

          // 3. Count unique students
          const uniqueStudents = new Set(courseEnrollments.map(e => String(e.studentId)));

          return {
            ...course,
            learnersCount: uniqueStudents.size
          };
        });

        setEnrichedCourses(updated);

      } catch (err) {
        console.error("Failed to calculate learners count", err);
        setEnrichedCourses(filteredCourses);
      }
    };

    enrichCourses();
  }, [filteredCourses]);

  return (
    <div className="courses-container">
      {/* Header */}
      <header className="courses-header">
        <div className="header-content">
          <h1>Course Management</h1>
          <p>Create, manage and assign courses.</p>
        </div>

        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <CourseFilters
            search={search}
            setSearch={setSearch}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
          />

          <button className="btn-primary-add" onClick={() => openModal()}>
            <FiPlus size={18} /> Add New Course
          </button>
        </div>
      </header>

      {/* Course Grid */}
      <CourseGrid
        courses={enrichedCourses}
        onEdit={openModal}
        onDelete={handleDelete}
        onToggleStatus={toggleCourseStatus}
        onManageContent={(id) => navigate(`/courses/builder/${id}`)}
        onShowDetails={(course) => setViewCourse(course)}
        onShare={(course) => setShareCourse(course)}
        onBookmark={toggleBookmark}
      />

      {/* Create / Edit Modal */}
      <CourseModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        formData={formData}
        handleInputChange={handleInputChange}
        handleImageChange={handleImageChange}
        handleSave={handleSave}
      />

      {/* Details Modal */}
      <CourseDetailsModal
        isOpen={!!viewCourse}
        onClose={() => setViewCourse(null)}
        course={viewCourse}
      />

      {/* Share Modal */}
      <CourseShareModal
        isOpen={!!shareCourse}
        onClose={() => setShareCourse(null)}
        course={shareCourse}
      />
    </div>
  );
};

export default CoursesPage;
