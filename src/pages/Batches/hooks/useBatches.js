import { useState, useMemo } from 'react';
import {
    INITIAL_BATCH_FORM,
    BATCH_STATUS,
    BATCH_TABS
} from '../constants/batchConstants';
import { getBatchStatus, validateBatchForm } from '../utils/batchUtils';

// Temporary mock data (remove when backend is ready)
// Temporary mock data (remove when backend is ready)
export const INITIAL_BATCHES = [
    {
        id: 1,
        name: "React Morning Batch A",
        courseId: "C-101",
        startDate: "2024-01-01",
        endDate: "2024-03-01",
        price: 5000,
        classesPerWeek: "3",
        mode: "Online",
        validity: "6 Months",
        maxStudents: 60,
        students: 42,
        instructorId: 2 // Sarah Smith
    },
    {
        id: 2,
        name: "Python Weekend Special",
        courseId: "C-102",
        startDate: "2025-06-01",
        endDate: "2025-08-01",
        price: 8000,
        classesPerWeek: "2",
        mode: "Offline",
        validity: "1 Year",
        instructorId: 2 // Sarah Smith
    }
];

export const useBatches = (courses = []) => {
    const [batches, setBatches] = useState(INITIAL_BATCHES);
    const [currentTab, setCurrentTab] = useState(BATCH_TABS.ALL);
    const [searchQuery, setSearchQuery] = useState('');

    // Filters
    const [courseFilter, setCourseFilter] = useState('All');
    const [instructorFilter, setInstructorFilter] = useState('All');

    // Modal state
    const [showModal, setShowModal] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [editId, setEditId] = useState(null);
    const [formData, setFormData] = useState(INITIAL_BATCH_FORM);

    // Derived batches with status
    const enrichedBatches = useMemo(() => {
        return batches.map(b => ({
            ...b,
            status: getBatchStatus(b.startDate, b.endDate)
        }));
    }, [batches]);

    // Filters
    const filteredBatches = useMemo(() => {
        let result = enrichedBatches;

        // Tab Filter
        if (currentTab !== BATCH_TABS.ALL) {
            result = result.filter(b => b.status === currentTab);
        }

        // Dropdown Filters
        if (courseFilter !== 'All') {
            result = result.filter(b => b.courseId === courseFilter);
        }
        if (instructorFilter !== 'All') {
            result = result.filter(b => String(b.instructorId) === String(instructorFilter));
        }

        // Search
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            result = result.filter(b => {
                const course = courses.find(c => c.id === b.courseId);
                return (
                    b.name.toLowerCase().includes(q) ||
                    course?.name.toLowerCase().includes(q)
                );
            });
        }

        return result;
    }, [enrichedBatches, currentTab, courseFilter, instructorFilter, searchQuery, courses]);

    // Stats
    const stats = useMemo(() => ({
        total: enrichedBatches.length,
        upcoming: enrichedBatches.filter(b => b.status === BATCH_STATUS.UPCOMING).length,
        ongoing: enrichedBatches.filter(b => b.status === BATCH_STATUS.ONGOING).length,
        completed: enrichedBatches.filter(b => b.status === BATCH_STATUS.COMPLETED).length
    }), [enrichedBatches]);

    // Form handlers
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const openModal = (batch = null) => {
        if (batch) {
            setIsEdit(true);
            setEditId(batch.id);
            setFormData({ ...batch });
        } else {
            setIsEdit(false);
            setEditId(null);
            setFormData(INITIAL_BATCH_FORM);
        }
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setFormData(INITIAL_BATCH_FORM);
    };

    const handleSave = () => {
        const errors = validateBatchForm(formData);
        if (errors.length) {
            alert(errors.join('\n'));
            return;
        }

        const batchData = {
            ...formData,
            price: formData.price ? Number(formData.price) : 0,
            maxStudents: formData.maxStudents ? Number(formData.maxStudents) : 0,
            instructorId: formData.instructorId ? Number(formData.instructorId) : null
        };

        if (isEdit) {
            setBatches(prev =>
                prev.map(b => b.id === editId ? { ...batchData, id: editId } : b)
            );
        } else {
            setBatches(prev => [
                ...prev,
                { ...batchData, id: Date.now(), students: 0 }
            ]);
        }

        closeModal();
    };

    const handleDelete = (id) => {
        if (window.confirm('Delete this batch?')) {
            setBatches(prev => prev.filter(b => b.id !== id));
        }
    };

    return {
        batches: filteredBatches,
        allBatches: enrichedBatches,
        stats,
        currentTab,
        setCurrentTab,
        searchQuery,
        setSearchQuery,
        courseFilter,
        setCourseFilter,
        instructorFilter,
        setInstructorFilter,

        // Modal
        showModal,
        openModal,
        closeModal,
        isEdit,
        formData,
        handleInputChange,
        handleSave,
        handleDelete
    };
};
