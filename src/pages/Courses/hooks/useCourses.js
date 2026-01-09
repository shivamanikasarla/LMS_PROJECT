import { useState, useEffect } from 'react';
import { INITIAL_FORM_DATA } from '../constants/courseConstants';
import { validateCourseForm } from '../utils/validators';
import { courseService } from '../services/courseService';

export const useCourses = () => {
    const [courses, setCourses] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editIndex, setEditIndex] = useState(null); // We might want to use ID instead of index now, but keeping index for grid compatibility or switching to ID. The grid uses index? No, Grid usually iterates. Let's see. 
    // Actually, it's better to verify if OpenModal passes index or object. The previous code passed index.
    // I need to adapt openModal to work with the fetched data.
    const [currentCourseId, setCurrentCourseId] = useState(null);
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState(INITIAL_FORM_DATA);

    // Fetch courses on mount
    useEffect(() => {
        loadCourses();
    }, []);

    const loadCourses = async () => {
        try {
            const data = await courseService.getCourses();
            // Map backend data to frontend model
            const mappedCourses = data.map(c => ({
                id: c.courseId,
                name: c.courseName,
                desc: c.description,
                overview: c.description, // Map description to overview as well
                toolsCovered: c.toolsCovered,
                duration: c.duration,
                price: c.courseFee, // Map courseFee to price
                img: c.courseImageUrl || "https://images.unsplash.com/photo-1517694712202-14dd9538aa97",
                showValidity: c.showValidity,
                validityDuration: c.validityInDays,
                allowOffline: c.allowOfflineMobile,
                provideCertificate: c.certificateProvided,
                contentAccessEnabled: c.enableContentAccess,
                status: c.status || "Draft",
                // MOCK
                mentorName: "TBD",
                courseType: (c.courseFee && c.courseFee > 0) ? "Paid" : "Free"
            }));
            setCourses(mappedCourses);
        } catch (error) {
            console.error("Failed to load courses", error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        let val = value;

        if (type === 'checkbox') {
            val = (name === 'accessPlatforms') ? value : checked;
        } else if (value === 'true') val = true;
        else if (value === 'false') val = false;

        if (name === 'accessPlatforms') {
            setFormData(prev => {
                const current = prev.accessPlatforms || [];
                if (checked) return { ...prev, accessPlatforms: [...current, value] };
                return { ...prev, accessPlatforms: current.filter(item => item !== value) };
            });
        } else {
            setFormData(prev => ({ ...prev, [name]: val }));
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({
                ...prev,
                img: file,
                imgPreview: URL.createObjectURL(file)
            }));
        }
    };

    const resetForm = () => {
        setFormData(INITIAL_FORM_DATA);
        setCurrentCourseId(null);
        setEditIndex(null);
        setStep(1);
    };

    const openModal = (index = null) => {
        if (index !== null) {
            const c = courses[index];
            setCurrentCourseId(c.id);
            setEditIndex(index);
            // Map course data back to form data
            setFormData({
                name: c.name,
                description: c.desc,
                overview: c.overview,
                toolsCovered: c.toolsCovered,
                duration: c.duration, // Mapped
                price: c.price, // Mapped
                img: null,
                imgPreview: c.img,
                showValidity: c.showValidity,
                validityDuration: c.validityDuration,
                allowOffline: c.allowOffline,
                certificateEnabled: c.provideCertificate,
                contentAccessEnabled: c.contentAccessEnabled,
                accessPlatforms: ['Website'] // Default
            });
        } else {
            resetForm();
        }
        setShowModal(true);
    };

    const handleSave = async () => {
        // Validation check
        // const errors = validateCourseForm(formData); 
        // if (errors.length > 0) {
        //     alert(errors.join("\n"));
        //     return;
        // }

        let imageUrl = formData.imgPreview;
        // Check if img is a file (not implemented backend upload yet)
        if (formData.img) {
            imageUrl = "https://via.placeholder.com/300?text=Uploaded+Image";
        }

        // Sanitize Payload for Backend (Prevent 500 Errors)
        const payload = {
            courseName: formData.name || "Untitled Course", // Prevent null
            description: formData.description || formData.overview || "No Description",
            duration: formData.duration || "Self Paced",
            toolsCovered: formData.toolsCovered || "",
            courseFee: formData.price ? parseFloat(formData.price) : 0.0,

            // If user uploaded an image (preview exists), use it. 
            // NOTE: This Blob URL is local-only. For production, you MUST implement backend file upload.
            // If the backend rejects this (500 error), revert to the random URL logic.
            courseImageUrl: formData.imgPreview ? formData.imgPreview : `https://source.unsplash.com/random/400x300/?coding,technology&sig=${Math.floor(Math.random() * 1000)}`,

            showValidity: formData.showValidity === true, // Ensure boolean
            // Only send validityInDays if showValidity is true, otherwise null (or backend handles logic)
            validityInDays: (formData.showValidity && formData.validityDuration)
                ? parseInt(formData.validityDuration)
                : null,

            allowOfflineMobile: formData.allowOffline === true,
            enableContentAccess: formData.contentAccessEnabled === true,
            certificateProvided: formData.certificateEnabled === true,

            allowBookmark: false, // Explicitly false as removed from UI
            status: "ACTIVE" // Fix: Uppercase as per Postman
        };

        try {
            if (currentCourseId) {
                await courseService.updateCourse(currentCourseId, payload);
            } else {
                await courseService.createCourse(payload);
            }
            await loadCourses();
            setShowModal(false);
            resetForm();
        } catch (error) {
            console.error("Save failed", error);
            alert("Failed to save course. Check console.");
        }
    };

    const handleDelete = async (index) => {
        const c = courses[index];
        if (!c || !c.id) return;

        if (window.confirm("Delete this course?")) {
            try {
                await courseService.deleteCourse(c.id);
                loadCourses();
            } catch (error) {
                console.error("Delete failed", error);
                alert("Failed to delete course");
            }
        }
    };

    return {
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
        editIndex,
        setFormData
    };
};
