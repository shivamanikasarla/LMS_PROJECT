import React from 'react';
import { useAuth } from '../Library/context/AuthContext'; // Adapting path to where AuthContext is
import MarketingManager from './MarketingManager';
import MarketingExecutive from './MarketingExecutive';
import './Marketing.css';

const Marketing = () => {
  const { user, login } = useAuth();

  // For development debug/demo purposes, if no user is logged in, show a dev selection
  if (!user) {
    return (
      <div className="marketing-login-debug" style={{ padding: '2rem', textAlign: 'center' }}>
        <h2>Marketing Portal Access</h2>
        <p>Please select a role to enter (Demo Mode)</p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1rem' }}>
          <button className="btn-primary" onClick={() => login('MARKETING_MANAGER')}>Login as Manager</button>
          <button className="btn-secondary" onClick={() => login('MARKETING_EXECUTIVE')}>Login as Executive</button>
        </div>
      </div>
    );
  }

  // Dispatch based on role
  if (user.role === 'MARKETING_MANAGER' || user.role === 'ADMIN') {
    return <MarketingManager />;
  }

  if (user.role === 'MARKETING_EXECUTIVE') {
    return <MarketingExecutive />;
  }

  return (
    <div className="access-denied">
      <h2>Access Denied</h2>
      <p>You do not have permission to view the Marketing module.</p>
    </div>
  );
};

export default Marketing;