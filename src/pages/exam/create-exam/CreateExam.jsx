// import { useState, useMemo, useEffect } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import QuestionForm from "../components/QuestionForm";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// import { EXAM_TEMPLATES } from "./data/constants";
// import MixedQuestionManager from "./components/MixedQuestionManager";
// import ExamSetupCard from "./components/ExamSetupCard";

// const CreateExam = () => {
//   const navigate = useNavigate();
//   const { id } = useParams();
//   const isEditMode = !!id;

//   // New State: Step
//   const [step, setStep] = useState(isEditMode ? 'editor' : 'setup');
//   const [examStatus, setExamStatus] = useState("DRAFT"); // DRAFT | PUBLISHED

//   // Custom Assets State
//   const [customAssets, setCustomAssets] = useState({ bgImage: null, watermark: null, watermarkOpacity: 0.1 });
//   const [showSetupModal, setShowSetupModal] = useState(false);
//   const [showPreviewModal, setShowPreviewModal] = useState(false);
//   const [pendingConfig, setPendingConfig] = useState(null); // { mode: 'blank'|'template', data: ... }
//   const [setupFiles, setSetupFiles] = useState({ bg: null, watermark: null, watermarkOpacity: 0.1 });

//   const [examType, setExamType] = useState("mixed");
//   const [questions, setQuestions] = useState([]);

//   // Form State
//   const [examName, setExamName] = useState("");
//   const [course, setCourse] = useState("");
//   const [totalMarks, setTotalMarks] = useState(100);
//   const [duration, setDuration] = useState(60);

//   // Advanced Settings State
//   const [settings, setSettings] = useState({
//     maxAttempts: "1",
//     gradingStrategy: "highest",
//     cooldownPeriod: "0",
//     allowReattemptCondition: "always",
//     randomizeQuestions: true
//   });

//   const updateSettings = (key, value) => {
//     setSettings(prev => ({ ...prev, [key]: value }));
//   };

//   // Load data if in Edit Mode
//   useEffect(() => {
//     if (isEditMode) {
//       setStep('editor');
//       const savedExams = JSON.parse(localStorage.getItem("exams") || "[]");
//       const examToEdit = savedExams.find(e => e.id.toString() === id);

//       if (examToEdit) {
//         setExamName(examToEdit.title);
//         setCourse(examToEdit.course);
//         setExamType(examToEdit.type);
//         setTotalMarks(examToEdit.targetMarks || 100);
//         setDuration(examToEdit.duration);
//         setQuestions(examToEdit.questions || []);
//         if (examToEdit.settings) setSettings(examToEdit.settings);
//         if (examToEdit.customAssets) {
//           setCustomAssets({
//             ...examToEdit.customAssets,
//             watermarkOpacity: examToEdit.customAssets.watermarkOpacity ?? 0.1
//           });
//         }
//         // Load Status
//         if (examToEdit.status === 'published') {
//           setExamStatus('PUBLISHED');
//         } else {
//           setExamStatus('DRAFT');
//         }

//       } else {
//         toast.error("Exam not found!");
//         navigate("/exams/dashboard");
//       }
//     }
//   }, [id, isEditMode, navigate]);

//   const currentTotalMarks = useMemo(() => {
//     return questions.reduce((acc, q) => acc + (q.marks || 0), 0);
//   }, [questions]);

//   const addQuestion = (question) => {
//     setQuestions((prev) => [...prev, question]);
//     toast.success("Question added!", { autoClose: 1000, position: "bottom-right" });
//   };

//   // Handlers for Setup Step
//   const handleBlankStart = (type) => {
//     setPendingConfig({ mode: 'blank', data: type });
//     setShowSetupModal(true);
//   };

//   const handleTemplateSelect = (template) => {
//     setPendingConfig({ mode: 'template', data: template });
//     setShowSetupModal(true);
//   };

//   const handleFileChange = (e, key) => {
//     const file = e.target.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onload = (ev) => {
//         setSetupFiles(prev => ({ ...prev, [key]: ev.target.result }));
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const confirmSetup = () => {
//     setCustomAssets({
//       bgImage: setupFiles.bg,
//       watermark: setupFiles.watermark,
//       watermarkOpacity: setupFiles.watermarkOpacity
//     });

//     if (pendingConfig && pendingConfig.mode === 'blank') {
//       setExamType(pendingConfig.data);
//     } else if (pendingConfig && pendingConfig.mode === 'template') {
//       const template = pendingConfig.data;
//       setExamName(template.title);
//       setCourse(template.course);
//       setQuestions([...template.questions]);
//       const hasCoding = template.questions.some(q => q.type === 'coding');
//       setExamType(hasCoding ? 'coding' : 'mixed');
//     }

//     setStep('editor');
//     setShowSetupModal(false);
//   };

//   const handleEditPaper = () => {
//     setSetupFiles({
//       bg: customAssets.bgImage,
//       watermark: customAssets.watermark,
//       watermarkOpacity: customAssets.watermarkOpacity ?? 0.1
//     });
//     setShowSetupModal(true);
//   };

//   // Allow switching templates inside editor too
//   const applyTemplate = (templateId) => {
//     const template = EXAM_TEMPLATES.find(t => t.id === templateId);
//     if (template) {
//       if (questions.length > 0 && !window.confirm("This will replace your current questions. Continue?")) return;
//       setExamName(template.title);
//       setCourse(template.course);
//       setQuestions([...template.questions]);
//       const hasCoding = template.questions.some(q => q.type === 'coding');
//       setExamType(hasCoding ? 'coding' : 'mixed');
//       toast.success("Template Applied!");
//     }
//   };

//   const handleSave = () => {
//     if (!examName || !course) {
//       toast.error("Please fill in the Exam Name and Course.");
//       return;
//     }

//     if (questions.length === 0) {
//       toast.warn("Please add at least one question.");
//       return;
//     }

//     // Determine Status Transition
//     // If DRAFT -> Become PUBLISHED
//     // If already PUBLISHED -> Stay PUBLISHED
//     const newStatus = 'published';

//     const examData = {
//       id: isEditMode ? parseInt(id) : Date.now(),
//       title: examName,
//       course: course,
//       type: examType,
//       totalMarks: currentTotalMarks,
//       targetMarks: totalMarks,
//       duration: duration,
//       questions: questions,
//       settings: settings,
//       customAssets: customAssets,
//       dateCreated: isEditMode ? new Date().toISOString() : new Date().toISOString(),
//       status: newStatus
//     };

//     const existingExams = JSON.parse(localStorage.getItem("exams")) || [];
//     let updatedExams;
//     if (isEditMode) {
//       updatedExams = existingExams.map(e => e.id.toString() === id ? { ...e, ...examData, dateCreated: e.dateCreated } : e);
//     } else {
//       updatedExams = [...existingExams, examData];
//     }
//     localStorage.setItem("exams", JSON.stringify(updatedExams));

//     if (examStatus === 'DRAFT') {
//       setExamStatus('PUBLISHED');
//       toast.success("Exam Published! Questions are now locked.");
//       // Do NOT redirect, let user see the "Final" state
//     } else {
//       toast.success("Exam settings updated!");
//       // Optional: Redirect if it was already published and they just tweaked settings?
//       // Let's simply stay or provide a "back" button which updates manually.
//       // For consistency with previous behavior for 'already published' updates:
//       // navigate(`/exams/dashboard`);
//     }
//   };

//   // DYNAMIC BACKGROUND Styles based on Type
//   const getBackgroundStyle = () => {
//     if (step === 'setup') return "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)";
//     if (examType === 'coding') return "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)"; // Dark Coding Theme
//     return "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)";
//   };

//   const isDarkTheme = examType === 'coding';

//   return (
//     <div className="container-fluid min-vh-100 pt-4" style={{
//       background: getBackgroundStyle(),
//       fontFamily: "'Inter', sans-serif",
//       transition: "background 0.5s ease"
//     }}>
//       <ToastContainer />

//       {/* SETUP MODAL OVERLAY */}
//       {showSetupModal && (
//         <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{ zIndex: 2000, backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(5px)' }}>
//           <div className="card shadow-lg border-0 rounded-4 animate-scale-in" style={{ width: '500px', maxWidth: '90%' }}>
//             <div className="card-header bg-white border-0 pt-4 px-4 d-flex justify-content-between align-items-center">
//               <div>
//                 <h5 className="fw-bold mb-1 text-dark">Exam Paper Setup</h5>
//                 <p className="text-muted small mb-0">Customize the look of your exam paper.</p>
//               </div>
//               <button className="btn btn-light btn-sm rounded-circle" onClick={() => setShowSetupModal(false)}><i className="bi bi-x-lg"></i></button>
//             </div>
//             <div className="card-body px-4 py-3">
//               <div className="mb-4">
//                 <label className="form-label small fw-bold text-dark d-flex align-items-center gap-2">
//                   <i className="bi bi-image text-primary"></i> Paper Background (Optional)
//                 </label>
//                 <input type="file" className="form-control" accept="image/*" onChange={(e) => handleFileChange(e, 'bg')} />
//                 <div className="form-text small">Upload a texture or border image for the exam paper.</div>
//               </div>

//               <div className="mb-4">
//                 <label className="form-label small fw-bold text-dark d-flex align-items-center gap-2">
//                   <i className="bi bi-droplet-half text-info"></i> Watermark / Logo (Optional)
//                 </label>
//                 <input type="file" className="form-control mb-2" accept="image/*" onChange={(e) => handleFileChange(e, 'watermark')} />

//                 {setupFiles.watermark && (
//                   <div>
//                     <label className="form-label small fw-bold text-muted d-flex justify-content-between">
//                       Opacity <span>{Math.round(setupFiles.watermarkOpacity * 100)}%</span>
//                     </label>
//                     <input
//                       type="range"
//                       className="form-range"
//                       min="0"
//                       max="1"
//                       step="0.05"
//                       value={setupFiles.watermarkOpacity}
//                       onChange={(e) => setSetupFiles(prev => ({ ...prev, watermarkOpacity: parseFloat(e.target.value) }))}
//                     />
//                   </div>
//                 )}
//                 <div className="form-text small">Will be placed as a transparent overlay in the center.</div>
//               </div>

//               <div className="d-flex justify-content-end gap-2 pt-2">
//                 <button className="btn btn-light" onClick={() => setShowSetupModal(false)}>Cancel</button>
//                 <button className="btn btn-primary px-4 fw-bold shadow-sm" onClick={confirmSetup}>
//                   Continue to Editor <i className="bi bi-arrow-right ms-2"></i>
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* STUDENT PREVIEW MODAL */}
//       {showPreviewModal && (
//         <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{ zIndex: 2005, backgroundColor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(5px)' }}>
//           <div className="card shadow-lg border-0 rounded-0 h-100 w-100 overflow-hidden animate-scale-in" style={{ maxWidth: '900px', maxHeight: '95vh', borderRadius: '12px' }}>
//             {/* Preview Header */}
//             <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center py-3">
//               <div>
//                 <span className="badge bg-warning text-dark me-2">PREVIEW MODE</span>
//                 <span className="fw-bold">{examName || "Untitled Exam"}</span>
//               </div>
//               <button className="btn btn-sm btn-outline-light rounded-circle" onClick={() => setShowPreviewModal(false)}>
//                 <i className="bi bi-x-lg"></i>
//               </button>
//             </div>

//             {/* Preview Body (Simulated Exam Paper) */}
//             <div className="card-body overflow-auto p-0 bg-light">
//               <div className="min-vh-100 p-4 d-flex justify-content-center" style={{ background: '#e2e8f0' }}>
//                 <div className="bg-white shadow-sm p-5 position-relative" style={{
//                   width: '100%',
//                   maxWidth: '800px',
//                   minHeight: '800px',
//                   borderRadius: '4px',
//                   background: customAssets.bgImage ? `url(${customAssets.bgImage}) center/cover` : '#fff'
//                 }}>
//                   {/* Watermark */}
//                   {customAssets.watermark && (
//                     <div className="position-absolute top-50 start-50 translate-middle" style={{ zIndex: 0, opacity: customAssets.watermarkOpacity ?? 0.1, width: '60%', pointerEvents: 'none' }}>
//                       <img src={customAssets.watermark} alt="Watermark" className="img-fluid" />
//                     </div>
//                   )}

//                   <div className="position-relative" style={{ zIndex: 1 }}>
//                     {/* Paper Header */}
//                     <div className="text-center border-bottom pb-4 mb-5">
//                       <h2 className="fw-bold text-uppercase mb-2">{examName || "[Exam Title]"}</h2>
//                       <div className="d-flex justify-content-center gap-4 text-muted small fw-bold text-uppercase ls-1">
//                         <span>{course || "[Course Name]"}</span>
//                         <span>•</span>
//                         <span>Time: {duration} Mins</span>
//                         <span>•</span>
//                         <span>Max Marks: {totalMarks}</span>
//                       </div>
//                     </div>

//                     {/* Questions List */}
//                     {questions.length === 0 ? (
//                       <div className="text-center text-muted py-5">
//                         <i className="bi bi-file-earmark-x display-4 opacity-25"></i>
//                         <p className="mt-3">No questions to display.</p>
//                       </div>
//                     ) : (
//                       <div className="vstack gap-4">
//                         {questions.map((q, idx) => (
//                           <div key={idx} className="mb-3">
//                             <div className="d-flex gap-3">
//                               <span className="fw-bold fs-5 text-secondary">{idx + 1}.</span>
//                               <div className="flex-grow-1">
//                                 <p className="fw-bold fs-5 mb-2">{q.question}</p>

//                                 {q.image && (
//                                   <img src={q.image} alt="Reference" className="img-fluid rounded mb-3 border" style={{ maxHeight: '200px' }} />
//                                 )}

//                                 {q.type === 'quiz' && (
//                                   <div className="ps-3 border-start">
//                                     {q.options.map((opt, i) => (
//                                       <div key={i} className="form-check mb-1">
//                                         <input className="form-check-input" type="radio" disabled />
//                                         <label className="form-check-label">{opt}</label>
//                                       </div>
//                                     ))}
//                                   </div>
//                                 )}

//                                 {q.type === 'coding' && (
//                                   <div className="bg-light p-3 rounded border font-monospace small">
//                                     {q.starterCode}
//                                   </div>
//                                 )}

//                                 <div className="mt-2 text-end">
//                                   <span className="badge bg-secondary opacity-25 text-dark">[{q.marks} Marks]</span>
//                                 </div>
//                               </div>
//                             </div>
//                           </div>
//                         ))}
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {step === 'setup' ? (
//         <ExamSetupCard onStart={handleBlankStart} onTemplateSelect={handleTemplateSelect} />
//       ) : (
//         <div className="container">
//           <div className="row justify-content-center">
//             <div className="col-lg-10">

//               {/* Nav Back (Internal) */}
//               {!isEditMode && (
//                 <button onClick={() => setStep('setup')} className={`btn btn-sm mb-3 ${isDarkTheme ? 'text-light' : 'text-muted'}`}>
//                   <i className="bi bi-arrow-left me-1"></i> Back to Setup
//                 </button>
//               )}

//               {/* Main Card */}
//               <div className="card border-0 shadow-lg overflow-hidden position-relative" style={{
//                 borderRadius: "20px",
//                 background: customAssets.bgImage ? `url(${customAssets.bgImage}) center/cover no-repeat` : (isDarkTheme ? "rgba(30, 41, 59, 0.95)" : "rgba(255, 255, 255, 0.85)"),
//                 backdropFilter: "blur(20px)",
//                 border: isDarkTheme ? "1px solid rgba(255, 255, 255, 0.1)" : "1px solid rgba(255, 255, 255, 0.3)",
//                 color: isDarkTheme ? "#fff" : "inherit"
//               }}>
//                 {/* Visual Overlay for readability if BG image is present */}
//                 {customAssets.bgImage && <div className="position-absolute top-0 start-0 w-100 h-100" style={{ background: isDarkTheme ? 'rgba(0,0,0,0.7)' : 'rgba(255,255,255,0.85)', zIndex: 0 }}></div>}

//                 {/* Watermark Overlay */}
//                 {customAssets.watermark && (
//                   <div className="position-absolute top-50 start-50 translate-middle pointer-events-none" style={{ zIndex: 0, opacity: customAssets.watermarkOpacity ?? 0.1, width: '400px', pointerEvents: 'none' }}>
//                     <img src={customAssets.watermark} alt="Watermark" className="img-fluid" />
//                   </div>
//                 )}

//                 {/* Content Wrapper to ensure z-index above background/watermark */}
//                 <div className="position-relative" style={{ zIndex: 1 }}>

//                   {/* Header */}
//                   <div className="card-header bg-transparent border-0 pt-4 pb-2 px-3 px-md-5">
//                     <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
//                       <div className="text-center text-md-start">
//                         <h2 className={`fw-bold mb-1 ${isDarkTheme ? 'text-white' : ''}`} style={{ color: isDarkTheme ? '#fff' : "#2d3748" }}>{isEditMode ? "Edit Exam" : "Create New Exam"}</h2>
//                         <p className={`${isDarkTheme ? 'text-white-50' : 'text-muted'} mb-0`}>{isEditMode ? "Modify your assessment details below." : "Design a comprehensive assessment for your students."}</p>
//                       </div>
//                       <div className="d-flex align-items-center gap-2">
//                         {/* Live Opacity Slider (if watermark exists) */}
//                         {customAssets.watermark && (
//                           <div className="d-flex align-items-center bg-white rounded-pill shadow-sm px-3 py-1 me-2" style={{ border: '1px solid #e2e8f0' }}>
//                             <i className="bi bi-droplet-half text-secondary me-2"></i>
//                             <input
//                               type="range"
//                               className="form-range"
//                               style={{ width: '80px' }}
//                               min="0"
//                               max="1"
//                               step="0.05"
//                               value={customAssets.watermarkOpacity ?? 0.1}
//                               onChange={(e) => setCustomAssets(prev => ({ ...prev, watermarkOpacity: parseFloat(e.target.value) }))}
//                               title="Watermark Opacity"
//                             />
//                           </div>
//                         )}

//                         <button className="btn btn-light shadow-sm text-secondary bg-white rounded-pill border" onClick={() => setShowPreviewModal(true)} title="Preview Exam">
//                           <i className="bi bi-eye"></i>
//                         </button>

//                         <button className="btn btn-light shadow-sm text-secondary bg-white rounded-pill border" onClick={handleEditPaper} title="Paper Settings">
//                           <i className="bi bi-palette"></i>
//                         </button>

//                         {/* Template Dropdown */}
//                         <div className="dropdown">
//                           <button className={`btn dropdown-toggle rounded-pill shadow-sm ${isDarkTheme ? 'btn-outline-light' : 'btn-outline-dark'}`} type="button" data-bs-toggle="dropdown">
//                             <i className="bi bi-magic me-2"></i>Templates
//                           </button>
//                           <ul className="dropdown-menu shadow-lg border-0 rounded-4 p-2">
//                             <li><h6 className="dropdown-header text-uppercase small ls-1">Quick Start</h6></li>
//                             {EXAM_TEMPLATES.map(t => (
//                               <li key={t.id}>
//                                 <button className="dropdown-item rounded-2 py-2" onClick={() => applyTemplate(t.id)}>
//                                   <i className="bi bi-file-earmark-code me-2 text-primary"></i>{t.title}
//                                 </button>
//                               </li>
//                             ))}
//                           </ul>
//                         </div>

//                         <span className="badge rounded-pill bg-primary px-3 py-2 fs-6 shadow-sm d-flex align-items-center">
//                           <i className="bi bi-layers me-2"></i>
//                           {questions.length} Questions
//                         </span>
//                       </div>
//                     </div>
//                   </div>

//                   <div className="card-body px-3 px-md-5 pb-5">

//                     {/* Configuration Section */}
//                     <div className="p-4 rounded-4 mb-5" style={{
//                       background: isDarkTheme ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.6)",
//                       border: isDarkTheme ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(0,0,0,0.05)"
//                     }}>
//                       <h5 className={`fw-bold mb-3 text-uppercase small ls-1 ${isDarkTheme ? 'text-white-50' : 'text-secondary'}`}>Exam Details</h5>
//                       <div className="row g-3">
//                         <div className="col-md-6">
//                           <label className={`form-label fw-semibold small ${isDarkTheme ? 'text-white-50' : 'text-muted'}`}>Exam Title</label>
//                           <input
//                             className={`form-control form-control-lg border-0 shadow-sm ${isDarkTheme ? 'bg-dark text-white' : 'bg-white'}`}
//                             value={examName}
//                             onChange={(e) => setExamName(e.target.value)}
//                             placeholder="e.g. Advanced Java Finals 2024"
//                           />
//                         </div>

//                         <div className="col-md-6">
//                           <label className={`form-label fw-semibold small ${isDarkTheme ? 'text-white-50' : 'text-muted'}`}>Course / Subject</label>
//                           <input
//                             className={`form-control form-control-lg border-0 shadow-sm ${isDarkTheme ? 'bg-dark text-white' : 'bg-white'}`}
//                             value={course}
//                             onChange={(e) => setCourse(e.target.value)}
//                             placeholder="e.g. CS-301 Data Structures"
//                           />
//                         </div>
//                       </div>

//                       <div className="row g-3 mt-2">
//                         <div className="col-md-4">
//                           <label className={`form-label fw-semibold small ${isDarkTheme ? 'text-white-50' : 'text-muted'}`}>Format</label>
//                           <select
//                             className={`form-select border-0 shadow-sm ${isDarkTheme ? 'bg-dark text-white' : 'bg-white'}`}
//                             value={examType}
//                             onChange={(e) => {
//                               setExamType(e.target.value);
//                               setQuestions([]); // Optional: reset if type strictness is needed
//                             }}
//                           >
//                             <option value="mixed">Mixed</option>
//                             <option value="coding">Coding Challenge</option>
//                             <option value="quiz">Multiple Choice Only</option>
//                             <option value="short">Short Answer Only</option>
//                           </select>
//                         </div>

//                         <div className="col-md-4">
//                           <label className={`form-label fw-semibold small ${isDarkTheme ? 'text-white-50' : 'text-muted'}`}>Target Marks</label>
//                           <div className="input-group shadow-sm rounded">
//                             <input
//                               type="number"
//                               className={`form-control border-0 ${isDarkTheme ? 'bg-dark text-white' : ''}`}
//                               value={totalMarks}
//                               onChange={(e) => setTotalMarks(e.target.value)}
//                             />
//                             <span className={`input-group-text border-0 ${currentTotalMarks > parseInt(totalMarks) ? 'bg-danger text-white' : isDarkTheme ? 'bg-dark text-white-50' : 'bg-white text-muted'}`}>
//                               Current: {currentTotalMarks}
//                             </span>
//                           </div>
//                         </div>

//                         <div className="col-md-4">
//                           <label className={`form-label fw-semibold small ${isDarkTheme ? 'text-white-50' : 'text-muted'}`}>Duration (Minutes)</label>
//                           <input
//                             type="number"
//                             className={`form-control border-0 shadow-sm ${isDarkTheme ? 'bg-dark text-white' : 'bg-white'}`}
//                             value={duration}
//                             onChange={(e) => setDuration(e.target.value)}
//                           />
//                         </div>
//                       </div>
//                     </div>

//                     {/* Reattempt & Policy Settings */}
//                     <div className="rounded-4 mb-5 card border-0 shadow-sm" style={{ background: isDarkTheme ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.85)" }}>
//                       <div className="card-header bg-transparent border-bottom-0 pt-4 px-4">
//                         <h5 className={`fw-bold mb-0 text-uppercase small ls-1 ${isDarkTheme ? 'text-light' : 'text-secondary'}`}>
//                           <i className="bi bi-gear-wide-connected me-2"></i>Reattempt & Policy Settings
//                         </h5>
//                       </div>
//                       <div className="card-body px-4 pb-4">
//                         <div className="row g-4">
//                           {/* General Attempts Card */}
//                           <div className="col-md-6">
//                             <div className={`card shadow-sm border-0 h-100 ${isDarkTheme ? 'bg-dark text-white border-secondary' : 'bg-light bg-opacity-50'}`}>
//                               <div className="card-header bg-transparent border-bottom-0 pt-3 px-3">
//                                 <h6 className="fw-bold text-primary mb-0">
//                                   <i className="bi bi-arrow-repeat me-2"></i>Attempt Limits
//                                 </h6>
//                               </div>
//                               <div className="card-body px-3 pb-3">
//                                 <div className="mb-3">
//                                   <label className={`form-label fw-bold small text-uppercase ${isDarkTheme ? 'text-white-50' : 'text-muted'}`}>Maximum Attempts Allowed</label>
//                                   <select
//                                     className={`form-select border-0 shadow-sm ${isDarkTheme ? 'bg-secondary text-white' : 'bg-white'}`}
//                                     value={settings.maxAttempts}
//                                     onChange={(e) => updateSettings('maxAttempts', e.target.value)}
//                                   >
//                                     <option value="1">No Reattempts (1 Attempt Total)</option>
//                                     <option value="2">2 Attempts</option>
//                                     <option value="3">3 Attempts</option>
//                                     <option value="5">5 Attempts</option>
//                                     <option value="unlimited">Unlimited Attempts</option>
//                                   </select>
//                                 </div>

//                                 <div className="mb-0">
//                                   <label className={`form-label fw-bold small text-uppercase ${isDarkTheme ? 'text-white-50' : 'text-muted'}`}>Grading Strategy</label>
//                                   <select
//                                     className={`form-select border-0 shadow-sm ${isDarkTheme ? 'bg-secondary text-white' : 'bg-white'}`}
//                                     value={settings.gradingStrategy}
//                                     onChange={(e) => updateSettings('gradingStrategy', e.target.value)}
//                                   >
//                                     <option value="highest">Highest Score</option>
//                                     <option value="latest">Latest Score</option>
//                                     <option value="average">Average Score</option>
//                                   </select>
//                                 </div>
//                               </div>
//                             </div>
//                           </div>

//                           {/* Restrictions & Timing Card */}
//                           <div className="col-md-6">
//                             <div className={`card shadow-sm border-0 h-100 ${isDarkTheme ? 'bg-dark text-white border-secondary' : 'bg-light bg-opacity-50'}`}>
//                               <div className="card-header bg-transparent border-bottom-0 pt-3 px-3">
//                                 <h6 className="fw-bold text-danger mb-0">
//                                   <i className="bi bi-hourglass-split me-2"></i>Scaling & Restrictions
//                                 </h6>
//                               </div>
//                               <div className="card-body px-3 pb-3">
//                                 <div className="mb-3">
//                                   <label className={`form-label fw-bold small text-uppercase ${isDarkTheme ? 'text-white-50' : 'text-muted'}`}>Cooldown Period</label>
//                                   <select
//                                     className={`form-select border-0 shadow-sm ${isDarkTheme ? 'bg-secondary text-white' : 'bg-white'}`}
//                                     value={settings.cooldownPeriod}
//                                     onChange={(e) => updateSettings('cooldownPeriod', e.target.value)}
//                                   >
//                                     <option value="0">None</option>
//                                     <option value="30">30 Minutes</option>
//                                     <option value="60">1 Hour</option>
//                                     <option value="1440">24 Hours</option>
//                                   </select>
//                                 </div>
//                                 <div className="mb-0">
//                                   <label className={`form-label fw-bold small text-uppercase ${isDarkTheme ? 'text-white-50' : 'text-muted'}`}>Eligibility</label>
//                                   <select
//                                     className={`form-select border-0 shadow-sm ${isDarkTheme ? 'bg-secondary text-white' : 'bg-white'}`}
//                                     value={settings.allowReattemptCondition}
//                                     onChange={(e) => updateSettings('allowReattemptCondition', e.target.value)}
//                                   >
//                                     <option value="always">Always Allow</option>
//                                     <option value="failed_only">Only if Failed</option>
//                                   </select>
//                                 </div>
//                               </div>
//                             </div>
//                           </div>

//                         </div>
//                       </div>
//                     </div>

//                     <hr className={`my-5 opacity-10 ${isDarkTheme ? 'border-light' : 'border-secondary'}`} />

//                     <div className="row">
//                       {/* Left Column: Form */}
//                       <div className="col-lg-5">
//                         <div className="sticky-lg-top" style={{ top: "100px", zIndex: 1 }}>
//                           <h5 className={`fw-bold mb-3 ${isDarkTheme ? 'text-white' : ''}`}>Add Question</h5>

//                           {examStatus === 'DRAFT' ? (
//                             <div className="card border-0 shadow-sm overflow-hidden" style={{ borderRadius: "15px" }}>
//                               <div className="card-body p-0">
//                                 {examType === "mixed" ? (
//                                   <MixedQuestionManager onAdd={addQuestion} />
//                                 ) : (
//                                   <QuestionForm type={examType} onAdd={addQuestion} />
//                                 )}
//                               </div>
//                             </div>
//                           ) : (
//                             <div className="card border-0 shadow-sm bg-light text-center p-5 rounded-4" style={{ border: '1px dashed #cbd5e1' }}>
//                               <i className="bi bi-lock-fill display-4 text-secondary opacity-50 mb-3"></i>
//                               <h5 className="fw-bold text-secondary">Exam Locked</h5>
//                               <p className="text-muted small mb-0">Questions cannot be modified after publishing.</p>
//                             </div>
//                           )}

//                         </div>
//                       </div>

//                       {/* Right Column: Preview List */}
//                       <div className="col-lg-7">
//                         <div className="d-flex justify-content-between align-items-center mb-3">
//                           <h5 className={`fw-bold mb-0 ${isDarkTheme ? 'text-white' : ''}`}>
//                             {examStatus === 'DRAFT' ? (
//                               <span className="text-secondary"><i className="bi bi-pencil-square me-2 text-warning"></i>Draft Preview – Not Final</span>
//                             ) : (
//                               <span className="text-success"><i className="bi bi-check-circle-fill me-2"></i>Final Question Paper</span>
//                             )}
//                           </h5>
//                           {questions.length > 0 && examStatus === 'DRAFT' && (
//                             <button className="btn btn-sm btn-outline-danger" onClick={() => setQuestions([])}>
//                               Clear All
//                             </button>
//                           )}
//                         </div>

//                         {questions.length === 0 ? (
//                           <div className={`text-center py-5 border rounded-4 border-dashed ${isDarkTheme ? 'border-secondary' : ''}`} style={{ background: isDarkTheme ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.4)" }}>
//                             <i className={`bi bi-clipboard-plus display-4 opacity-25 ${isDarkTheme ? 'text-white' : 'text-muted'}`}></i>
//                             <p className={`${isDarkTheme ? 'text-white-50' : 'text-muted'} mt-3`}>No questions added yet.<br />Start building your exam on the left.</p>
//                           </div>
//                         ) : (
//                           <div className="vstack gap-3">
//                             {questions.map((q, index) => (
//                               <div key={index} className={`card border-0 shadow-sm position-relative overflow-hidden group-hover-action ${isDarkTheme ? 'bg-dark text-white border-secondary' : ''}`}>
//                                 <div className="card-body">
//                                   <div className="d-flex justify-content-between">
//                                     <span className={`badge mb-2 border ${q.type === 'coding' ? 'bg-dark text-white' : 'bg-light text-dark'}`}>{q.type.toUpperCase()}</span>
//                                     <span className="fw-bold text-primary">{q.marks} Marks</span>
//                                   </div>
//                                   <div className="d-flex flex-column flex-sm-row align-items-start gap-3">
//                                     <div className="flex-grow-1">
//                                       <h6 className={`card-title fw-bold ${isDarkTheme ? 'text-white' : 'text-dark'}`}>{q.question}</h6>
//                                     </div>
//                                     {q.image && (
//                                       <div className="flex-shrink-0">
//                                         <img src={q.image} alt="Ref" className="img-thumbnail" style={{ height: '100px', maxWidth: '150px', objectFit: 'contain' }} />
//                                       </div>
//                                     )}
//                                   </div>

//                                   {q.type === 'quiz' && (
//                                     <ul className={`list-unstyled small mb-0 ps-2 border-start border-3 ${isDarkTheme ? 'text-white-50 border-secondary' : 'text-muted border-light'}`}>
//                                       {q.options.map((opt, i) => (
//                                         <li key={i} className={i === parseInt(q.correctOption) ? "text-success fw-bold" : ""}>
//                                           {i + 1}. {opt} {i === parseInt(q.correctOption) && <i className="bi bi-check-circle-fill ms-1"></i>}
//                                         </li>
//                                       ))}
//                                     </ul>
//                                   )}

//                                   {q.type === 'coding' && (
//                                     <div className="mt-2 bg-black bg-opacity-50 rounded p-2 border border-secondary">
//                                       <div className="d-flex justify-content-between mb-1">
//                                         <span className="badge bg-secondary opacity-50">{q.language || 'Any'}</span>
//                                       </div>
//                                       <code className="text-light small" style={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace' }}>{q.starterCode || '// Code here...'}</code>
//                                     </div>
//                                   )}
//                                 </div>

//                                 {examStatus === 'DRAFT' && (
//                                   <button
//                                     className="btn btn-danger btn-sm position-absolute top-0 end-0 m-2"
//                                     onClick={() => setQuestions(questions.filter((_, i) => i !== index))}
//                                     title="Remove Question"
//                                   >
//                                     <i className="bi bi-x-lg"></i>
//                                   </button>
//                                 )}
//                               </div>
//                             ))}
//                           </div>
//                         )}

//                         <div className="mt-4 pt-3 border-top border-secondary border-opacity-25">
//                           {examStatus === 'DRAFT' ? (
//                             <button
//                               className="btn btn-dark btn-lg w-100 fw-bold shadow-lg"
//                               onClick={handleSave}
//                               style={{ background: "linear-gradient(45deg, #111 0%, #333 100%)", border: "none" }}
//                             >
//                               <i className={`bi ${isEditMode ? 'bi-check-circle' : 'bi-rocket-takeoff'} me-2`}></i>
//                               {isEditMode ? "Update Exam" : "Publish Exam"}
//                             </button>
//                           ) : (
//                             <button
//                               className="btn btn-outline-dark btn-lg w-100 fw-bold shadow-sm bg-white"
//                               onClick={() => navigate('/exams/dashboard')}
//                             >
//                               <i className="bi bi-arrow-left me-2"></i>
//                               Return to Dashboard
//                             </button>
//                           )}
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//                 {/* Closing Content Wrapper */}
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default CreateExam;
import { useState, useMemo, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import QuestionForm from "../components/QuestionForm";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { EXAM_TEMPLATES } from "./data/constants";
import MixedQuestionManager from "./components/MixedQuestionManager";
import ExamSetupCard from "./components/ExamSetupCard";

const CreateExam = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;

  // New State: Step
  const [step, setStep] = useState(isEditMode ? 'editor' : 'setup');
  const [examStatus, setExamStatus] = useState("DRAFT"); // DRAFT | PUBLISHED

  // Custom Assets State
  const [customAssets, setCustomAssets] = useState({
    bgImage: null,
    watermark: null,
    watermarkOpacity: 0.1
  });
  const [showSetupModal, setShowSetupModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [pendingConfig, setPendingConfig] = useState(null); // { mode: 'blank'|'template', data: ... }
  const [setupFiles, setSetupFiles] = useState({
    bg: null,
    watermark: null,
    watermarkOpacity: 0.1
  });

  const [examType, setExamType] = useState("mixed");
  const [questions, setQuestions] = useState([]);

  // Form State
  const [examName, setExamName] = useState("");
  const [course, setCourse] = useState("");
  const [totalMarks, setTotalMarks] = useState(100);
  const [duration, setDuration] = useState(60);

  // Advanced Settings State
  const [settings, setSettings] = useState({
    maxAttempts: "1",
    gradingStrategy: "highest",
    cooldownPeriod: "0",
    allowReattemptCondition: "always",
    randomizeQuestions: true
  });

  const updateSettings = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  // Load data if in Edit Mode
  useEffect(() => {
    if (isEditMode) {
      setStep('editor');
      const savedExams = JSON.parse(localStorage.getItem("exams") || "[]");
      const examToEdit = savedExams.find(e => e.id.toString() === id);

      if (examToEdit) {
        setExamName(examToEdit.title);
        setCourse(examToEdit.course);
        setExamType(examToEdit.type);
        setTotalMarks(examToEdit.targetMarks || 100);
        setDuration(examToEdit.duration);
        setQuestions(examToEdit.questions || []);
        if (examToEdit.settings) setSettings(examToEdit.settings);
        if (examToEdit.customAssets) {
          setCustomAssets({
            ...examToEdit.customAssets,
            watermarkOpacity: examToEdit.customAssets.watermarkOpacity ?? 0.1
          });
        }
        // Load Status
        if (examToEdit.status === 'published') {
          setExamStatus('PUBLISHED');
        } else {
          setExamStatus('DRAFT');
        }

      } else {
        toast.error("Exam not found!");
        navigate("/exams/dashboard");
      }
    }
  }, [id, isEditMode, navigate]);

  const currentTotalMarks = useMemo(() => {
    return questions.reduce((acc, q) => acc + (q.marks || 0), 0);
  }, [questions]);

  const addQuestion = (question) => {
    setQuestions((prev) => [...prev, question]);
    toast.success("Question added!", { autoClose: 1000, position: "bottom-right" });
  };

  // Handlers for Setup Step
  const handleBlankStart = (type) => {
    setPendingConfig({ mode: 'blank', data: type });
    setShowSetupModal(true);
  };

  const handleTemplateSelect = (template) => {
    setPendingConfig({ mode: 'template', data: template });
    setShowSetupModal(true);
  };

  const handleFileChange = (e, key) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setSetupFiles(prev => ({ ...prev, [key]: ev.target.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const confirmSetup = () => {
    setCustomAssets({
      bgImage: setupFiles.bg,
      watermark: setupFiles.watermark,
      watermarkOpacity: setupFiles.watermarkOpacity
    });

    if (pendingConfig && pendingConfig.mode === 'blank') {
      setExamType(pendingConfig.data);
    } else if (pendingConfig && pendingConfig.mode === 'template') {
      const template = pendingConfig.data;
      setExamName(template.title);
      setCourse(template.course);
      setQuestions([...template.questions]);
      const hasCoding = template.questions.some(q => q.type === 'coding');
      setExamType(hasCoding ? 'coding' : 'mixed');
    }

    setStep('editor');
    setShowSetupModal(false);
  };

  const handleEditPaper = () => {
    setSetupFiles({
      bg: customAssets.bgImage,
      watermark: customAssets.watermark,
      watermarkOpacity: customAssets.watermarkOpacity ?? 0.1
    });
    setShowSetupModal(true);
  };

  // Allow switching templates inside editor too
  const applyTemplate = (templateId) => {
    const template = EXAM_TEMPLATES.find(t => t.id === templateId);
    if (template) {
      if (questions.length > 0 && !window.confirm("This will replace your current questions. Continue?")) return;
      setExamName(template.title);
      setCourse(template.course);
      setQuestions([...template.questions]);
      const hasCoding = template.questions.some(q => q.type === 'coding');
      setExamType(hasCoding ? 'coding' : 'mixed');
      toast.success("Template Applied!");
    }
  };

  const handleSave = () => {
    if (!examName || !course) {
      toast.error("Please fill in the Exam Name and Course.");
      return;
    }

    if (questions.length === 0) {
      toast.warn("Please add at least one question.");
      return;
    }

    // Determine Status Transition
    // If DRAFT -> Become PUBLISHED
    // If already PUBLISHED -> Stay PUBLISHED
    const newStatus = 'published';

    const examData = {
      id: isEditMode ? parseInt(id) : Date.now(),
      title: examName,
      course: course,
      type: examType,
      totalMarks: currentTotalMarks,
      targetMarks: totalMarks,
      duration: duration,
      questions: questions,
      settings: settings,
      customAssets: customAssets,
      dateCreated: isEditMode ? new Date().toISOString() : new Date().toISOString(),
      status: newStatus
    };

    const existingExams = JSON.parse(localStorage.getItem("exams")) || [];
    let updatedExams;
    if (isEditMode) {
      updatedExams = existingExams.map(e => e.id.toString() === id ? { ...e, ...examData, dateCreated: e.dateCreated } : e);
    } else {
      updatedExams = [...existingExams, examData];
    }
    localStorage.setItem("exams", JSON.stringify(updatedExams));

    if (examStatus === 'DRAFT') {
      setExamStatus('PUBLISHED');
      toast.success("Exam Published! Questions are now locked.");
      // Do NOT redirect, let user see the "Final" state
    } else {
      toast.success("Exam settings updated!");
      // Optional: Redirect if it was already published and they just tweaked settings?
      // Let's simply stay or provide a "back" button which updates manually.
      // For consistency with previous behavior for 'already published' updates:
      // navigate(`/exams/dashboard`);
    }
  };

  // DYNAMIC BACKGROUND Styles based on Type
  const getBackgroundStyle = () => {
    if (step === 'setup') return "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)";
    if (examType === 'coding') return "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)"; // Dark Coding Theme
    return "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)";
  };

  const isDarkTheme = examType === 'coding';

  return (
    <div className="container-fluid min-vh-100 pt-4" style={{
      background: getBackgroundStyle(),
      fontFamily: "'Inter', sans-serif",
      transition: "background 0.5s ease"
    }}>
      <ToastContainer />

      {/* SETUP MODAL OVERLAY */}
      {showSetupModal && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{ zIndex: 2000, backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(5px)' }}>
          <div className="card shadow-lg border-0 rounded-4 animate-scale-in" style={{ width: '500px', maxWidth: '90%' }}>
            <div className="card-header bg-white border-0 pt-4 px-4 d-flex justify-content-between align-items-center">
              <div>
                <h5 className="fw-bold mb-1 text-dark">Exam Paper Setup</h5>
                <p className="text-muted small mb-0">Customize the look of your exam paper.</p>
              </div>
              <button className="btn btn-light btn-sm rounded-circle" onClick={() => setShowSetupModal(false)}><i className="bi bi-x-lg"></i></button>
            </div>
            <div className="card-body px-4 py-3">
              <div className="mb-4">
                <label className="form-label small fw-bold text-dark d-flex align-items-center gap-2">
                  <i className="bi bi-image text-primary"></i> Paper Background (Optional)
                </label>
                <input type="file" className="form-control" accept="image/*" onChange={(e) => handleFileChange(e, 'bg')} />
                <div className="form-text small">Upload a texture or border image for the exam paper.</div>
              </div>

              <div className="mb-4">
                <label className="form-label small fw-bold text-dark d-flex align-items-center gap-2">
                  <i className="bi bi-droplet-half text-info"></i> Watermark / Logo (Optional)
                </label>
                <input type="file" className="form-control mb-2" accept="image/*" onChange={(e) => handleFileChange(e, 'watermark')} />

                {setupFiles.watermark && (
                  <div>
                    <label className="form-label small fw-bold text-muted d-flex justify-content-between">
                      Opacity <span>{Math.round(setupFiles.watermarkOpacity * 100)}%</span>
                    </label>
                    <input
                      type="range"
                      className="form-range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={setupFiles.watermarkOpacity}
                      onChange={(e) => setSetupFiles(prev => ({ ...prev, watermarkOpacity: parseFloat(e.target.value) }))}
                    />
                  </div>
                )}
                <div className="form-text small">Will be placed as a transparent overlay in the center.</div>
              </div>

              <div className="d-flex justify-content-end gap-2 pt-2">
                <button className="btn btn-light" onClick={() => setShowSetupModal(false)}>Cancel</button>
                <button className="btn btn-primary px-4 fw-bold shadow-sm" onClick={confirmSetup}>
                  Continue to Editor <i className="bi bi-arrow-right ms-2"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STUDENT PREVIEW MODAL */}
      {showPreviewModal && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{ zIndex: 2005, backgroundColor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(5px)' }}>
          <div className="card shadow-lg border-0 rounded-0 h-100 w-100 overflow-hidden animate-scale-in" style={{ maxWidth: '900px', maxHeight: '95vh', borderRadius: '12px' }}>
            {/* Preview Header */}
            <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center py-3">
              <div>
                <span className="badge bg-warning text-dark me-2">PREVIEW MODE</span>
                <span className="fw-bold">{examName || "Untitled Exam"}</span>
              </div>
              <button className="btn btn-sm btn-outline-light rounded-circle" onClick={() => setShowPreviewModal(false)}>
                <i className="bi bi-x-lg"></i>
              </button>
            </div>

            {/* Preview Body (Simulated Exam Paper) */}
            <div className="card-body overflow-auto p-0 bg-light">
              <div className="min-vh-100 p-4 d-flex justify-content-center" style={{ background: '#e2e8f0' }}>
                <div className="bg-white shadow-sm p-5 position-relative" style={{
                  width: '100%',
                  maxWidth: '800px',
                  minHeight: '800px',
                  borderRadius: '4px',
                  background: customAssets.bgImage ? `url(${customAssets.bgImage}) center/cover` : '#fff'
                }}>
                  {/* Watermark */}
                  {customAssets.watermark && (
                    <div className="position-absolute top-50 start-50 translate-middle" style={{ zIndex: 0, opacity: customAssets.watermarkOpacity ?? 0.1, width: '60%', pointerEvents: 'none' }}>
                      <img src={customAssets.watermark} alt="Watermark" className="img-fluid" />
                    </div>
                  )}

                  <div className="position-relative" style={{ zIndex: 1 }}>
                    {/* Paper Header */}
                    <div className="text-center border-bottom pb-4 mb-5">
                      <h2 className="fw-bold text-uppercase mb-2">{examName || "[Exam Title]"}</h2>
                      <div className="d-flex justify-content-center gap-4 text-muted small fw-bold text-uppercase ls-1">
                        <span>{course || "[Course Name]"}</span>
                        <span>•</span>
                        <span>Time: {duration} Mins</span>
                        <span>•</span>
                        <span>Max Marks: {totalMarks}</span>
                      </div>
                    </div>

                    {/* Questions List */}
                    {questions.length === 0 ? (
                      <div className="text-center text-muted py-5">
                        <i className="bi bi-file-earmark-x display-4 opacity-25"></i>
                        <p className="mt-3">No questions to display.</p>
                      </div>
                    ) : (
                      <div className="vstack gap-4">
                        {questions.map((q, idx) => (
                          <div key={idx} className="mb-3">
                            <div className="d-flex gap-3">
                              <span className="fw-bold fs-5 text-secondary">{idx + 1}.</span>
                              <div className="flex-grow-1">
                                <p className="fw-bold fs-5 mb-2">{q.question}</p>

                                {q.image && (
                                  <img src={q.image} alt="Reference" className="img-fluid rounded mb-3 border" style={{ maxHeight: '200px' }} />
                                )}

                                {q.type === 'quiz' && (
                                  <div className="ps-3 border-start">
                                    {q.options.map((opt, i) => (
                                      <div key={i} className="form-check mb-1">
                                        <input className="form-check-input" type="radio" disabled />
                                        <label className="form-check-label">{opt}</label>
                                      </div>
                                    ))}
                                  </div>
                                )}

                                {q.type === 'coding' && (
                                  <div className="bg-light p-3 rounded border font-monospace small">
                                    {q.starterCode}
                                  </div>
                                )}

                                <div className="mt-2 text-end">
                                  <span className="badge bg-secondary opacity-25 text-dark">[{q.marks} Marks]</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {step === 'setup' ? (
        <ExamSetupCard onStart={handleBlankStart} onTemplateSelect={handleTemplateSelect} />
      ) : (
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-10">

              {/* Nav Back (Internal) */}
              {!isEditMode && (
                <button onClick={() => setStep('setup')} className={`btn btn-sm mb-3 ${isDarkTheme ? 'text-light' : 'text-muted'}`}>
                  <i className="bi bi-arrow-left me-1"></i> Back to Setup
                </button>
              )}

              {/* Main Card */}
              <div className="card border-0 shadow-lg overflow-hidden position-relative" style={{
                borderRadius: "20px",
                background: isDarkTheme ? "rgba(30, 41, 59, 0.95)" : "rgba(255, 255, 255, 0.85)",
                backdropFilter: "blur(20px)",
                border: isDarkTheme ? "1px solid rgba(255, 255, 255, 0.1)" : "1px solid rgba(255, 255, 255, 0.3)",
                color: isDarkTheme ? "#fff" : "inherit"
              }}>
                {/* Content Wrapper */}
                <div className="position-relative" style={{ zIndex: 1 }}>

                  {/* Header */}
                  <div className="card-header bg-transparent border-0 pt-4 pb-2 px-3 px-md-5">
                    <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
                      <div className="text-center text-md-start">
                        <h2 className={`fw-bold mb-1 ${isDarkTheme ? 'text-white' : ''}`} style={{ color: isDarkTheme ? '#fff' : "#2d3748" }}>{isEditMode ? "Edit Exam" : "Create New Exam"}</h2>
                        <p className={`${isDarkTheme ? 'text-white-50' : 'text-muted'} mb-0`}>{isEditMode ? "Modify your assessment details below." : "Design a comprehensive assessment for your students."}</p>
                      </div>
                      <div className="d-flex align-items-center gap-2">
                        {/* Live Opacity Slider (if watermark exists) */}
                        {customAssets.watermark && (
                          <div className="d-flex align-items-center bg-white rounded-pill shadow-sm px-3 py-1 me-2" style={{ border: '1px solid #e2e8f0' }}>
                            <i className="bi bi-droplet-half text-secondary me-2"></i>
                            <input
                              type="range"
                              className="form-range"
                              style={{ width: '80px' }}
                              min="0"
                              max="1"
                              step="0.05"
                              value={customAssets.watermarkOpacity ?? 0.1}
                              onChange={(e) => setCustomAssets(prev => ({ ...prev, watermarkOpacity: parseFloat(e.target.value) }))}
                              title="Watermark Opacity"
                            />
                            <span className="small ms-2 text-muted">{Math.round((customAssets.watermarkOpacity ?? 0.1) * 100)}%</span>
                          </div>
                        )}

                        <button className="btn btn-light shadow-sm text-secondary bg-white rounded-pill border" onClick={() => setShowPreviewModal(true)} title="Preview Exam">
                          <i className="bi bi-eye"></i>
                        </button>

                        <button className="btn btn-light shadow-sm text-secondary bg-white rounded-pill border" onClick={handleEditPaper} title="Paper Settings">
                          <i className="bi bi-palette"></i>
                        </button>

                        {/* Template Dropdown */}
                        <div className="dropdown">
                          <button className={`btn dropdown-toggle rounded-pill shadow-sm ${isDarkTheme ? 'btn-outline-light' : 'btn-outline-dark'}`} type="button" data-bs-toggle="dropdown">
                            <i className="bi bi-magic me-2"></i>Templates
                          </button>
                          <ul className="dropdown-menu shadow-lg border-0 rounded-4 p-2">
                            <li><h6 className="dropdown-header text-uppercase small ls-1">Quick Start</h6></li>
                            {EXAM_TEMPLATES.map(t => (
                              <li key={t.id}>
                                <button className="dropdown-item rounded-2 py-2" onClick={() => applyTemplate(t.id)}>
                                  <i className="bi bi-file-earmark-code me-2 text-primary"></i>{t.title}
                                </button>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <span className="badge rounded-pill bg-primary px-3 py-2 fs-6 shadow-sm d-flex align-items-center">
                          <i className="bi bi-layers me-2"></i>
                          {questions.length} Questions
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="card-body px-3 px-md-5 pb-5">

                    {/* Configuration Section */}
                    <div className="p-4 rounded-4 mb-5" style={{
                      background: isDarkTheme ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.6)",
                      border: isDarkTheme ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(0,0,0,0.05)"
                    }}>
                      <h5 className={`fw-bold mb-3 text-uppercase small ls-1 ${isDarkTheme ? 'text-white-50' : 'text-secondary'}`}>Exam Details</h5>
                      <div className="row g-3">
                        <div className="col-md-6">
                          <label className={`form-label fw-semibold small ${isDarkTheme ? 'text-white-50' : 'text-muted'}`}>Exam Title</label>
                          <input
                            className={`form-control form-control-lg border-0 shadow-sm ${isDarkTheme ? 'bg-dark text-white' : 'bg-white'}`}
                            value={examName}
                            onChange={(e) => setExamName(e.target.value)}
                            placeholder="e.g. Advanced Java Finals 2024"
                          />
                        </div>

                        <div className="col-md-6">
                          <label className={`form-label fw-semibold small ${isDarkTheme ? 'text-white-50' : 'text-muted'}`}>Course / Subject</label>
                          <input
                            className={`form-control form-control-lg border-0 shadow-sm ${isDarkTheme ? 'bg-dark text-white' : 'bg-white'}`}
                            value={course}
                            onChange={(e) => setCourse(e.target.value)}
                            placeholder="e.g. CS-301 Data Structures"
                          />
                        </div>
                      </div>

                      <div className="row g-3 mt-2">
                        <div className="col-md-4">
                          <label className={`form-label fw-semibold small ${isDarkTheme ? 'text-white-50' : 'text-muted'}`}>Format</label>
                          <select
                            className={`form-select border-0 shadow-sm ${isDarkTheme ? 'bg-dark text-white' : 'bg-white'}`}
                            value={examType}
                            onChange={(e) => {
                              setExamType(e.target.value);
                              setQuestions([]); // Optional: reset if type strictness is needed
                            }}
                          >
                            <option value="mixed">Mixed</option>
                            <option value="coding">Coding Challenge</option>
                            <option value="quiz">Multiple Choice Only</option>
                            <option value="short">Short Answer Only</option>
                          </select>
                        </div>

                        <div className="col-md-4">
                          <label className={`form-label fw-semibold small ${isDarkTheme ? 'text-white-50' : 'text-muted'}`}>Target Marks</label>
                          <div className="input-group shadow-sm rounded">
                            <input
                              type="number"
                              className={`form-control border-0 ${isDarkTheme ? 'bg-dark text-white' : ''}`}
                              value={totalMarks}
                              onChange={(e) => setTotalMarks(e.target.value)}
                            />
                            <span className={`input-group-text border-0 ${currentTotalMarks > parseInt(totalMarks) ? 'bg-danger text-white' : isDarkTheme ? 'bg-dark text-white-50' : 'bg-white text-muted'}`}>
                              Current: {currentTotalMarks}
                            </span>
                          </div>
                        </div>

                        <div className="col-md-4">
                          <label className={`form-label fw-semibold small ${isDarkTheme ? 'text-white-50' : 'text-muted'}`}>Duration (Minutes)</label>
                          <input
                            type="number"
                            className={`form-control border-0 shadow-sm ${isDarkTheme ? 'bg-dark text-white' : 'bg-white'}`}
                            value={duration}
                            onChange={(e) => setDuration(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Reattempt & Policy Settings */}
                    <div className="rounded-4 mb-5 card border-0 shadow-sm" style={{ background: isDarkTheme ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.85)" }}>
                      <div className="card-header bg-transparent border-bottom-0 pt-4 px-4">
                        <h5 className={`fw-bold mb-0 text-uppercase small ls-1 ${isDarkTheme ? 'text-light' : 'text-secondary'}`}>
                          <i className="bi bi-gear-wide-connected me-2"></i>Reattempt & Policy Settings
                        </h5>
                      </div>
                      <div className="card-body px-4 pb-4">
                        <div className="row g-4">
                          {/* General Attempts Card */}
                          <div className="col-md-6">
                            <div className={`card shadow-sm border-0 h-100 ${isDarkTheme ? 'bg-dark text-white border-secondary' : 'bg-light bg-opacity-50'}`}>
                              <div className="card-header bg-transparent border-bottom-0 pt-3 px-3">
                                <h6 className="fw-bold text-primary mb-0">
                                  <i className="bi bi-arrow-repeat me-2"></i>Attempt Limits
                                </h6>
                              </div>
                              <div className="card-body px-3 pb-3">
                                <div className="mb-3">
                                  <label className={`form-label fw-bold small text-uppercase ${isDarkTheme ? 'text-white-50' : 'text-muted'}`}>Maximum Attempts Allowed</label>
                                  <select
                                    className={`form-select border-0 shadow-sm ${isDarkTheme ? 'bg-secondary text-white' : 'bg-white'}`}
                                    value={settings.maxAttempts}
                                    onChange={(e) => updateSettings('maxAttempts', e.target.value)}
                                  >
                                    <option value="1">No Reattempts (1 Attempt Total)</option>
                                    <option value="2">2 Attempts</option>
                                    <option value="3">3 Attempts</option>
                                    <option value="5">5 Attempts</option>
                                    <option value="unlimited">Unlimited Attempts</option>
                                  </select>
                                </div>

                                <div className="mb-0">
                                  <label className={`form-label fw-bold small text-uppercase ${isDarkTheme ? 'text-white-50' : 'text-muted'}`}>Grading Strategy</label>
                                  <select
                                    className={`form-select border-0 shadow-sm ${isDarkTheme ? 'bg-secondary text-white' : 'bg-white'}`}
                                    value={settings.gradingStrategy}
                                    onChange={(e) => updateSettings('gradingStrategy', e.target.value)}
                                  >
                                    <option value="highest">Highest Score</option>
                                    <option value="latest">Latest Score</option>
                                    <option value="average">Average Score</option>
                                  </select>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Restrictions & Timing Card */}
                          <div className="col-md-6">
                            <div className={`card shadow-sm border-0 h-100 ${isDarkTheme ? 'bg-dark text-white border-secondary' : 'bg-light bg-opacity-50'}`}>
                              <div className="card-header bg-transparent border-bottom-0 pt-3 px-3">
                                <h6 className="fw-bold text-danger mb-0">
                                  <i className="bi bi-hourglass-split me-2"></i>Scaling & Restrictions
                                </h6>
                              </div>
                              <div className="card-body px-3 pb-3">
                                <div className="mb-3">
                                  <label className={`form-label fw-bold small text-uppercase ${isDarkTheme ? 'text-white-50' : 'text-muted'}`}>Cooldown Period</label>
                                  <select
                                    className={`form-select border-0 shadow-sm ${isDarkTheme ? 'bg-secondary text-white' : 'bg-white'}`}
                                    value={settings.cooldownPeriod}
                                    onChange={(e) => updateSettings('cooldownPeriod', e.target.value)}
                                  >
                                    <option value="0">None</option>
                                    <option value="30">30 Minutes</option>
                                    <option value="60">1 Hour</option>
                                    <option value="1440">24 Hours</option>
                                  </select>
                                </div>
                                <div className="mb-0">
                                  <label className={`form-label fw-bold small text-uppercase ${isDarkTheme ? 'text-white-50' : 'text-muted'}`}>Eligibility</label>
                                  <select
                                    className={`form-select border-0 shadow-sm ${isDarkTheme ? 'bg-secondary text-white' : 'bg-white'}`}
                                    value={settings.allowReattemptCondition}
                                    onChange={(e) => updateSettings('allowReattemptCondition', e.target.value)}
                                  >
                                    <option value="always">Always Allow</option>
                                    <option value="failed_only">Only if Failed</option>
                                  </select>
                                </div>
                              </div>
                            </div>
                          </div>

                        </div>
                      </div>
                    </div>

                    <hr className={`my-5 opacity-10 ${isDarkTheme ? 'border-light' : 'border-secondary'}`} />

                    <div className="row">
                      {/* Left Column: Form */}
                      <div className="col-lg-5">
                        <div className="sticky-lg-top" style={{ top: "100px", zIndex: 1 }}>
                          <h5 className={`fw-bold mb-3 ${isDarkTheme ? 'text-white' : ''}`}>Add Question</h5>

                          {examStatus === 'DRAFT' ? (
                            <div className="card border-0 shadow-sm overflow-hidden" style={{ borderRadius: "15px" }}>
                              <div className="card-body p-0">
                                {examType === "mixed" ? (
                                  <MixedQuestionManager onAdd={addQuestion} />
                                ) : (
                                  <QuestionForm type={examType} onAdd={addQuestion} />
                                )}
                              </div>
                            </div>
                          ) : (
                            <div className="card border-0 shadow-sm bg-light text-center p-5 rounded-4" style={{ border: '1px dashed #cbd5e1' }}>
                              <i className="bi bi-lock-fill display-4 text-secondary opacity-50 mb-3"></i>
                              <h5 className="fw-bold text-secondary">Exam Locked</h5>
                              <p className="text-muted small mb-0">Questions cannot be modified after publishing.</p>
                            </div>
                          )}

                        </div>
                      </div>

                      {/* Right Column: Preview List */}
                      <div className="col-lg-7">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <h5 className={`fw-bold mb-0 ${isDarkTheme ? 'text-white' : ''}`}>
                            {examStatus === 'DRAFT' ? (
                              <span className="text-secondary"><i className="bi bi-pencil-square me-2 text-warning"></i>Draft Preview – Not Final</span>
                            ) : (
                              <span className="text-success"><i className="bi bi-check-circle-fill me-2"></i>Final Question Paper</span>
                            )}
                          </h5>
                          {questions.length > 0 && examStatus === 'DRAFT' && (
                            <button className="btn btn-sm btn-outline-danger" onClick={() => setQuestions([])}>
                              Clear All
                            </button>
                          )}
                        </div>

                        {/* PAPER PREVIEW SECTION WITH BACKGROUND AND WATERMARK */}
                        <div className="position-relative border rounded-4 overflow-hidden mb-4"
                          style={{
                            minHeight: '400px',
                            background: customAssets.bgImage ? `url(${customAssets.bgImage}) center/cover no-repeat` : (isDarkTheme ? 'rgba(30, 41, 59, 0.3)' : '#f8fafc'),
                            borderColor: isDarkTheme ? 'rgba(255,255,255,0.1)' : '#e2e8f0'
                          }}>

                          {/* Watermark Overlay */}
                          {customAssets.watermark && (
                            <div className="position-absolute top-50 start-50 translate-middle"
                              style={{
                                zIndex: 0,
                                opacity: customAssets.watermarkOpacity ?? 0.1,
                                width: '50%',
                                pointerEvents: 'none'
                              }}>
                              <img src={customAssets.watermark} alt="Watermark" className="img-fluid" />
                            </div>
                          )}

                          {/* Paper Content */}
                          <div className="position-relative p-4" style={{ zIndex: 1, minHeight: '400px' }}>
                            {/* Paper Header */}
                            <div className="text-center mb-4 pb-3 border-bottom"
                              style={{
                                borderColor: isDarkTheme ? 'rgba(255,255,255,0.2)' : '#e2e8f0'
                              }}>
                              <h3 className={`fw-bold mb-2 ${isDarkTheme ? 'text-white' : 'text-dark'}`}>
                                {examName || "[Exam Title]"}
                              </h3>
                              <div className={`d-flex justify-content-center gap-3 small fw-semibold ${isDarkTheme ? 'text-white-50' : 'text-muted'}`}>
                                <span>{course || "[Course Name]"}</span>
                                <span>•</span>
                                <span>Time: {duration} Mins</span>
                                <span>•</span>
                                <span>Max Marks: {totalMarks}</span>
                              </div>
                            </div>

                            {/* Questions List */}
                            {questions.length === 0 ? (
                              <div className="text-center py-5">
                                <i className={`bi bi-file-earmark-plus display-4 opacity-25 ${isDarkTheme ? 'text-white' : 'text-muted'}`}></i>
                                <p className={`${isDarkTheme ? 'text-white-50' : 'text-muted'} mt-3`}>
                                  No questions added yet.<br />Start building your exam on the left.
                                </p>
                              </div>
                            ) : (
                              <div className="vstack gap-4">
                                {questions.map((q, index) => (
                                  <div key={index} className={`p-3 rounded ${isDarkTheme ? 'bg-dark bg-opacity-50' : 'bg-white'} border`}
                                    style={{
                                      borderColor: isDarkTheme ? 'rgba(255,255,255,0.1)' : '#e2e8f0'
                                    }}>
                                    <div className="d-flex justify-content-between align-items-start mb-2">
                                      <span className={`badge ${q.type === 'coding' ? 'bg-dark' : q.type === 'quiz' ? 'bg-info' : 'bg-secondary'}`}>
                                        {q.type.toUpperCase()}
                                      </span>
                                      <span className="fw-bold text-primary">{q.marks} Marks</span>
                                    </div>
                                    <div className="d-flex gap-2">
                                      <span className={`fw-bold ${isDarkTheme ? 'text-white' : 'text-dark'}`}>{index + 1}.</span>
                                      <div className="flex-grow-1">
                                        <h6 className={`fw-bold mb-2 ${isDarkTheme ? 'text-white' : 'text-dark'}`}>{q.question}</h6>

                                        {q.image && (
                                          <img src={q.image} alt="Reference" className="img-fluid rounded mb-2 border"
                                            style={{ maxHeight: '150px', maxWidth: '200px' }} />
                                        )}

                                        {q.type === 'quiz' && (
                                          <div className={`ps-3 border-start ${isDarkTheme ? 'border-white-50' : 'border-light'}`}>
                                            {q.options.map((opt, i) => (
                                              <div key={i} className="form-check mb-1">
                                                <input className="form-check-input" type="radio" disabled />
                                                <label className={`form-check-label ${isDarkTheme ? 'text-white-50' : 'text-muted'} ${i === parseInt(q.correctOption) ? 'fw-bold text-success' : ''}`}>
                                                  {opt} {i === parseInt(q.correctOption) && <i className="bi bi-check-circle-fill ms-1"></i>}
                                                </label>
                                              </div>
                                            ))}
                                          </div>
                                        )}

                                        {q.type === 'coding' && (
                                          <div className={`mt-2 p-2 rounded border ${isDarkTheme ? 'bg-black bg-opacity-75 border-secondary' : 'bg-light border'}`}>
                                            <div className="d-flex justify-content-between mb-1">
                                              <span className="badge bg-secondary">{q.language || 'Any'}</span>
                                            </div>
                                            <pre className={`mb-0 small ${isDarkTheme ? 'text-light' : ''}`}
                                              style={{ fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>
                                              {q.starterCode || '// Code here...'}
                                            </pre>
                                          </div>
                                        )}

                                        {examStatus === 'DRAFT' && (
                                          <div className="mt-2 text-end">
                                            <button
                                              className="btn btn-sm btn-outline-danger"
                                              onClick={() => setQuestions(questions.filter((_, i) => i !== index))}
                                              title="Remove Question"
                                            >
                                              <i className="bi bi-trash"></i> Remove
                                            </button>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Publish Button Section */}
                        <div className="mt-4 pt-3 border-top"
                          style={{
                            borderColor: isDarkTheme ? 'rgba(255,255,255,0.1)' : '#e2e8f0'
                          }}>
                          {examStatus === 'DRAFT' ? (
                            <button
                              className="btn btn-dark btn-lg w-100 fw-bold shadow-lg"
                              onClick={handleSave}
                              style={{
                                background: "linear-gradient(45deg, #111 0%, #333 100%)",
                                border: "none",
                                padding: "0.75rem 1.5rem"
                              }}
                            >
                              <i className={`bi ${isEditMode ? 'bi-check-circle' : 'bi-rocket-takeoff'} me-2`}></i>
                              {isEditMode ? "Update Exam" : "Publish Exam"}
                            </button>
                          ) : (
                            <div className="d-flex gap-2">
                              <button
                                className="btn btn-outline-secondary btn-lg fw-bold shadow-sm flex-grow-1"
                                onClick={() => navigate('/exams/dashboard')}
                              >
                                <i className="bi bi-arrow-left me-2"></i>
                                Return to Dashboard
                              </button>
                              <button
                                className="btn btn-outline-primary btn-lg fw-bold shadow-sm"
                                onClick={() => setShowPreviewModal(true)}
                              >
                                <i className="bi bi-eye me-2"></i>
                                Full Preview
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Closing Content Wrapper */}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateExam;