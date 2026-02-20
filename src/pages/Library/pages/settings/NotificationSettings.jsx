import React from 'react';

const NotificationSettings = ({ notifications, setNotifications }) => {

    const toggle = key => {
        setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <>
            <h4 className="mb-3">Notifications</h4>

            {Object.keys(notifications).map(key => (
                <div className="form-check form-switch mb-2" key={key}>
                    <input
                        className="form-check-input"
                        type="checkbox"
                        checked={notifications[key]}
                        onChange={() => toggle(key)}
                    />
                    <label className="form-check-label">
                        {key}
                    </label>
                </div>
            ))}
        </>
    );
};

export default NotificationSettings;
