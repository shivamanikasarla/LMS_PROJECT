import { useState, useCallback } from 'react';
import { IssueService } from '../services/api';
import { useToast } from '../context/ToastContext';

export const useReturnPreview = () => {
    const toast = useToast();

    // State for the modal
    const [previewData, setPreviewData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    // 1. Trigger Preview
    const openReturnModal = useCallback(async (issueId) => {
        setLoading(true);
        setIsOpen(true);
        try {
            const data = await IssueService.getReturnPreview(issueId);
            setPreviewData(data);
        } catch (err) {
            toast.error(err.message || 'Failed to load return details');
            setIsOpen(false);
        } finally {
            setLoading(false);
        }
    }, [toast]);

    // 2. Confirm Return
    const confirmReturn = async (waiveFine) => {
        if (!previewData) return;

        setProcessing(true);
        try {
            await IssueService.returnIssue(previewData.issue.id, { waiveFine });
            toast.success('Book returned successfully');
            closeModal();
            return true; // Signal success to caller (to refresh list)
        } catch (err) {
            toast.error(err.message || 'Return failed');
            return false;
        } finally {
            setProcessing(false);
        }
    };

    const closeModal = () => {
        setIsOpen(false);
        setPreviewData(null);
    };

    return {
        isOpen,
        loading,
        previewData,
        processing,
        openReturnModal,
        confirmReturn,
        closeModal
    };
};
