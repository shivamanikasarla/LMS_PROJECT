import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    FiClock,
    FiCheckCircle,
    FiAlertCircle,
    FiChevronLeft,
    FiChevronRight,
    FiFlag,
    FiMenu
} from "react-icons/fi";
import './LearnerExamView.css';

// Mock Data for the Exam
const MOCK_EXAM = {
    id: "E-101",
    title: "Advanced React Assessment",
    duration: 60, // minutes
    totalMarks: 100,
    instructions: [
        "All questions are compulsory.",
        "The timer will start the moment you click 'Start Exam'.",
        "You can navigate between questions using the palette.",
        "Green indicates answered, Yellow indicates marked for review.",
        "Click 'Submit Exam' to finish your attempt."
    ],
    questions: [
        {
            id: 1,
            text: "What is the purpose of the `useEffect` hook in React?",
            marks: 5,
            type: "single",
            options: [
                { id: "a", text: "To manage state in functional components" },
                { id: "b", text: "To perform side effects in functional components" },
                { id: "c", text: "To create a Redux store" },
                { id: "d", text: "To optimize rendering performance only" }
            ]
        },
        {
            id: 2,
            text: "Which of the following is NOT a built-in React Hook?",
            marks: 5,
            type: "single",
            options: [
                { id: "a", text: "useMemo" },
                { id: "b", text: "useReducer" },
                { id: "c", text: "useFetch" },
                { id: "d", text: "useContext" }
            ]
        },
        {
            id: 3,
            text: "How do you pass data from a parent component to a child component?",
            marks: 5,
            type: "single",
            options: [
                { id: "a", text: "Using State" },
                { id: "b", text: "Using Props" },
                { id: "c", text: "Using Redux" },
                { id: "d", text: "Using Context" }
            ]
        }
    ]
};

const LearnerExamView = () => {
    const { id } = useParams(); // In a real app, fetch exam by ID
    const navigate = useNavigate();

    // States
    const [examStarted, setExamStarted] = useState(false);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState({}); // { questionId: optionId }
    const [markedForReview, setMarkedForReview] = useState({}); // { questionId: true }
    const [timeLeft, setTimeLeft] = useState(MOCK_EXAM.duration * 60); // seconds
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [examSubmitted, setExamSubmitted] = useState(false);

    // Timer Logic
    useEffect(() => {
        let timer;
        if (examStarted && !examSubmitted && timeLeft > 0) {
            timer = setInterval(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);
        } else if (timeLeft === 0 && examStarted && !examSubmitted) {
            handleSubmit();
        }
        return () => clearInterval(timer);
    }, [examStarted, timeLeft, examSubmitted]);

    // Anti-cheat: Disable Right Click
    useEffect(() => {
        const handleContextMenu = (e) => {
            e.preventDefault();
        };
        document.addEventListener("contextmenu", handleContextMenu);
        return () => {
            document.removeEventListener("contextmenu", handleContextMenu);
        };
    }, []);

    // Helpers
    const formatTime = (seconds) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${h > 0 ? h + ':' : ''}${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
    };

    const handleStartExam = () => {
        setExamStarted(true);
        // Enforce Fullscreen
        const elem = document.documentElement;
        if (elem.requestFullscreen) {
            elem.requestFullscreen().catch(err => {
                console.log("Error attempting to enable full-screen mode:", err.message);
            });
        }
    };

    const handleAnswer = (optionId) => {
        setAnswers(prev => ({
            ...prev,
            [MOCK_EXAM.questions[currentQuestionIndex].id]: optionId
        }));
    };

    const toggleMarkForReview = () => {
        const qId = MOCK_EXAM.questions[currentQuestionIndex].id;
        setMarkedForReview(prev => {
            const newState = { ...prev };
            if (newState[qId]) delete newState[qId];
            else newState[qId] = true;
            return newState;
        });
    };

    const handleNext = () => {
        if (currentQuestionIndex < MOCK_EXAM.questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        }
    };

    const handlePrev = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(prev => prev - 1);
        }
    };

    const handleSubmit = () => {
        setExamSubmitted(true);
        // Here you would typically determine score or send to backend
    };

    // Render Welcome Screen
    if (!examStarted) {
        return (
            <div className="learner-exam-container welcome-mode">
                <div className="welcome-card">
                    <div className="exam-icon-large">
                        <FiCheckCircle />
                    </div>
                    <h1>{MOCK_EXAM.title}</h1>
                    <div className="exam-meta">
                        <span><FiClock /> {MOCK_EXAM.duration} Minutes</span>
                        <span>•</span>
                        <span>{MOCK_EXAM.totalMarks} Marks</span>
                        <span>•</span>
                        <span>{MOCK_EXAM.questions.length} Questions</span>
                    </div>

                    <div className="instructions-box">
                        <h3>Instructions</h3>
                        <ul>
                            {MOCK_EXAM.instructions.map((inst, idx) => (
                                <li key={idx}>{inst}</li>
                            ))}
                        </ul>
                    </div>

                    <button className="btn-start-exam" onClick={handleStartExam}>
                        Start Exam Now
                    </button>
                </div>
            </div>
        );
    }

    // Render Submitted Screen
    if (examSubmitted) {
        const answeredCount = Object.keys(answers).length;
        return (
            <div className="learner-exam-container submit-mode">
                <div className="result-card">
                    <div className="success-icon">
                        <FiCheckCircle />
                    </div>
                    <h2>Exam Submitted Successfully!</h2>
                    <p>Thank you for completing the assessment.</p>

                    <div className="result-stats">
                        <div className="stat-item">
                            <span className="sc-label">Attempted</span>
                            <span className="sc-val">{answeredCount}</span>
                        </div>
                        <div className="stat-item">
                            <span className="sc-label">Skipped</span>
                            <span className="sc-val">{MOCK_EXAM.questions.length - answeredCount}</span>
                        </div>
                    </div>

                    <button className="btn-dashboard" onClick={() => navigate('/exams/student/dashboard')}>
                        Return to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    const currentQuestion = MOCK_EXAM.questions[currentQuestionIndex];
    const isAnswered = answers[currentQuestion.id];
    const isReview = markedForReview[currentQuestion.id];

    return (
        <div className="learner-exam-container active-mode">
            {/* Header / Topbar */}
            <header className="exam-topbar">
                <div className="topbar-left">
                    <span className="exam-title-small">{MOCK_EXAM.title}</span>
                </div>
                <div className="topbar-right">
                    <div className={`timer-box ${timeLeft < 300 ? 'warning' : ''}`}>
                        <FiClock /> {formatTime(timeLeft)}
                    </div>
                    <button
                        className="btn-finish-exam"
                        onClick={() => {
                            if (window.confirm("Are you sure you want to submit the exam?")) {
                                handleSubmit();
                            }
                        }}
                    >
                        Submit Exam
                    </button>
                    <button className="menu-toggle mobile-only" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                        <FiMenu />
                    </button>
                </div>
            </header>

            <div className="exam-layout">
                {/* Main Question Area */}
                <main className="question-area">
                    <div className="question-header">
                        <span className="q-badge">Question {currentQuestionIndex + 1}</span>
                        <div className="q-marks">+{currentQuestion.marks} Marks</div>
                    </div>

                    <div className="question-content">
                        <h3 className="q-text">{currentQuestion.text}</h3>

                        <div className="options-list">
                            {currentQuestion.options.map(opt => (
                                <label
                                    key={opt.id}
                                    className={`option-card ${answers[currentQuestion.id] === opt.id ? 'selected' : ''}`}
                                >
                                    <input
                                        type="radio"
                                        name={`q-${currentQuestion.id}`}
                                        value={opt.id}
                                        checked={answers[currentQuestion.id] === opt.id}
                                        onChange={() => handleAnswer(opt.id)}
                                    />
                                    <span className="opt-indicator">{opt.id.toUpperCase()}</span>
                                    <span className="opt-text">{opt.text}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="question-footer">
                        <button
                            className={`btn-review ${markedForReview[currentQuestion.id] ? 'active' : ''}`}
                            onClick={toggleMarkForReview}
                        >
                            <FiFlag /> {markedForReview[currentQuestion.id] ? 'Unmark Review' : 'Mark for Review'}
                        </button>

                        <div className="nav-buttons">
                            <button
                                className="btn-nav prev"
                                disabled={currentQuestionIndex === 0}
                                onClick={handlePrev}
                            >
                                <FiChevronLeft /> Previous
                            </button>
                            <button
                                className="btn-nav next"
                                disabled={currentQuestionIndex === MOCK_EXAM.questions.length - 1}
                                onClick={handleNext}
                            >
                                Next <FiChevronRight />
                            </button>
                        </div>
                    </div>
                </main>

                {/* Sidebar Question Palette */}
                <aside className={`question-palette-sidebar ${isSidebarOpen ? 'open' : ''}`}>
                    <div className="palette-header">
                        <h4>Question Palette</h4>
                    </div>
                    <div className="palette-grid">
                        {MOCK_EXAM.questions.map((q, idx) => {
                            const ans = answers[q.id];
                            const rev = markedForReview[q.id];
                            let statusClass = 'not-visited';
                            if (ans) statusClass = 'answered';
                            if (rev) statusClass = 'review';
                            if (ans && rev) statusClass = 'review-answered';
                            if (currentQuestionIndex === idx) statusClass += ' current';

                            return (
                                <button
                                    key={q.id}
                                    className={`palette-btn ${statusClass}`}
                                    onClick={() => {
                                        setCurrentQuestionIndex(idx);
                                        setIsSidebarOpen(false);
                                    }}
                                >
                                    {idx + 1}
                                </button>
                            );
                        })}
                    </div>

                    <div className="palette-legend">
                        <div className="legend-item"><span className="dot answered"></span> Answered</div>
                        <div className="legend-item"><span className="dot review"></span> Mark for Review</div>
                        <div className="legend-item"><span className="dot not-visited"></span> Not Visited</div>
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default LearnerExamView;
