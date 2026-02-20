import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
    FiClock,
    FiAlertTriangle,
    FiCheckCircle,
    FiCode,
    FiCpu,
    FiMessageSquare,
    FiUser,
    FiMonitor,
    FiArrowRight,
    FiInfo
} from "react-icons/fi";

/* --- MOCK DATA BASED ON USER REQUEST --- */
const EXAM_CONFIG = {
    company: "Tech Giant Corp",
    role: "Search Engineer",
    totalDuration: 90, // Display only
    sections: [
        {
            id: "sec-1",
            title: "Cognitive Application",
            type: "aptitude", // internal type
            duration: 1, // minutes for demo (real: 10-15)
            questions: [
                { id: "q1", text: "If a train travels 60km/h...", options: ["10km", "20km", "30km", "40km"] },
                { id: "q2", text: "Find the missing number: 2, 4, 8, ...", options: ["10", "12", "16", "14"] },
                { id: "q3", text: "Verbal: Choose the synonym of 'Ephemeral'.", options: ["Lasting", "Short-lived", "Heavy", "Bright"] }
            ]
        },
        {
            id: "sec-2",
            title: "Technical Assessment",
            type: "technical",
            duration: 2,
            questions: [
                { id: "t1", text: "Which data structure is best for LIFO?", options: ["Queue", "Stack", "Tree", "Graph"] },
                { id: "t2", text: "What is the time complexity of binary search?", options: ["O(n)", "O(log n)", "O(n^2)", "O(1)"] },
                { id: "t3", text: "Java: public static void main(String[] args)...", options: ["Correct", "Incorrect", "Runtime Error", "Compile Error"] }
            ]
        },
        {
            id: "sec-3",
            title: "Hands-on Coding",
            type: "coding",
            duration: 3,
            questions: [
                {
                    id: "c1",
                    text: "Write a function to reverse a string without using built-in methods.",
                    starterCode: "function reverseString(s) {\n  // Your code here\n  return s;\n}"
                }
            ]
        },
        {
            id: "sec-4",
            title: "Managerial / Behavioral",
            type: "personality",
            duration: 1,
            questions: [
                { id: "p1", text: "I prefer working alone rather than in a team.", options: ["Strongly Agree", "Agree", "Neutral", "Disagree", "Strongly Disagree"] },
                { id: "p2", text: "I handle stress well under pressure.", options: ["Always", "Often", "Sometimes", "Rarely", "Never"] }
            ]
        }
    ]
};

const SectionBasedExamPreview = () => {
    const navigate = useNavigate();

    // --- STATES ---
    const [status, setStatus] = useState("intro"); // intro | active | result
    const [currentSectionIdx, setCurrentSectionIdx] = useState(0);
    const [timeLeft, setTimeLeft] = useState(0);
    const [answers, setAnswers] = useState({});
    const [sectionLocked, setSectionLocked] = useState(false);
    const [fullScreenMode, setFullScreenMode] = useState(false);

    // --- REFS ---
    const timerRef = useRef(null);

    // --- INIT SECTION ---
    useEffect(() => {
        if (status === "active") {
            const sec = EXAM_CONFIG.sections[currentSectionIdx];
            setTimeLeft(sec.duration * 60);
            setSectionLocked(false);
            window.scrollTo(0, 0);
        }
    }, [currentSectionIdx, status]);

    // --- TIMER LOGIC ---
    useEffect(() => {
        if (status === "active" && timeLeft > 0) {
            timerRef.current = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        handleSectionTimeout();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(timerRef.current);
    }, [timeLeft, status]);

    const handleSectionTimeout = () => {
        clearInterval(timerRef.current);
        toast.warning("Time's up! Moving to next section...");
        handleNextSection();
    };

    const handleNextSection = () => {
        if (currentSectionIdx < EXAM_CONFIG.sections.length - 1) {
            setCurrentSectionIdx((prev) => prev + 1);
        } else {
            finishExam();
        }
    };

    const finishExam = () => {
        setStatus("result");
        if (document.fullscreenElement) {
            document.exitFullscreen().catch(err => console.log(err));
        }
    };

    const startExam = () => {
        try {
            if (document.documentElement.requestFullscreen) {
                document.documentElement.requestFullscreen();
                setFullScreenMode(true);
            }
        } catch (e) {
            console.warn("Fullscreen blocked", e);
        }
        setStatus("active");
    };

    const handleAnswerChange = (qId, val) => {
        setAnswers((prev) => ({ ...prev, [qId]: val }));
    };

    // --- FORMAT TIME ---
    const formatTime = (s) => {
        const min = Math.floor(s / 60);
        const sec = s % 60;
        return `${min}:${sec < 10 ? "0" : ""}${sec}`;
    };

    // --- RENDER HELPERS ---
    const renderIntro = () => (
        <div className="container d-flex flex-column justify-content-center align-items-center min-vh-100 py-5">
            <div className="card border-0 shadow-lg p-5 text-center" style={{ maxWidth: "700px", borderRadius: "24px", background: "rgba(255, 255, 255, 0.95)", backdropFilter: "blur(10px)" }}>
                <div className="mb-4 text-primary">
                    <FiMonitor size={64} />
                </div>
                <h1 className="display-5 fw-bold mb-3">{EXAM_CONFIG.company} Assessment</h1>
                <p className="text-muted fs-5 mb-4">{EXAM_CONFIG.role} Role • {EXAM_CONFIG.totalDuration} Mins • {EXAM_CONFIG.sections.length} Sections</p>

                <div className="alert alert-warning text-start mb-4 border-0 bg-warning bg-opacity-10 text-dark">
                    <h5 className="fw-bold fs-6 mb-2"><FiAlertTriangle className="me-2" /> Critical Rules</h5>
                    <ul className="mb-0 small ps-3">
                        <li><strong>You must finish a section</strong> to move to the next. No going back.</li>
                        <li>Each section has a <strong>locked timer</strong>. Auto-submit happens when time ends.</li>
                        <li>Do not switch tabs or exit full screen.</li>
                        <li>Unanswered questions will result in <strong>zero marks</strong>.</li>
                    </ul>
                </div>

                <div className="d-grid gap-2">
                    {EXAM_CONFIG.sections.map((sec, idx) => (
                        <div key={idx} className="d-flex align-items-center justify-content-between p-3 border rounded-3 bg-light">
                            <span className="fw-bold d-flex align-items-center gap-2">
                                {getSectionIcon(sec.type)}
                                {sec.title}
                            </span>
                            <span className="badge bg-secondary">{sec.duration} Mins</span>
                        </div>
                    ))}
                </div>

                <button onClick={startExam} className="btn btn-primary btn-lg w-100 mt-5 rounded-pill fw-bold shadow-sm py-3 hover-scale">
                    Start Assessment
                </button>
            </div>
        </div>
    );

    const getSectionIcon = (type) => {
        switch (type) {
            case 'coding': return <FiCode />;
            case 'technical': return <FiCpu />;
            case 'personality': return <FiUser />;
            default: return <FiMessageSquare />;
        }
    }

    const renderActiveSection = () => {
        const section = EXAM_CONFIG.sections[currentSectionIdx];

        return (
            <div className="min-vh-100 d-flex flex-column bg-light font-sans">
                {/* HEADER */}
                <header className="fixed-top bg-white shadow-sm px-4 py-3 d-flex justify-content-between align-items-center" style={{ zIndex: 1000 }}>
                    <div className="d-flex align-items-center gap-3">
                        <div className="logo bg-primary text-white rounded p-2 fw-bold">{EXAM_CONFIG.company.substring(0, 2).toUpperCase()}</div>
                        <div>
                            <h6 className="m-0 fw-bold">{section.title}</h6>
                            <small className="text-muted">Section {currentSectionIdx + 1} of {EXAM_CONFIG.sections.length}</small>
                        </div>
                    </div>

                    <div className={`d-flex align-items-center px-4 py-2 rounded-pill fw-bold fs-5 ${timeLeft < 30 ? 'bg-danger text-white animate-pulse' : 'bg-primary text-white'}`}>
                        <FiClock className="me-2" />
                        {formatTime(timeLeft)}
                    </div>
                </header>

                {/* MAIN BODY */}
                <main className="container flex-grow-1" style={{ marginTop: "100px", maxWidth: "900px" }}>

                    {/* Progress Bar for Sections */}
                    <div className="mb-5 d-flex gap-2">
                        {EXAM_CONFIG.sections.map((sec, idx) => (
                            <div key={idx} className={`flex-grow-1 h-1 rounded overflow-hidden ${idx <= currentSectionIdx ? (idx === currentSectionIdx ? 'bg-primary' : 'bg-success') : 'bg-secondary bg-opacity-25'}`} style={{ height: '6px' }}></div>
                        ))}
                    </div>

                    <div className="card shadow border-0 rounded-4 overflow-hidden mb-5 animate-fade-in-up">
                        <div className="card-header bg-white border-0 p-4 pb-0">
                            <h4 className="fw-bold mb-1">{section.title}</h4>
                            <p className="text-muted small">Please answer all questions below.</p>
                        </div>
                        <div className="card-body p-4">
                            {section.questions.map((q, qIdx) => (
                                <div key={q.id} className="mb-5 border-bottom pb-4 last-no-border">
                                    <div className="d-flex gap-3">
                                        <span className="badge bg-light text-dark border align-self-start mt-1">Q{qIdx + 1}</span>
                                        <div className="flex-grow-1">
                                            <h5 className="mb-3" style={{ lineHeight: "1.6" }}>{q.text}</h5>

                                            {section.type === 'coding' ? (
                                                <div className="coding-env">
                                                    <div className="d-flex justify-content-between bg-dark text-white p-2 rounded-top small">
                                                        <span>Javascript</span>
                                                        <span>main.js</span>
                                                    </div>
                                                    <textarea
                                                        className="form-control bg-dark text-white font-monospace border-0 rounded-0 rounded-bottom"
                                                        rows="12"
                                                        value={answers[q.id] || q.starterCode}
                                                        onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                                                    ></textarea>
                                                </div>
                                            ) : (
                                                <div className="vstack gap-2">
                                                    {q.options?.map((opt, oIdx) => (
                                                        <label key={oIdx} className={`d-flex align-items-center p-3 rounded border cursor-pointer transition-all ${answers[q.id] === opt ? 'border-primary bg-primary bg-opacity-10 border-2' : 'hover-bg-gray'}`}>
                                                            <input
                                                                type="radio"
                                                                name={q.id}
                                                                className="form-check-input me-3"
                                                                checked={answers[q.id] === opt}
                                                                onChange={() => handleAnswerChange(q.id, opt)}
                                                            />
                                                            <span>{opt}</span>
                                                        </label>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="card-footer bg-light p-4 d-flex justify-content-end">
                            <button
                                className="btn btn-primary btn-lg px-5 rounded-pill fw-bold"
                                onClick={() => {
                                    if (window.confirm("Finish this section? You cannot return.")) {
                                        handleNextSection();
                                    }
                                }}
                            >
                                {currentSectionIdx === EXAM_CONFIG.sections.length - 1 ? 'Finish Assessment' : 'Next Section'} <FiArrowRight className="ms-2" />
                            </button>
                        </div>
                    </div>
                </main>
            </div>
        );
    };

    const renderResult = () => (
        <div className="min-vh-100 bg-white d-flex flex-column align-items-center justify-content-center p-4 text-center">
            <div className="mb-4 text-success animate-bounce">
                <FiCheckCircle size={80} />
            </div>
            <h1 className="fw-bold mb-2">Assessment Completed</h1>
            <p className="text-muted fs-5 mb-5" style={{ maxWidth: "600px" }}>
                Thank you for completing the {EXAM_CONFIG.role} assessment.
                Your responses have been recorded and sent to the recruitment team.
            </p>

            <div className="card bg-light border-0 p-4 mb-5" style={{ width: "100%", maxWidth: "400px" }}>
                <h6 className="fw-bold text-uppercase text-muted small mb-3">Submission Summary</h6>
                <div className="d-flex justify-content-between mb-2">
                    <span>Total Sections</span>
                    <span className="fw-bold">{EXAM_CONFIG.sections.length}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                    <span>Questions Attempted</span>
                    <span className="fw-bold">{Object.keys(answers).length}</span>
                </div>
            </div>

            <button onClick={() => navigate('/exams/dashboard')} className="btn btn-outline-dark rounded-pill px-5">
                Return to Dashboard
            </button>
        </div>
    );

    return (
        <>
            <ToastContainer position="top-right" />
            <style>
                {`
                .font-sans { font-family: 'Inter', sans-serif; }
                .hover-scale { transition: transform 0.2s; }
                .hover-scale:hover { transform: scale(1.02); }
                .hover-bg-gray:hover { background-color: #f8f9fa; }
                .last-no-border:last-child { border-bottom: none !important; margin-bottom: 0 !important; }
                .animate-fade-in-up { animation: fadeInUp 0.5s ease-out; }
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-pulse { animation: pulse 1s infinite; }
            `}
            </style>
            {status === "intro" && renderIntro()}
            {status === "active" && renderActiveSection()}
            {status === "result" && renderResult()}
        </>
    );
};

export default SectionBasedExamPreview;
