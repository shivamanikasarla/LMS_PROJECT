

import React, { useState } from 'react';
import { FaMagic, FaPlus, FaImage, FaFont, FaTrash, FaCheck, FaRibbon, FaStamp, FaSignature, FaTint, FaLayerGroup, FaArrowUp, FaArrowDown } from 'react-icons/fa';
import CertificateRenderer from '../components/CertificateRenderer';

const DesignStudio = ({
    editingTemplate,
    setEditingTemplate,
    handleTemplateSave,
    setIsEditorOpen,
    settings
}) => {
    const [selectedId, setSelectedId] = useState(null);

    const updateTheme = (key, val) => {
        setEditingTemplate(prev => ({
            ...prev,
            theme: { ...prev.theme, [key]: val }
        }));
    };

    const addElement = (type) => {
        let newEl = {
            id: Date.now().toString(),
            type: 'text', // default
            x: 50, y: 50, w: 200, h: 50,
            content: "",
            src: "",
            style: {
                fontSize: "20px",
                color: "#000",
                textAlign: "left",
                fontWeight: "normal",
                opacity: 1
            }
        };

        if (type === 'text') {
            newEl = { ...newEl, type: 'text', w: 400, content: "New Text" };
        } else if (type === 'image') {
            newEl = { ...newEl, type: 'image', w: 200, h: 200, src: "https://via.placeholder.com/150" };
        } else if (type === 'ribbon') {
            newEl = { ...newEl, type: 'image', w: 100, h: 100, src: "https://cdn-icons-png.flaticon.com/512/5980/5980315.png", x: 800, y: 50 }; // Ribbon placeholder
        } else if (type === 'stamp') {
            const stampSrc = settings?.sealImage || "https://cdn-icons-png.flaticon.com/512/1152/1152750.png";
            newEl = { ...newEl, type: 'image', w: 120, h: 120, src: stampSrc, x: 800, y: 500 }; // Stamp placeholder
        } else if (type === 'signature') {
            const sigSrc = settings?.directorSignature || "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Signature_sample.svg/1200px-Signature_sample.svg.png";
            newEl = { ...newEl, type: 'image', w: 200, h: 80, src: sigSrc, x: 600, y: 550 };
        } else if (type === 'watermark') {
            const logoSrc = settings?.logo || "https://via.placeholder.com/500?text=LOGO";
            newEl = { ...newEl, type: 'image', w: 500, h: 500, src: logoSrc, x: 250, y: 100, style: { ...newEl.style, opacity: 0.1 } };
        }

        setEditingTemplate(prev => ({
            ...prev,
            elements: [...prev.elements, newEl]
        }));
        setSelectedId(newEl.id);
    };

    const updateElement = (id, key, val) => {
        setEditingTemplate(prev => ({
            ...prev,
            elements: prev.elements.map(el => el.id === id ? { ...el, [key]: val } : el)
        }));
    };

    const updateStyle = (id, key, val) => {
        setEditingTemplate(prev => ({
            ...prev,
            elements: prev.elements.map(el =>
                el.id === id ? { ...el, style: { ...el.style, [key]: val } } : el
            )
        }));
    };

    const removeElement = (id) => {
        setEditingTemplate(prev => ({
            ...prev,
            elements: prev.elements.filter(el => el.id !== id)
        }));
        if (selectedId === id) setSelectedId(null);
    };

    const reorderElement = (direction) => {
        if (!selectedId) return;
        setEditingTemplate(prev => {
            const idx = prev.elements.findIndex(el => el.id === selectedId);
            if (idx === -1) return prev;
            const newElements = [...prev.elements];
            if (direction === 'up' && idx < newElements.length - 1) {
                [newElements[idx], newElements[idx + 1]] = [newElements[idx + 1], newElements[idx]];
            } else if (direction === 'down' && idx > 0) {
                [newElements[idx], newElements[idx - 1]] = [newElements[idx - 1], newElements[idx]];
            }
            return { ...prev, elements: newElements };
        });
    };

    const selectedEl = editingTemplate.elements.find(e => e.id === selectedId);

    const handleBgUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (ev) => updateTheme('backgroundImage', ev.target.result);
            reader.readAsDataURL(file);
        }
    };

    // For handling image element uploads
    const handleImageElUpload = (e, id) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (ev) => updateElement(id, 'src', ev.target.result);
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="row g-3 h-100 animate-fade-in">
            {/* LEFT PANEL: SETTINGS & TOOLS */}
            <div className="col-lg-3 d-flex flex-column gap-3">

                {/* 1. Global Tools */}
                <div className="card shadow-sm border-0 rounded-4 bg-white">
                    <div className="card-body p-3">
                        <h6 className="fw-bold mb-3 small text-uppercase text-muted">Canvas Settings</h6>

                        <div className="mb-3">
                            <label className="form-label small fw-bold mb-1">Template Name</label>
                            <input className="form-control form-control-sm" value={editingTemplate.name} onChange={e => setEditingTemplate({ ...editingTemplate, name: e.target.value })} placeholder="My Template" />
                        </div>

                        <div className="mb-3">
                            <label className="form-label small fw-bold mb-1">Background Image</label>
                            <input type="file" className="form-control form-control-sm" accept="image/*" onChange={handleBgUpload} />
                        </div>

                        <div>
                            <label className="form-label small fw-bold mb-1">Base Font</label>
                            <select className="form-select form-select-sm" value={editingTemplate.theme.fontFamily} onChange={e => updateTheme('fontFamily', e.target.value)}>
                                <option value="'Inter', sans-serif">Inter</option>
                                <option value="'Playfair Display', serif">Playfair Display</option>
                                <option value="'Roboto', sans-serif">Roboto</option>
                                <option value="'Orbitron', sans-serif">Orbitron</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* 2. Layers / Add Elements */}
                <div className="card shadow-sm border-0 rounded-4 bg-white flex-grow-1 overflow-hidden">
                    <div className="card-header bg-white border-0 pt-3 pb-2">
                        <h6 className="fw-bold mb-0 small text-uppercase text-muted">Add Components</h6>
                    </div>
                    <div className="card-body p-3 d-flex flex-column">
                        <div className="d-flex gap-2 mb-2">
                            <button className="btn btn-sm btn-light border flex-fill fw-medium" onClick={() => addElement('text')}><FaFont className="me-1 text-primary" /> Text</button>
                            <button className="btn btn-sm btn-light border flex-fill fw-medium" onClick={() => addElement('image')}><FaImage className="me-1 text-success" /> Image</button>
                        </div>
                        <div className="d-flex gap-2 mb-3">
                            <button className="btn btn-sm btn-light border flex-fill fw-medium" title="Add Seal/Stamp" onClick={() => addElement('stamp')}><FaStamp className="me-1 text-danger" /> Stamp</button>
                            <button className="btn btn-sm btn-light border flex-fill fw-medium" title="Add Ribbon" onClick={() => addElement('ribbon')}><FaRibbon className="me-1 text-warning" /> Ribbon</button>
                        </div>
                        <div className="d-flex gap-2 mb-3">
                            <button className="btn btn-sm btn-light border flex-fill fw-medium" title="Add Signature" onClick={() => addElement('signature')}><FaSignature className="me-1 text-dark" /> Sign</button>
                            <button className="btn btn-sm btn-light border flex-fill fw-medium" title="Add Watermark" onClick={() => addElement('watermark')}><FaTint className="me-1 text-info" /> Watermark</button>
                        </div>

                        <h6 className="fw-bold mb-2 small text-uppercase text-muted mt-2">Layers</h6>
                        <div className="vstack gap-2 overflow-auto custom-scrollbar" style={{ maxHeight: '100%' }}>
                            {editingTemplate.elements.slice().reverse().map((el, index) => {
                                const realIndex = editingTemplate.elements.length - 1 - index;
                                return (
                                    <div
                                        key={el.id}
                                        className={`p-2 rounded border d-flex justify-content-between align-items-center cursor-pointer transition ${selectedId === el.id ? 'bg-primary bg-opacity-10 border-primary' : 'bg-light hover-bg-light-dark'}`}
                                        onClick={() => setSelectedId(el.id)}
                                    >
                                        <div className="d-flex align-items-center gap-2 overflow-hidden">
                                            <small className="text-muted fw-bold">{realIndex + 1}.</small>
                                            <small className="text-truncate fw-medium" style={{ maxWidth: '120px' }}>
                                                {el.type === 'text' ? (el.content || "Text Block") : "Image / Asset"}
                                            </small>
                                        </div>
                                        <button className="btn btn-link text-danger p-0" title="Delete Layer" onClick={(e) => { e.stopPropagation(); removeElement(el.id); }}><FaTrash size={12} /></button>
                                    </div>
                                )
                            })}
                            {editingTemplate.elements.length === 0 && (
                                <p className="text-center text-muted small mt-4">No layers added.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* CENTER PANEL: WORKSPACE */}
            <div className="col-lg-6">
                <div className="card shadow-sm border-0 p-3 h-100 bg-light d-flex align-items-center justify-content-center overflow-hidden position-relative workspace-bg">
                    {/* Workspace Grid Background Pattern */}
                    <div className="position-absolute w-100 h-100" style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '20px 20px', opacity: 0.5, pointerEvents: 'none' }}></div>

                    <div style={{ width: '100%', maxWidth: '100%', position: 'relative', zIndex: 1, boxShadow: '0 0 20px rgba(0,0,0,0.05)' }}>
                        <CertificateRenderer
                            template={editingTemplate}
                            data={{ recipientName: "John Doe", courseName: "React Mastery", date: "2025-12-25" }}
                            isDesigning={true}
                            onUpdateTemplate={setEditingTemplate}
                            onSelectElement={setSelectedId}
                            selectedId={selectedId}
                        />
                    </div>
                </div>
            </div>

            {/* RIGHT PANEL: INSPECTOR */}
            <div className="col-lg-3">
                {selectedEl ? (
                    <div className="card shadow-sm border-0 rounded-4 bg-white h-100 animate-slide-in-right">
                        <div className="card-header bg-white border-bottom pt-3 pb-2 d-flex justify-content-between align-items-center">
                            <h6 className="fw-bold mb-0 small text-uppercase text-primary">Properties</h6>
                            <div className="btn-group">
                                <button className="btn btn-xs btn-outline-secondary" title="Bring Forward" onClick={() => reorderElement('up')}><FaArrowUp size={12} /></button>
                                <button className="btn btn-xs btn-outline-secondary" title="Send Backward" onClick={() => reorderElement('down')}><FaArrowDown size={12} /></button>
                            </div>
                        </div>
                        <div className="card-body p-3">
                            {selectedEl.type === 'text' && (
                                <>
                                    <div className="mb-3">
                                        <label className="form-label small fw-bold mb-1">Text Content</label>
                                        <textarea
                                            className="form-control form-control-sm"
                                            rows="3"
                                            value={selectedEl.content}
                                            onChange={e => updateElement(selectedEl.id, 'content', e.target.value)}
                                            placeholder="Enter text..."
                                        ></textarea>
                                        <div className="d-flex gap-1 mt-1 flex-wrap">
                                            <span className="badge bg-light text-dark border cursor-pointer" onClick={() => updateElement(selectedEl.id, 'content', selectedEl.content + ' {{recipientName}}')}>+Name</span>
                                            <span className="badge bg-light text-dark border cursor-pointer" onClick={() => updateElement(selectedEl.id, 'content', selectedEl.content + ' {{courseName}}')}>+Course</span>
                                            <span className="badge bg-light text-dark border cursor-pointer" onClick={() => updateElement(selectedEl.id, 'content', selectedEl.content + ' {{date}}')}>+Date</span>
                                        </div>
                                    </div>

                                    <div className="row g-2 mb-3">
                                        <div className="col-6">
                                            <label className="form-label small fw-bold mb-1">Font Size</label>
                                            <div className="input-group input-group-sm">
                                                <input type="number" className="form-control" value={parseInt(selectedEl.style.fontSize) || 16} onChange={e => updateStyle(selectedEl.id, 'fontSize', `${e.target.value}px`)} />
                                                <span className="input-group-text">px</span>
                                            </div>
                                        </div>
                                        <div className="col-6">
                                            <label className="form-label small fw-bold mb-1">Color</label>
                                            <input type="color" className="form-control form-control-color w-100" value={selectedEl.style.color || '#000000'} onChange={e => updateStyle(selectedEl.id, 'color', e.target.value)} />
                                        </div>
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label small fw-bold mb-1">Alignment & Style</label>
                                        <div className="btn-group w-100" role="group">
                                            <button className={`btn btn-sm border ${selectedEl.style.textAlign === 'left' ? 'btn-light active' : 'btn-white'}`} onClick={() => updateStyle(selectedEl.id, 'textAlign', 'left')}>L</button>
                                            <button className={`btn btn-sm border ${selectedEl.style.textAlign === 'center' ? 'btn-light active' : 'btn-white'}`} onClick={() => updateStyle(selectedEl.id, 'textAlign', 'center')}>C</button>
                                            <button className={`btn btn-sm border ${selectedEl.style.textAlign === 'right' ? 'btn-light active' : 'btn-white'}`} onClick={() => updateStyle(selectedEl.id, 'textAlign', 'right')}>R</button>
                                            <button className={`btn btn-sm border ${selectedEl.style.fontWeight === 'bold' ? 'btn-dark text-white' : 'btn-white'}`} onClick={() => updateStyle(selectedEl.id, 'fontWeight', selectedEl.style.fontWeight === 'bold' ? 'normal' : 'bold')}><Fa1 className="opacity-0" />B</button>
                                        </div>
                                    </div>
                                </>
                            )}

                            {selectedEl.type === 'image' && (
                                <div className="mb-3">
                                    <label className="form-label small fw-bold mb-1">Image / Asset Source</label>
                                    <input type="file" className="form-control form-control-sm mb-2" accept="image/*" onChange={(e) => handleImageElUpload(e, selectedEl.id)} />
                                    <div className="border rounded p-2 bg-light text-center position-relative">
                                        <img src={selectedEl.src} alt="preview" className="img-fluid" style={{ maxHeight: '120px', opacity: selectedEl.style?.opacity || 1 }} />
                                    </div>
                                    <div className="mt-2">
                                        <label className="form-label small fw-bold mb-1 d-flex justify-content-between">Opacity <span>{Math.round((selectedEl.style?.opacity || 1) * 100)}%</span></label>
                                        <input type="range" className="form-range" min="0" max="1" step="0.05" value={selectedEl.style?.opacity !== undefined ? selectedEl.style.opacity : 1} onChange={e => updateStyle(selectedEl.id, 'opacity', parseFloat(e.target.value))} />
                                    </div>
                                </div>
                            )}

                            <hr className="my-3" />

                            <div className="row g-2">
                                <label className="form-label small fw-bold mb-0 col-12">Dimensions</label>
                                <div className="col-6">
                                    <div className="input-group input-group-sm">
                                        <span className="input-group-text">W</span>
                                        <input type="number" className="form-control" value={Math.round(selectedEl.w)} onChange={e => updateElement(selectedEl.id, 'w', parseInt(e.target.value))} />
                                    </div>
                                </div>
                                <div className="col-6">
                                    <div className="input-group input-group-sm">
                                        <span className="input-group-text">H</span>
                                        <input type="number" className="form-control" value={Math.round(selectedEl.h)} onChange={e => updateElement(selectedEl.id, 'h', parseInt(e.target.value))} />
                                    </div>
                                </div>
                                <div className="col-6">
                                    <div className="input-group input-group-sm">
                                        <span className="input-group-text">X</span>
                                        <input type="number" className="form-control" value={Math.round(selectedEl.x)} onChange={e => updateElement(selectedEl.id, 'x', parseInt(e.target.value))} />
                                    </div>
                                </div>
                                <div className="col-6">
                                    <div className="input-group input-group-sm">
                                        <span className="input-group-text">Y</span>
                                        <input type="number" className="form-control" value={Math.round(selectedEl.y)} onChange={e => updateElement(selectedEl.id, 'y', parseInt(e.target.value))} />
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                ) : (
                    <div className="card shadow-sm border-0 rounded-4 bg-white h-100 d-flex align-items-center justify-content-center text-center p-4 text-muted">
                        <div>
                            <FaMagic size={24} className="mb-2 opacity-50" />
                            <p className="small mb-0">Select an element to<br />customize properties.</p>
                        </div>
                    </div>
                )}
            </div>

            {/* ACTION FOOTER */}
            <div className="col-12 mt-0">
                <div className="card border-0 bg-white shadow-sm p-3 rounded-4 d-flex flex-row justify-content-end gap-2">
                    <button className="btn btn-secondary px-4" onClick={() => setIsEditorOpen(false)}>Discard</button>
                    <button className="btn btn-success px-4 fw-bold" onClick={handleTemplateSave}><FaCheck className="me-2" /> Save Template</button>
                </div>
            </div>
        </div>
    );
};

// Helper for "B" icon replacement to avoid extra import
const Fa1 = () => <span></span>;

export default DesignStudio;
