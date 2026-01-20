import React, { useState } from 'react';
import FunnelSettings from './FunnelSettings';
import RolePermissions from './RolePermissions';
import SystemLogs from './SystemLogs';
import GeneralSettings from './GeneralSettings';

const MarketingSettings = () => {
    const [activeSetting, setActiveSetting] = useState('general');

    return (
        <div className="row g-4">
            {/* Settings Sidebar */}
            <div className="col-md-3">
                <div className="list-group shadow-sm rounded-3 overflow-hidden border-0">
                    <button
                        className={`list-group-item list-group-item-action ${activeSetting === 'general' ? 'active' : ''}`}
                        onClick={() => setActiveSetting('general')}
                    >
                        General Configuration
                    </button>
                    <button
                        className={`list-group-item list-group-item-action ${activeSetting === 'funnel' ? 'active' : ''}`}
                        onClick={() => setActiveSetting('funnel')}
                    >
                        Funnel Configuration
                    </button>
                    <button
                        className={`list-group-item list-group-item-action ${activeSetting === 'roles' ? 'active' : ''}`}
                        onClick={() => setActiveSetting('roles')}
                    >
                        Roles & Permissions
                    </button>
                    <button
                        className={`list-group-item list-group-item-action ${activeSetting === 'logs' ? 'active' : ''}`}
                        onClick={() => setActiveSetting('logs')}
                    >
                        System Logs
                    </button>
                </div>
            </div>

            {/* Settings Content */}
            <div className="col-md-9">
                {activeSetting === 'general' && <GeneralSettings />}
                {activeSetting === 'funnel' && <FunnelSettings />}
                {activeSetting === 'roles' && <RolePermissions />}
                {activeSetting === 'logs' && <SystemLogs />}
            </div>
        </div>
    );
};

export default MarketingSettings;
