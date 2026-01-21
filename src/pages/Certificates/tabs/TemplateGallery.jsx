import React, { useState } from 'react';
import { FaPlus, FaTimes, FaUpload } from 'react-icons/fa';
import CertificateRenderer from '../components/CertificateRenderer';

const TemplateGallery = ({
    templates,
    setIsEditorOpen,
    setEditingTemplate
}) => {
    const [isSetupOpen, setIsSetupOpen] = useState(false);
    const [setupData, setSetupData] = useState({
        name: "New Certificate",
        bgImage: "",
        watermark: ""
    });

    const handleStartCreate = () => {
        setSetupData({
            name: "New Certificate",
            bgImage: "",
            watermark: ""
        });
        setIsSetupOpen(true);
    };

    const handleFileChange = (e, key) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (ev) => {
                setSetupData(prev => ({ ...prev, [key]: ev.target.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleConfirmCreate = () => {
        const baseElements = [
            { id: "e1", type: "text", x: 100, y: 60, w: 800, h: 50, content: "CERTIFICATE OF COMPLETION", style: { fontSize: "40px", fontWeight: "bold", textAlign: "center", color: "#1e293b" } },
            { id: "e2", type: "text", x: 100, y: 140, w: 800, h: 30, content: "This is to certify that", style: { fontSize: "18px", textAlign: "center", color: "#64748b" } },
            { id: "e3", type: "text", x: 100, y: 190, w: 800, h: 60, content: "{{recipientName}}", style: { fontSize: "48px", fontWeight: "bold", textAlign: "center", color: "#d97706", fontFamily: "'Playfair Display', serif" } },
            { id: "e4", type: "text", x: 150, y: 280, w: 700, h: 50, content: "has successfully completed the course requirements for {{courseName}}.", style: { fontSize: "18px", textAlign: "center", lineHeight: "1.5" } },

            // Footer elements
            { id: "e_date", type: "text", x: 100, y: 520, w: 250, h: 40, content: "Date of Issue: {{date}}", style: { fontSize: "14px", textAlign: "left", fontWeight: "bold" } },
            { id: "e_sig_img", type: "image", x: 650, y: 480, w: 200, h: 60, src: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Signature_sample.svg/1200px-Signature_sample.svg.png", style: { opacity: 1 } },
            { id: "e_sig_text", type: "text", x: 650, y: 550, w: 200, h: 30, content: "Program Director", style: { fontSize: "16px", fontWeight: "bold", textAlign: "center", borderTop: "2px solid #333" } },
            { id: "e_verify", type: "text", x: 300, y: 620, w: 400, h: 30, content: "Verify at: example.com/verify/{{certificateId}}", style: { fontSize: "10px", textAlign: "center", color: "#94a3b8" } }
        ];

        // Add Watermark if present selection
        let finalElements = [...baseElements];
        if (setupData.watermark) {
            finalElements.unshift({ // Add to beginning (bottom layer)
                id: "watermark_init",
                type: "image",
                x: 250, y: 100, w: 500, h: 500,
                src: setupData.watermark,
                style: { opacity: 0.1 }
            });
        }

        setEditingTemplate({
            name: setupData.name,
            page: { type: "A4", orientation: "landscape" },
            theme: {
                backgroundImage: setupData.bgImage,
                fontFamily: "'Inter', sans-serif",
                textColor: "#1F2937"
            },
            elements: finalElements
        });
        setIsSetupOpen(false);
        setIsEditorOpen(true);
    };

    return (
        <>
            <div className="row g-4 animate-fade-in">
                <div className="col-12 text-end">
                    <button className="btn btn-dark" onClick={handleStartCreate}>
                        <FaPlus /> Create New Design
                    </button>
                </div>
                {templates.map(t => (
                    <div className="col-md-4" key={t.id}>
                        <div className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden group-hover-shadow transition-all">
                            <div className="card-body p-0 position-relative">
                                <div style={{ transform: 'scale(0.5)', transformOrigin: 'top left', width: '200%', height: '240px', overflow: 'hidden', pointerEvents: 'none' }}>
                                    <CertificateRenderer template={t} data={{ recipientName: "John Doe", courseName: "Course Title" }} scale={0.5} />
                                </div>
                                <div className="position-absolute bottom-0 start-0 w-100 p-3 bg-white bg-opacity-90 backdrop-blur d-flex justify-content-between align-items-center border-top">
                                    <div><h6 className="fw-bold mb-0">{t.name}</h6><small className="text-muted">{t.page?.orientation}</small></div>
                                    <button className="btn btn-sm btn-outline-primary" onClick={() => { setEditingTemplate(t); setIsEditorOpen(true); }}>Edit</button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Simple Modal Overlay */}
            {isSetupOpen && (
                <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{ zIndex: 1050, backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(3px)' }}>
                    <div className="card shadow border-0 rounded-4 animate-scale-in" style={{ width: '450px', maxWidth: '90%' }}>
                        <div className="card-header bg-white border-0 pt-4 px-4 d-flex justify-content-between align-items-center">
                            <h5 className="fw-bold mb-0 text-dark">Start New Design</h5>
                            <button className="btn btn-light btn-sm rounded-circle" onClick={() => setIsSetupOpen(false)}><FaTimes /></button>
                        </div>
                        <div className="card-body px-4 py-3">
                            <div className="mb-3">
                                <label className="form-label small fw-bold">Template Name</label>
                                <input className="form-control" value={setupData.name} onChange={e => setSetupData({ ...setupData, name: e.target.value })} />
                            </div>

                            <div className="mb-3">
                                <label className="form-label small fw-bold text-muted d-flex align-items-center gap-2">
                                    <FaUpload size={12} /> Background Image (Optional)
                                </label>
                                <input type="file" className="form-control form-control-sm" accept="image/*" onChange={(e) => handleFileChange(e, 'bgImage')} />
                                <div className="form-text small">Upload a blank certificate background or pattern.</div>
                            </div>

                            <div className="mb-4">
                                <label className="form-label small fw-bold text-muted d-flex align-items-center gap-2">
                                    <FaUpload size={12} /> Watermark / Logo (Optional)
                                </label>
                                <input type="file" className="form-control form-control-sm" accept="image/*" onChange={(e) => handleFileChange(e, 'watermark')} />
                                <div className="form-text small">This will be added as a transparent center overlay.</div>
                            </div>

                            <div className="d-flex justify-content-end gap-2">
                                <button className="btn btn-light" onClick={() => setIsSetupOpen(false)}>Cancel</button>
                                <button className="btn btn-primary px-4 fw-bold" onClick={handleConfirmCreate}>Create Template</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default TemplateGallery;
