
import { useState, useCallback, useEffect } from 'react';
import { courseService } from '../services/courseService';

// Mock initial data
const INITIAL_DATA = {
    id: null,
    title: 'Loading...',
    chapters: []
};

export const useCourseBuilder = (courseId) => {
    const [courseData, setCourseData] = useState(INITIAL_DATA);
    const [activeChapterId, setActiveChapterId] = useState(null);
    const [isSelectorOpen, setIsSelectorOpen] = useState(false);

    // Fetch course data on mount
    useEffect(() => {
        if (!courseId) return;

        const fetchCourse = async () => {
            try {
                const data = await courseService.getCourseById(courseId);
                // Ensure chapters array exists
                const formattedData = {
                    ...data,
                    chapters: data.chapters || []
                };
                setCourseData(formattedData);

                // Set first chapter active if available
                if (data.chapters && data.chapters.length > 0) {
                    setActiveChapterId(data.chapters[0].id);
                }
            } catch (error) {
                console.error("Failed to load course:", error);
                setCourseData(prev => ({ ...prev, title: 'Error loading course' }));
            }
        };

        fetchCourse();
    }, [courseId]);

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

    const moveChapter = useCallback((chapterId, direction) => {
        setCourseData(prev => {
            const index = prev.chapters.findIndex(c => c.id === chapterId);
            if (index === -1) return prev;

            const newChapters = [...prev.chapters];
            if (direction === 'up' && index > 0) {
                [newChapters[index], newChapters[index - 1]] = [newChapters[index - 1], newChapters[index]];
            } else if (direction === 'down' && index < newChapters.length - 1) {
                [newChapters[index], newChapters[index + 1]] = [newChapters[index + 1], newChapters[index]];
            }

            return { ...prev, chapters: newChapters };
        });
    }, []);

    const moveContent = useCallback((chapterId, itemId, direction) => {
        setCourseData(prev => {
            const chapterIndex = prev.chapters.findIndex(c => c.id === chapterId);
            if (chapterIndex === -1) return prev;

            const chapter = prev.chapters[chapterIndex];
            const itemIndex = chapter.contents.findIndex(i => i.id === itemId);
            if (itemIndex === -1) return prev;

            const newContents = [...chapter.contents];
            if (direction === 'up' && itemIndex > 0) {
                [newContents[itemIndex], newContents[itemIndex - 1]] = [newContents[itemIndex - 1], newContents[itemIndex]];
            } else if (direction === 'down' && itemIndex < newContents.length - 1) {
                [newContents[itemIndex], newContents[itemIndex + 1]] = [newContents[itemIndex + 1], newContents[itemIndex]];
            }

            const newChapters = [...prev.chapters];
            newChapters[chapterIndex] = { ...chapter, contents: newContents };
            return { ...prev, chapters: newChapters };
        });
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
        updateContent,
        moveChapter,
        moveContent
    };
};
