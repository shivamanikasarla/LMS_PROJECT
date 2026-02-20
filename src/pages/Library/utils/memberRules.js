import { ROLES, CATEGORIES } from './constants';

export const validateMember = (m) => {
    if (!m.name) return 'Name is required';

    if (!m.email) return 'Email is required';
    if (!/^\S+@\S+\.\S+$/.test(m.email)) {
        return 'Invalid email format';
    }

    if (!m.mobile) return 'Mobile number is required';
    if (!/^[6-9]\d{9}$/.test(m.mobile)) {
        return 'Invalid mobile number';
    }

    if (!m.memberId) return 'ID is required';

    return null;
};

export const normalizeMember = (m) => {
    if (m.role !== ROLES.MEMBER) {
        return { ...m, category: CATEGORIES.STAFF };
    }
    return m;
};
