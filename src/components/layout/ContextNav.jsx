import { NavLink, useLocation } from 'react-router-dom';
import { navigationConfig } from '../../config/navigation';

const ContextNav = () => {
    const location = useLocation();

    // Find the currently active active primary tab
    const activeItem = navigationConfig.find(item => {
        // 1. Direct match or prefix match on the main path
        if (item.path === '/' && location.pathname === '/') return true;

        // 2. Check if ANY subItem matches the current location
        if (item.subItems) {
            const hasMatchingSub = item.subItems.some(sub =>
                location.pathname === sub.path || location.pathname.startsWith(sub.path + '/')
            );
            if (hasMatchingSub) return true;
        }

        // 3. Fallback to basic matchPrefix if defined (legacy support)
        if (item.matchPrefix) {
            return location.pathname.startsWith(item.matchPrefix);
        }

        return false;
    });

    if (!activeItem || !activeItem.subItems) return null;

    // Find active sub-item (Level 2) to see if it has children
    const activeSubItem = activeItem.subItems.find(sub =>
        location.pathname === sub.path || location.pathname.startsWith(sub.path + '/')
    );

    return (
        <div className="d-flex flex-column w-100">
            {/* LEVEL 2 NAV */}
            <div className="w-100 bg-white border-bottom">
                <div className="container-fluid px-4">
                    <div className="d-flex flex-nowrap align-items-center justify-content-center gap-4 overflow-auto no-scrollbar py-1">
                        {activeItem.subItems.map(sub => (
                            <NavLink
                                key={sub.label}
                                to={sub.path}
                                end={!sub.childItems}
                                className="d-flex flex-column align-items-center justify-content-center text-center text-decoration-none px-2 py-1"
                                style={{ minWidth: '70px' }}
                            >
                                {({ isActive }) => (
                                    <>
                                        <div
                                            className={`rounded-circle d-flex align-items-center justify-content-center mb-1 ${isActive ? 'bg-primary text-white shadow-sm transition-smooth' : 'bg-light text-secondary context-nav-hover'}`}
                                            style={{ width: '40px', height: '40px', fontSize: '1.1rem' }}
                                        >
                                            <i className={`bi ${sub.icon || 'bi-circle'}`}></i>
                                        </div>
                                        <span
                                            className={`transition-smooth ${isActive ? 'text-primary fw-bold' : 'text-muted fw-medium'}`}
                                            style={{ fontSize: '0.75rem', lineHeight: '1.1' }}
                                        >
                                            {sub.label}
                                        </span>
                                    </>
                                )}
                            </NavLink>
                        ))}
                    </div>
                </div>
            </div>

            {/* LEVEL 3 NAV (if active sub-item has children) */}
            {activeSubItem && activeSubItem.childItems && (
                <div className="w-100 bg-light border-bottom">
                    <div className="container-fluid px-4">
                        <div className="d-flex flex-nowrap align-items-center justify-content-center gap-4 overflow-auto no-scrollbar py-1">
                            {activeSubItem.childItems.map(child => (
                                <NavLink
                                    key={child.label}
                                    to={child.path}
                                    end
                                    className={({ isActive }) => `
                                        text-decoration-none d-flex align-items-center gap-2 px-2 py-1 rounded transition-none whitespace-nowrap
                                        ${isActive
                                            ? 'text-primary fw-bold'
                                            : 'text-muted hover-text-dark'}
                                    `}
                                    style={{ minWidth: 'fit-content', fontSize: '0.85rem' }}
                                >
                                    <i className={`bi ${child.icon || 'bi-dot'} fs-6`}></i>
                                    <span>{child.label}</span>
                                </NavLink>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ContextNav;
