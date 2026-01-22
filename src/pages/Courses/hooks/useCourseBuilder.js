import { useState, useCallback, useEffect } from 'react';
import { courseService } from '../services/courseService';
import { topicService } from '../services/topicService';

// Mock initial data
const INITIAL_DATA = {
    id: null,
    title: 'Loading...',
    chapters: []
};

// Mapper: Backend Topic -> Frontend Chapter
const mapTopicToChapter = (topic) => ({
    id: topic.topicId,
    title: topic.topicName,
    contents: topic.contents ? topic.contents.map(mapContentToItem) : [] // Handle transient contents
});

// Mapper: Backend Content -> Frontend Item
const mapContentToItem = (content) => {
    let type = content.contentType?.toLowerCase() || 'video';
    if (type === 'text') type = 'heading'; // Map backend 'TEXT' to frontend 'heading'

    return {
        id: content.contentId,
        type: type,
        title: content.fileUrl || 'Untitled', // Fallback title since backend lacks one
        data: {
            url: content.fileUrl,
            // We lose description and specific title if not in backend entity
        }
    };
};

export const useCourseBuilder = (courseId) => {
    const [courseData, setCourseData] = useState(INITIAL_DATA);
    const [activeChapterId, setActiveChapterId] = useState(null);
    const [isSelectorOpen, setIsSelectorOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Fetch course data
    const fetchCourse = useCallback(async () => {
        if (!courseId) return;
        setIsLoading(true);
        try {
            // Parallel fetch: Course Details + Topics
            console.log("Fetching Course and Topics for:", courseId);
            const [courseData, topicsData] = await Promise.all([
                courseService.getCourseById(courseId),
                topicService.getTopics(courseId)
            ]);
            console.log("Fetched Course:", courseData);
            console.log("Fetched Topics:", topicsData);

            // Map backend structure to frontend structure
            const chapters = topicsData.map(mapTopicToChapter);

            // Fetch contents for each chapter (since getTopics might be shallow or lazy)
            // Optimization: Only if needed. Assuming getTopics returns contents as transient or we need to fetch.
            // Based on user entity, Topic has @Transient contents. 
            // The getTopicsByCourseId in TopicServiceImpl returns list of topics.
            // DOES IT POPULATE CONTENTS?
            // TopicController -> topicService.getTopicsByCourseId -> repository.findByCourse...
            // Topic entity has @Transient List<TopicContent> contents;
            // It is NOT populated by JPA automatically.
            // WE MUST FETCH CONTENTS FOR EACH TOPIC.

            for (let chapter of chapters) {
                try {
                    const contents = await topicService.getContents(chapter.id);
                    chapter.contents = contents.map(mapContentToItem);
                } catch (e) {
                    console.warn(`Could not fetch contents for topic ${chapter.id}`, e);
                }
            }

            const formattedData = {
                ...courseData,
                title: courseData.courseName || courseData.title || 'Untitled Course',
                chapters: chapters
            };

            setCourseData(formattedData);

            // Set first chapter active if available and none selected
            if (!activeChapterId && chapters.length > 0) {
                setActiveChapterId(chapters[0].id);
            }
        } catch (error) {
            console.error("Failed to load course:", error);
            setCourseData(prev => ({ ...prev, title: 'Error loading course' }));
        } finally {
            setIsLoading(false);
        }
    }, [courseId]);

    // Initial load
    useEffect(() => {
        fetchCourse();
    }, [fetchCourse]);

    const addChapter = useCallback(async () => {
        try {
            const newTopic = await topicService.createTopic(courseId, { title: 'New Chapter' });
            const chapter = mapTopicToChapter(newTopic);

            setCourseData(prev => ({
                ...prev,
                chapters: [...prev.chapters, chapter]
            }));
            setActiveChapterId(chapter.id);
        } catch (error) {
            console.error("Failed to create chapter:", error);
            alert("Failed to create chapter");
        }
    }, [courseId]);

    const updateChapterTitle = useCallback(async (chapterId, newTitle) => {
        try {
            // Optimistic Update
            setCourseData(prev => ({
                ...prev,
                chapters: prev.chapters.map(ch =>
                    ch.id === chapterId ? { ...ch, title: newTitle } : ch
                )
            }));

            await topicService.updateTopic(chapterId, { title: newTitle });
        } catch (error) {
            console.error("Failed to update chapter:", error);
            // Revert or alert?
            fetchCourse();
        }
    }, [fetchCourse]);

    const deleteChapter = useCallback(async (chapterId) => {
        if (!window.confirm("Are you sure? This will delete all contents in this chapter.")) return;

        try {
            // 1. Robustness: Fetch latest contents from server to ensure we catch everything (even if local state is out of sync)
            try {
                const serverContents = await topicService.getContents(chapterId);
                if (serverContents && serverContents.length > 0) {
                    await Promise.all(serverContents.map(item => topicService.deleteContent(item.contentId)));
                }
            } catch (e) {
                console.warn("Could not fetch/delete contents before deleting topic. Proceeding anyway...", e);
            }

            // 2. Delete Topic (Now safe from Foreign Key error)
            await topicService.deleteTopic(chapterId);

            // 3. Update Local State
            setCourseData(prev => ({
                ...prev,
                chapters: prev.chapters.filter(ch => ch.id !== chapterId)
            }));
            if (activeChapterId === chapterId) {
                setActiveChapterId(null);
            }
        } catch (error) {
            console.error("Failed to delete chapter:", error);
            alert("Failed to delete chapter. (Backend Error: " + error.message + ")");
        }
    }, [activeChapterId]);

    const selectChapter = useCallback((chapterId) => {
        setActiveChapterId(chapterId);
        setIsSelectorOpen(false);
    }, []);

    const addContent = useCallback(async (chapterId, type, data = {}, insertAfterId = null) => {
        try {
            // 1. Prepare Content Data
            const contentPayload = {
                type,
                title: data.title,
                url: data.url, // Ensure VideoForm passes 'url'
                description: data.description,
                order: 0 // logic for order needed
            };

            // 2. Call API to Create Content Record
            let newContent = await topicService.createContent(chapterId, contentPayload);

            // 3. Handle File Upload if present
            if (data.file) {
                await topicService.uploadContentFile(newContent.contentId, data.file);
                // Re-fetch content to get the fileUrl generated by backend
                newContent = await topicService.getContentById(newContent.contentId);
            }

            const newItem = mapContentToItem(newContent);

            // 4. Update State
            setCourseData(prev => ({
                ...prev,
                chapters: prev.chapters.map(ch => {
                    if (ch.id === chapterId) {
                        return { ...ch, contents: [...ch.contents, newItem] };
                    }
                    return ch;
                })
            }));
            setIsSelectorOpen(false);
        } catch (error) {
            console.error("Failed to add content:", error);
            alert("Failed to add content.");
        }
    }, []);

    const deleteContent = useCallback(async (chapterId, contentId) => {
        try {
            await topicService.deleteContent(contentId);

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
        } catch (error) {
            console.error("Failed to delete content:", error);
            alert("Failed to delete content");
        }
    }, []);

    const updateContent = useCallback(async (chapterId, contentId, newData) => {
        try {
            // Check if we are only toggling preview (no backend backend support for isPreview yet?)
            // Assuming no support, skipping API call for isPreview or handling metadata update

            await topicService.updateContent(contentId, newData);

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
        } catch (error) {
            console.error("Failed to update content:", error);
            fetchCourse();
        }
    }, [fetchCourse]);

    const moveChapter = useCallback((chapterId, direction) => {
        // Backend order support missing. Just local update.
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
        // Backend order support missing (only 'contentOrder' field exists).
        // To implement correctly, we'd need to update indices of all affected items.
        // Doing local only for now.
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
        moveContent,
        isLoading
    };
};
