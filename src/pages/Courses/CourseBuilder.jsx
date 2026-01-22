import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCourseBuilder } from './hooks/useCourseBuilder';

import {
    FiArrowLeft,
    FiPlusCircle,
    FiTrash2,
    FiMoreVertical, // Restored
    FiEdit2, // Restored
    FiVideo,
    FiFileText,
    FiLayout
} from 'react-icons/fi';

import ChapterList from './builder/ChapterList';
import UnifiedContentForm from './builder/content/UnifiedContentForm';

import './styles/CourseBuilder.css';

const CourseBuilder = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const {
        courseData,
        activeChapterId,
        addChapter,
        updateChapterTitle,
        deleteChapter,
        selectChapter,
        addContent,
        deleteContent,
        updateContent,
        moveChapter,
        moveContent
    } = useCourseBuilder(id);

    const [activeForm, setActiveForm] = useState(null); // 'content'
    const [expandedItemId, setExpandedItemId] = useState(null);
    const [contentMenuOpenId, setContentMenuOpenId] = useState(null);
    const [editingItem, setEditingItem] = useState(null);
    const [selectedContentId, setSelectedContentId] = useState(null);
    const [insertionPoint, setInsertionPoint] = useState(null); // { chapterId, afterId }

    const activeChapter = courseData.chapters.find(c => c.id === activeChapterId);

    const groupedContents = useMemo(() => {
        if (!activeChapter) return [];

        // Always show all content, don't filter by selectedContentId
        const contentsToProcess = activeChapter.contents;

        const groups = [];
        let current = { heading: null, items: [] };

        contentsToProcess.forEach(item => {
            if (item.type === 'heading') {
                if (current.heading || current.items.length) groups.push(current);
                current = { heading: item, items: [] };
            } else {
                current.items.push(item);
            }
        });

        groups.push(current);
        return groups;
    }, [activeChapter]);

    const handleSave = (data) => {
        // If coming from UnifiedForm, data.type is explicit.
        // Fallback to activeForm if needed (though it's just 'content' now)
        const contentType = data.type || 'video'; // Default fallback

        if (editingItem) {
            updateContent(activeChapterId, editingItem.id, data);
            setEditingItem(null);
        } else {
            // Check if we have a specific insertion point
            const targetChapterId = insertionPoint?.chapterId || activeChapterId;
            const insertAfterId = insertionPoint?.afterId || null;

            addContent(targetChapterId, contentType, data, insertAfterId);
        }
        setActiveForm(null);
        setSelectedContentId(null);
        setInsertionPoint(null); // Reset
    };

    const handleContentClick = (chapterId, item) => {
        if (activeChapterId !== chapterId) {
            selectChapter(chapterId);
        }
        setSelectedContentId(item.id);
        setEditingItem(null);
        setActiveForm(null);
    };

    const handleContentEdit = (chapterId, item) => {
        if (activeChapterId !== chapterId) {
            selectChapter(chapterId);
        }
        setEditingItem(item);
        setActiveForm('content'); // Logic handles type via editingItem.type
        setSelectedContentId(null);
    };

    const handleContentDelete = (chapterId, itemId) => {
        if (window.confirm("Are you sure you want to delete this item?")) {
            deleteContent(chapterId, itemId);
            if (selectedContentId === itemId) setSelectedContentId(null);
            if (editingItem?.id === itemId) setEditingItem(null);
        }
    };

    const handleQuickAdd = (chapterId, type) => {
        if (activeChapterId !== chapterId) {
            selectChapter(chapterId);
        }
        // Unified form handles type selection internally, but we could pass it if we wanted pre-selection.
        // For now, simple open 'content' form.
        setActiveForm('content');
        setEditingItem(null);
        setSelectedContentId(null);
    };

    const handleSidebarAddItem = (chapterId, afterId = null) => {
        if (activeChapterId !== chapterId) {
            selectChapter(chapterId);
        }
        setInsertionPoint({ chapterId, afterId });
        setActiveForm('content'); // Open unified form directly
    };

    const handleChapterMainSelect = (chapterId) => {
        selectChapter(chapterId);
        setSelectedContentId(null);
    };

    const displayedContents = useMemo(() => {
        if (!selectedContentId) return groupedContents;

        const result = [];
        for (const group of groupedContents) {
            // Check if heading matches
            if (group.heading?.id === selectedContentId) {
                result.push({ heading: group.heading, items: [] });
            }
            // Check items
            const itemMatch = group.items.find(i => i.id === selectedContentId);
            if (itemMatch) {
                result.push({ heading: null, items: [itemMatch] });
            }
        }
        return result;
    }, [groupedContents, selectedContentId]);

    return (
        <div className="course-builder-layout">
            {/* HEADER */}
            <header className="cb-header">
                <div className="cb-header-left">
                    <button className="btn-icon" onClick={() => navigate('/courses')}>
                        <FiArrowLeft />
                    </button>
                    <div className="cb-title">
                        <h2>{courseData.title}</h2>
                    </div>
                </div>
                <div className="cb-header-actions">
                    {/* Placeholder buttons removed */}
                </div>
            </header>

            <div className="cb-workspace">
                {/* SIDEBAR */}
                <aside className="cb-sidebar">
                    <ChapterList
                        chapters={courseData.chapters}
                        activeChapterId={activeChapterId}
                        activeContentId={editingItem?.id || selectedContentId}
                        onSelect={handleChapterMainSelect}
                        onSelectContent={handleContentClick}
                        onEditContent={handleContentEdit}
                        onDeleteContent={handleContentDelete}
                        onAddItem={handleSidebarAddItem}
                        onQuickAdd={handleQuickAdd}
                        onAddChapter={addChapter}
                        onUpdateTitle={updateChapterTitle}
                        onDelete={deleteChapter}
                        onMoveChapter={moveChapter}
                        onMoveContent={moveContent}
                    />
                </aside>

                {/* MAIN */}
                <main className="cb-main">
                    {!activeChapter ? (
                        <div className="no-chapter-selected">
                            <h3>No chapter selected</h3>
                            <button className="btn-primary" onClick={addChapter}>
                                Create Chapter
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className="chapter-header">
                                <h1>{activeChapter.title}</h1>
                                <button
                                    className="btn-primary"
                                    onClick={() => setActiveForm('content')}
                                >
                                    <FiPlusCircle /> Add Item
                                </button>
                            </div>

                            {/* CONTENT LIST */}
                            <div className="content-list-container bg-white rounded shadow-sm border mt-4">
                                {displayedContents.map((group, i) => (
                                    <React.Fragment key={i}>
                                        {group.heading && (
                                            <div className="content-section-header p-3 bg-light border-bottom d-flex justify-content-between align-items-center">
                                                <div>
                                                    <h5 className="mb-0 fw-bold text-dark">{group.heading.title}</h5>
                                                    {group.heading.data?.subtext && (
                                                        <small className="text-muted">{group.heading.data.subtext}</small>
                                                    )}
                                                </div>
                                                <div className="position-relative">
                                                    <button
                                                        className="btn btn-sm btn-link text-muted p-0"
                                                        onClick={() => setContentMenuOpenId(contentMenuOpenId === group.heading.id ? null : group.heading.id)}
                                                    >
                                                        <FiMoreVertical />
                                                    </button>
                                                    {contentMenuOpenId === group.heading.id && (
                                                        <div className="chapter-menu-dropdown" style={{ right: 0, top: '100%' }}>
                                                            <button onClick={() => { setEditingItem(group.heading); setActiveForm('heading'); setContentMenuOpenId(null); }}>
                                                                <FiEdit2 /> Edit
                                                            </button>
                                                            <button className="danger" onClick={() => deleteContent(activeChapterId, group.heading.id)}>
                                                                <FiTrash2 /> Remove
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        {group.items.map(item => (
                                            <div key={item.id} className="content-row-item p-3 border-bottom hover-bg-light transition-all">
                                                <div className="d-flex align-items-center justify-content-between mb-2">
                                                    <div className="d-flex align-items-center gap-3">
                                                        <div className={`p-2 rounded ${item.type === 'video' ? 'bg-primary bg-opacity-10 text-primary' : 'bg-warning bg-opacity-10 text-warning'}`}>
                                                            {item.type === 'video' ? <FiVideo size={20} /> : <FiFileText size={20} />}
                                                        </div>
                                                        <div>
                                                            <div className="d-flex align-items-center gap-2">
                                                                <h6 className="mb-0 fw-semibold text-dark">{item.title}</h6>
                                                                {item.data?.isPreview && (
                                                                    <span className="badge bg-success bg-opacity-10 text-success border border-success px-2 py-0 ms-2" style={{ fontSize: '10px' }}>Preview</span>
                                                                )}
                                                            </div>
                                                            <small className="text-muted text-uppercase" style={{ fontSize: '10px', letterSpacing: '0.5px' }}>{item.type}</small>
                                                        </div>
                                                    </div>

                                                    <div className="position-relative">
                                                        <button
                                                            className="btn btn-sm btn-light border text-muted opacity-75 hover-opacity-100"
                                                            onClick={() => setContentMenuOpenId(contentMenuOpenId === item.id ? null : item.id)}
                                                        >
                                                            <FiMoreVertical />
                                                        </button>

                                                        {contentMenuOpenId === item.id && (
                                                            <div className="chapter-menu-dropdown" style={{ right: 0, top: '100%', zIndex: 10 }}>
                                                                <button onClick={() => { updateContent(activeChapterId, item.id, { isPreview: !item.data?.isPreview }); setContentMenuOpenId(null); }}>
                                                                    {item.data?.isPreview ? 'Disable Preview' : 'Enable Preview'}
                                                                </button>
                                                                <button onClick={() => { setEditingItem(item); setActiveForm(item.type); setContentMenuOpenId(null); }}>
                                                                    <FiEdit2 /> Edit
                                                                </button>
                                                                <button className="danger" onClick={() => deleteContent(activeChapterId, item.id)}>
                                                                    <FiTrash2 /> Remove
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* INLINE PREVIEW AREA */}
                                                {/* INLINE PREVIEW AREA */}
                                                {selectedContentId === item.id && (
                                                    <div className="mt-3 p-3 bg-light rounded border">
                                                        {item.type === 'video' ? (
                                                            (item.data.file || item.data.url) ? (
                                                                <video
                                                                    controls
                                                                    width="100%"
                                                                    src={item.data.file ? URL.createObjectURL(item.data.file) : item.data.url}
                                                                    className="rounded"
                                                                />
                                                            ) : (
                                                                <div className="text-center py-4 text-muted">
                                                                    <p className="mb-0">No video source available (Database URL: {item.data.url || 'None'}).</p>
                                                                </div>
                                                            )
                                                        ) : item.type === 'pdf' ? (
                                                            (item.data.file || item.data.url) ? (
                                                                <iframe
                                                                    src={item.data.file ? URL.createObjectURL(item.data.file) : item.data.url}
                                                                    width="100%"
                                                                    height="400px"
                                                                    title={item.title}
                                                                    className="rounded border bg-white"
                                                                />
                                                            ) : (
                                                                <div className="text-center py-4 text-muted">
                                                                    <p className="mb-0">No PDF source available.</p>
                                                                </div>
                                                            )
                                                        ) : (
                                                            <div className="text-center py-4 text-muted">
                                                                <p className="mb-0">Preview not available for this type.</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}

                                                {/* QUICK ACTIONS */}
                                                {(item.type === 'video' || item.type === 'pdf') && selectedContentId !== item.id && (
                                                    <div className="ps-5 ms-2">
                                                        <button
                                                            className="btn btn-sm btn-link text-decoration-none p-0 text-primary"
                                                            style={{ fontSize: '13px' }}
                                                            onClick={() => handleContentClick(activeChapterId, item)}
                                                        >
                                                            {selectedContentId === item.id ? 'Hide Preview' : 'Show Preview'}
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </React.Fragment>
                                ))}
                                {displayedContents.length === 0 && (
                                    <div className="text-center py-5">
                                        <div className="mb-3 text-muted opacity-25">
                                            <FiLayout size={48} />
                                        </div>
                                        <h5 className="text-muted">This chapter is empty</h5>
                                        <button className="btn btn-outline-primary btn-sm mt-2" onClick={() => setActiveForm('content')}>
                                            <FiPlusCircle className="me-1" /> Add your first item
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* UNIFIED FORM OVERLAY */}
                            {activeForm === 'content' && (
                                <div className="cts-overlay">
                                    <div className="builder-form-container" style={{ width: '100%', maxWidth: '600px', margin: 0 }}>
                                        <UnifiedContentForm
                                            key={editingItem ? editingItem.id : 'new-content'}
                                            onSave={handleSave}
                                            onCancel={() => setActiveForm(null)}
                                            initialData={editingItem ? {
                                                ...editingItem.data,
                                                title: editingItem.title,
                                                type: editingItem.type,
                                                // If description was lost in mapping, it's empty, but form handles it.
                                            } : null}
                                        />
                                    </div>
                                </div>
                            )}

                            {/* SELECTOR REMOVED - using Unified Form directly */}
                        </>
                    )}
                </main>
            </div>
        </div>
    );
};

export default CourseBuilder;
