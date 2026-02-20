import React from 'react';
import { Outlet } from 'react-router-dom';

const LibraryLayout = () => {
    return (
        <div className="library-module-content">
            {/* 
                Global Navigation (TopNav + ContextNav) is handled by DashboardLayout.
                LibraryLayout now acts purely as a content wrapper/context provider if needed.
            */}
            <Outlet />
        </div>
    );
};

export default LibraryLayout;
