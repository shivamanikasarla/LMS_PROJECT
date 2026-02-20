import React from 'react';
import { Bell, Search, Menu, LogIn, LogOut, UserCircle } from 'lucide-react';
import './Header.css';
import { useAuth } from '../../context/AuthContext';
import NetworkStatus from '../NetworkStatus';

const Header = ({ onMenuClick }) => {
    const { user, login, logout } = useAuth();

    return (
        <header className="header">
            <button className="btn btn-link p-0 me-3 d-md-none text-dark" onClick={onMenuClick}>
                <Menu size={24} />
            </button>
            <div className="search-bar">
                <Search size={20} className="search-icon" />
                <input
                    type="text"
                    placeholder="Global search (Books, Members, ISBN)..."
                    className="search-input"
                />
                <div className="kbd-shortcut">⌘K</div>
            </div>

            <div className="header-actions">
                <NetworkStatus />

                {user ? (
                    <>
                        <button className="action-btn">
                            <Bell size={20} />
                            <span className="badge-dot"></span>
                        </button>

                        <div className="user-profile dropdown">
                            <div
                                className="d-flex align-items-center gap-2 cursor-pointer"
                                data-bs-toggle="dropdown"
                            >
                                <div className="avatar">
                                    <img src={user.avatar} alt={user.name} className="rounded-circle" width="32" height="32" />
                                </div>
                                <div className="user-info d-none d-sm-block text-start">
                                    <span className="user-name d-block">{user.name}</span>
                                    <span className="user-role badge bg-primary-subtle text-primary border border-primary-subtle" style={{ fontSize: '0.65rem' }}>
                                        {user.role}
                                    </span>
                                </div>
                            </div>
                            <ul className="dropdown-menu dropdown-menu-end shadow-sm border-0">
                                <li><h6 className="dropdown-header">Signed in as {user.name}</h6></li>
                                <li><hr className="dropdown-divider" /></li>

                                {/* ROLE SWITCHER FOR EASY NAV */}
                                <li><h6 className="dropdown-header text-uppercase small opacity-50 my-1">Switch View</h6></li>
                                {user.role === 'ADMIN' ? (
                                    <li>
                                        <button className="dropdown-item" onClick={() => login('STUDENT')}>
                                            <UserCircle size={14} className="me-2 text-muted" />
                                            Switch to Student View
                                        </button>
                                    </li>
                                ) : ( // Student or Librarian or Faculty
                                    <li>
                                        <button className="dropdown-item" onClick={() => login('ADMIN')}>
                                            <UserCircle size={14} className="me-2 text-muted" />
                                            Switch to Admin View
                                        </button>
                                    </li>
                                )}

                                <li><hr className="dropdown-divider" /></li>
                                <li>
                                    <button className="dropdown-item text-danger d-flex align-items-center" onClick={logout}>
                                        <LogOut size={16} className="me-2" />
                                        Logout
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </>
                ) : (
                    <div className="d-flex gap-2">
                        <div className="dropdown">
                            <button className="btn btn-primary btn-sm dropdown-toggle d-flex align-items-center" type="button" data-bs-toggle="dropdown">
                                <LogIn size={16} className="me-2" />
                                Login
                            </button>
                            <ul className="dropdown-menu dropdown-menu-end shadow-sm border-0">
                                <li><h6 className="dropdown-header">Select Role</h6></li>
                                <li><button className="dropdown-item" onClick={() => login('ADMIN')}>Login as Admin</button></li>
                                <li><button className="dropdown-item" onClick={() => login('LIBRARIAN')}>Login as Librarian</button></li>
                                <li><hr className="dropdown-divider" /></li>
                                <li><button className="dropdown-item" onClick={() => login('STUDENT')}>Login as Student (Peter)</button></li>
                            </ul>
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;
