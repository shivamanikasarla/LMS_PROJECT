
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { FiClock, FiUsers, FiAward, FiCheckCircle, FiPlayCircle, FiLock, FiBookOpen, FiArrowRight } from 'react-icons/fi';
// import { useCourses } from './hooks/useCourses'; // Assuming we can use this or mock it

const CourseOverview = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    // Mock Auth State (Replace with real auth context)
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // Mock Course Data (In real app, fetch by ID)
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate fetching course details
        setTimeout(() => {
            setCourse({
                id: id,
                title: "Advanced React Patterns & Performance",
                description: "Master advanced React concepts including HOCs, Render Props, Hooks, and Context API. Learn to build scalable and high-performance applications.",
                longDescription: "This comprehensive course takes you beyond the basics of React. You'll dive deep into advanced patterns, performance optimization techniques, and state management strategies used by top-tier tech companies. By the end of this course, you'll be able to architect complex applications with confidence.",
                instructor: "Sarah Wilson",
                instructorRole: "Senior Frontend Engineer",
                duration: "12 Weeks",
                lessons: 48,
                students: 1240,
                rating: 4.8,
                price: "$99.00",
                originalPrice: "$149.00",
                coverImage: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-1.2.1&auto=format&fit=crop&w=1470&q=80",
                topics: [
                    "Advanced Hooks & Custom Hooks",
                    "Performance Optimization (useMemo, useCallback)",
                    "State Management (Redux, Zustand, Context)",
                    "Server-Side Rendering (Next.js)",
                    "Testing React Applications",
                    "Design Systems & Component Libraries"
                ],
                curriculum: [
                    { title: "Introduction to Advanced Patterns", type: "video", duration: "10:00", isPreview: true },
                    { title: "Compound Components", type: "video", duration: "15:30", isPreview: false },
                    { title: "Control Props Pattern", type: "video", duration: "12:45", isPreview: false },
                    { title: "Performance Profiling", type: "video", duration: "20:00", isPreview: false },
                ]
            });
            setLoading(false);

            // Check for simulated login (e.g., set via login page redirect)
            const user = localStorage.getItem('mockUser');
            if (user) setIsLoggedIn(true);

        }, 800);
    }, [id]);

    const handleEnroll = () => {
        if (!isLoggedIn) {
            // Redirect to login with return url
            // In a real app, you'd probably have a specific login route. 
            // For this demo, assuming '/login' exists or using a mock approach.
            // Since there is no detailed login page in the file list (though there might be), 
            // I'll simulate the requirement "redirect to login".

            if (confirm("You need to login to enroll. Proceed to Login?")) {
                navigate('/login', { state: { from: location.pathname } });
            }
            return;
        }

        // If logged in -> Process Payment -> Enroll
        const confirmPayment = confirm(`Confirm enrollment for ${course.price}?`);
        if (confirmPayment) {
            alert("Payment Successful! Enrolling you now...");
            // Simulate enrollment
            setTimeout(() => {
                navigate('/'); // Redirect to "My Courses" (Dashboard Home often has My Courses)
            }, 1000);
        }
    };

    if (loading) {
        return (
            <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div className="spinner">Loading Course Details...</div>
            </div>
        );
    }

    if (!course) return <div>Course not found</div>;

    return (
        <div className="course-overview-page" style={{ background: '#f8fafc', minHeight: '100vh', fontFamily: '"Inter", sans-serif' }}>

            {/* Header / Navbar (Public) */}
            <nav style={{ padding: '20px 40px', background: 'white', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#0f172a' }}>LMS Platform</div>
                <div>
                    {!isLoggedIn ? (
                        <button
                            onClick={() => navigate('/login', { state: { from: location.pathname } })}
                            style={{ padding: '8px 24px', borderRadius: '8px', border: '1px solid #e2e8f0', background: 'white', color: '#0f172a', fontWeight: '600', cursor: 'pointer' }}
                        >
                            Log In
                        </button>
                    ) : (
                        <button
                            onClick={() => navigate('/')}
                            style={{ padding: '8px 24px', borderRadius: '8px', border: '1px solid #e2e8f0', background: 'white', color: '#0f172a', fontWeight: '600', cursor: 'pointer' }}
                        >
                            Go to Dashboard
                        </button>
                    )}
                </div>
            </nav>

            {/* Hero Section */}
            <div style={{ background: '#0f172a', color: 'white', padding: '60px 40px' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '60px', alignItems: 'center' }}>

                    {/* Left: Content */}
                    <div>
                        <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
                            <span style={{ background: 'rgba(255,255,255,0.1)', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600', color: '#60a5fa' }}>Development</span>
                            <span style={{ background: 'rgba(255,255,255,0.1)', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600', color: '#a78bfa' }}>Advanced</span>
                        </div>
                        <h1 style={{ fontSize: '48px', fontWeight: '800', lineHeight: '1.2', marginBottom: '24px' }}>{course.title}</h1>
                        <p style={{ fontSize: '18px', color: '#94a3b8', lineHeight: '1.6', marginBottom: '32px' }}>{course.description}</p>

                        <div style={{ display: 'flex', gap: '24px', fontSize: '14px', color: '#cbd5e1' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <FiUsers /> {course.students} Learners
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <FiClock /> {course.duration}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <FiAward /> Certificate of Completion
                            </div>
                        </div>
                    </div>

                    {/* Right: Card */}
                    <div style={{ background: 'white', borderRadius: '24px', padding: '24px', color: '#0f172a', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}>
                        <img
                            src={course.coverImage}
                            alt={course.title}
                            style={{ width: '100%', height: '220px', objectFit: 'cover', borderRadius: '16px', marginBottom: '24px' }}
                        />
                        <div style={{ display: 'flex', alignItems: 'end', gap: '12px', marginBottom: '24px' }}>
                            <span style={{ fontSize: '32px', fontWeight: '800' }}>{course.price}</span>
                            <span style={{ fontSize: '18px', color: '#94a3b8', textDecoration: 'line-through', paddingBottom: '6px' }}>{course.originalPrice}</span>
                        </div>

                        <button
                            onClick={handleEnroll}
                            style={{ width: '100%', padding: '16px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '12px', fontSize: '16px', fontWeight: '700', cursor: 'pointer', marginBottom: '16px', transition: 'background 0.2s' }}
                        >
                            Enroll Now
                        </button>
                        <p style={{ fontSize: '12px', textAlign: 'center', color: '#64748b' }}>30-Day Money-Back Guarantee</p>
                    </div>
                </div>
            </div>

            {/* Details Section */}
            <div style={{ maxWidth: '1200px', margin: '60px auto', padding: '0 40px', display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '60px' }}>

                {/* Main Info */}
                <div>
                    <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '24px' }}>What you'll learn</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '48px' }}>
                        {course.topics.map((topic, idx) => (
                            <div key={idx} style={{ display: 'flex', gap: '12px', alignItems: 'start' }}>
                                <FiCheckCircle color="#10b981" style={{ marginTop: '4px', flexShrink: 0 }} />
                                <span style={{ color: '#334155', lineHeight: '1.5' }}>{topic}</span>
                            </div>
                        ))}
                    </div>

                    <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '24px' }}>Course Content</h2>
                    <div style={{ border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden' }}>
                        {course.curriculum.map((item, idx) => (
                            <div key={idx} style={{ padding: '16px 24px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: idx % 2 === 0 ? 'white' : '#f8fafc' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    {item.type === 'video' ? <FiPlayCircle color="#64748b" /> : <FiBookOpen color="#64748b" />}
                                    <span style={{ color: '#334155', fontWeight: '500' }}>{item.title}</span>
                                    {item.isPreview && <span style={{ fontSize: '10px', background: '#ecfdf5', color: '#10b981', padding: '2px 8px', borderRadius: '12px', fontWeight: '600' }}>Preview</span>}
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                    <span style={{ fontSize: '13px', color: '#94a3b8' }}>{item.duration}</span>
                                    {!item.isPreview && <FiLock color="#cbd5e1" />}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Instructor Info */}
                <div>
                    <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '24px' }}>Instructor</h2>
                    <div style={{ background: 'white', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                            <div style={{ width: '60px', height: '60px', background: '#e2e8f0', borderRadius: '50%', overflow: 'hidden' }}>
                                <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" alt="Instructor" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                            <div>
                                <h4 style={{ margin: '0 0 4px 0', fontSize: '18px' }}>{course.instructor}</h4>
                                <span style={{ color: '#64748b', fontSize: '14px' }}>{course.instructorRole}</span>
                            </div>
                        </div>
                        <p style={{ color: '#475569', fontSize: '14px', lineHeight: '1.6', marginBottom: '0' }}>
                            Passionate educator and senior engineer with over 10 years of experience in building scalable web applications. Committed to helping students master modern web technologies.
                        </p>
                    </div>
                </div>

            </div>

        </div>
    );
};

export default CourseOverview;
