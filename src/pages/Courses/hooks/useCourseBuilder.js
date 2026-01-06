
import { useState, useCallback } from 'react';

// Mock initial data
const INITIAL_DATA = {
    id: null,
    title: 'Untitled Course',
    chapters: []
};

export const useCourseBuilder = (courseId) => {
    const [courseData, setCourseData] = useState(INITIAL_DATA);
    const [activeChapterId, setActiveChapterId] = useState(null);
    const [isSelectorOpen, setIsSelectorOpen] = useState(false);

    // Mock Load (replace with API call)
    // useEffect(() => { ... }, [courseId]);

    const addChapter = useCallback(() => {
        const newChapter = {
            id: Date.now(),
            title: 'New Chapter',
            contents: []
        };
        setCourseData(prev => ({
            ...prev,
            chapters: [...prev.chapters, newChapter]
        }));
        setActiveChapterId(newChapter.id);
    }, []);

    const updateChapterTitle = useCallback((chapterId, newTitle) => {
        setCourseData(prev => ({
            ...prev,
            chapters: prev.chapters.map(ch =>
                ch.id === chapterId ? { ...ch, title: newTitle } : ch
            )
        }));
    }, []);

    const deleteChapter = useCallback((chapterId) => {
        setCourseData(prev => ({
            ...prev,
            chapters: prev.chapters.filter(ch => ch.id !== chapterId)
        }));
        if (activeChapterId === chapterId) {
            setActiveChapterId(null);
        }
    }, [activeChapterId]);

    const selectChapter = useCallback((chapterId) => {
        setActiveChapterId(chapterId);
        setIsSelectorOpen(false); // Close selector when switching chapters
    }, []);

    const addContent = useCallback((chapterId, type, data = {}, insertAfterId = null) => {
        const newContent = {
            id: Date.now() + Math.random(),
            type,
            title: data.title || 'Untitled Content',
            data
        };

        setCourseData(prev => ({
            ...prev,
            chapters: prev.chapters.map(ch => {
                if (ch.id === chapterId) {
                    let newContents = [...ch.contents];
                    if (insertAfterId) {
                        const index = newContents.findIndex(c => c.id === insertAfterId);
                        if (index !== -1) {
                            newContents.splice(index + 1, 0, newContent);
                        } else {
                            newContents.push(newContent);
                        }
                    } else {
                        newContents.push(newContent);
                    }
                    return { ...ch, contents: newContents };
                }
                return ch;
            })
        }));
        setIsSelectorOpen(false);
    }, []);

    const deleteContent = useCallback((chapterId, contentId) => {
        setCourseData(prev => ({
            ...prev,
            chapters: prev.chapters.map(ch => {
                if (ch.id === chapterId) {
                    return {
                        ...ch,
                        contents: ch.contents.filter(c => c.id !== contentId)
                    };
                }
                return ch;
            })
        }));
    }, []);

    const updateContent = useCallback((chapterId, contentId, newData) => {
        setCourseData(prev => ({
            ...prev,
            chapters: prev.chapters.map(ch => {
                if (ch.id === chapterId) {
                    return {
                        ...ch,
                        contents: ch.contents.map(c =>
                            c.id === contentId
                                ? { ...c, data: { ...c.data, ...newData }, title: newData.title || c.title }
                                : c
                        )
                    };
                }
                return ch;
            })
        }));
    }, []);

    return {
        courseData,
        activeChapterId,
        isSelectorOpen,
        setIsSelectorOpen,
        addChapter,
        updateChapterTitle,
        deleteChapter,
        selectChapter,
        addContent,
        deleteContent,
        updateContent
    };
};
