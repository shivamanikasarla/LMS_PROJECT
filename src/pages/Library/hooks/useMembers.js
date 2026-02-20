import { useEffect, useState, useCallback } from 'react';
import { MemberService } from '../services/api';

export const useMembers = (toast) => {
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(false);

    const loadMembers = useCallback(async () => {
        setLoading(true);
        try {
            const data = await MemberService.getAllMembers();
            setMembers(data);
        } catch (error) {
            console.error(error);
            toast.error('Failed to load members');
        } finally {
            setLoading(false);
        }
    }, [toast]);

    const createMember = async (payload) => {
        try {
            const created = await MemberService.createMember(payload);
            setMembers(prev => [...prev, created]);
            return true;
        } catch (error) {
            console.error(error);
            toast.error('Failed to create member');
            return false;
        }
    };

    const updateMember = async (id, payload) => {
        try {
            await MemberService.updateMember(id, payload);
            setMembers(prev =>
                prev.map(m => (m.id === id ? { ...m, ...payload } : m))
            );
            return true;
        } catch (error) {
            console.error(error);
            toast.error('Failed to update member');
            return false;
        }
    };

    const deleteMember = async (id) => {
        try {
            await MemberService.deleteMember(id);
            setMembers(prev => prev.filter(m => m.id !== id));
            return true;
        } catch (error) {
            console.error(error);
            toast.error('Cannot delete member (active dependencies)');
            return false;
        }
    };

    const toggleMemberStatus = async (id, currentStatus) => {
        try {
            await MemberService.toggleMemberStatus(id, currentStatus);
            setMembers(prev =>
                prev.map(m =>
                    m.id === id
                        ? { ...m, status: currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE' }
                        : m
                )
            );
            return true;
        } catch (error) {
            console.error(error);
            toast.error('Failed to change member status');
            return false;
        }
    };

    useEffect(() => {
        loadMembers();
    }, [loadMembers]);

    return { members, loading, createMember, updateMember, deleteMember, toggleMemberStatus, refresh: loadMembers };
};
