
import React, { useState, useEffect } from 'react';
import { FiPlus } from 'react-icons/fi';
import './Users.css';

// Services
import { enrollmentService } from '../Batches/services/enrollmentService';
import { batchService } from '../Batches/services/batchService';
import { userService } from './services/userService';

// Sub-modules
import UserList from './tabs/UserList';
import UserActivityLogs from './tabs/UserActivityLogs';
import AddUserModal from './components/AddUserModal';

const Users = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [editingUser, setEditingUser] = useState(null);

  const [users, setUsers] = useState([]);
  const [allBatchesList, setAllBatchesList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      // Fetch users from new userService, keep batch/enrollments for enrichment
      const [data, enrollments, batches] = await Promise.all([
        userService.getAllUsers(),
        enrollmentService.getAllEnrollments(),
        batchService.getAllBatches()
      ]);

      const usersList = Array.isArray(data) ? data : [];

      // Enrich users with batch info
      const enrichedUsers = usersList.map(u => {
        // Backend User entity has userId, frontend often uses id. Standardize to id.
        const uId = u.userId || u.id;

        // Construct display name if missing
        let displayName = u.name;
        if (!displayName && (u.firstName || u.lastName)) {
          displayName = `${u.firstName || ''} ${u.lastName || ''}`.trim();
        }

        const normalizedUser = { ...u, id: uId, name: displayName || 'Unknown' };

        // Map backend 'enabled' to frontend 'status' if needed
        if (typeof u.enabled !== 'undefined') {
          normalizedUser.status = u.enabled ? 'Active' : 'Inactive';
        }

        // Map backend 'roleName' to frontend 'role'
        if (u.roleName) {
          const roleMap = {
            'ROLE_STUDENT': 'Student',
            'ROLE_INSTRUCTOR': 'Instructor',
            'ROLE_PARENT': 'Parent',
            'ROLE_ADMIN': 'Admin',
            'ROLE_SUPER_ADMIN': 'Super Admin'
          };
          normalizedUser.role = roleMap[u.roleName] || u.roleName;
        }

        const userEnrollments = Array.isArray(enrollments) ? enrollments.filter(e => String(e.studentId) === String(uId)) : [];
        const userBatchInfos = userEnrollments.map(e => {
          const b = Array.isArray(batches) ? batches.find(bat => String(bat.batchId) === String(e.batchId)) : null;
          return b ? { id: b.batchId, name: b.batchName } : null;
        }).filter(Boolean);

        // Format joined date
        const joinedDate = u.createdAt || u.createdDate || u.joiningDate || u.dateJoined;
        const formattedJoined = joinedDate ? new Date(joinedDate).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        }) : '-';

        return { ...normalizedUser, batches: userBatchInfos, joined: formattedJoined };
      });

      setUsers(enrichedUsers);
      setAllBatchesList(Array.isArray(batches) ? batches : []);
    } catch (error) {
      console.error("Failed to load users", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await userService.deleteUser(id);
        setUsers(prev => prev.filter(u => u.id !== id));
      } catch (error) {
        alert("Failed to delete user: " + error.message);
      }
    }
  };

  const handleToggleStatus = async (id) => {
    const user = users.find(u => u.id === id);
    if (!user) return;

    try {
      await userService.toggleStatus(id, user.status);
      // Optimistic update
      setUsers(prev => prev.map(u => {
        if (u.id === id) {
          return { ...u, status: u.status === 'Active' ? 'Inactive' : 'Active' };
        }
        return u;
      }));
    } catch (error) {
      alert("Failed to update status: " + error.message);
    }
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleSaveUser = async (userData) => {
    try {
      if (editingUser) {
        // TODO: Implement update in userService if needed (PATCH /users/{id})
        alert("Edit functionality requires backend update endpoint implementation.");
      } else {
        // Create new via API
        await userService.createUser(userData);
        alert("User created successfully!");
        loadUsers(); // Reload to get new ID and data
      }
      setEditingUser(null);
      setIsModalOpen(false);
    } catch (error) {
      alert("Error saving user: " + error.message);
    }
  };

  const openAddModal = () => {
    setEditingUser(null);
    setIsModalOpen(true);
  };

  return (
    <div className="users-page">
      <header className="users-header">
        <div className="users-title">
          <h1>User Management</h1>
          <p>Manage students, instructors, and system administrators.</p>
        </div>
        <button className="btn-add-user" onClick={openAddModal}>
          <FiPlus size={18} /> Add New User
        </button>
      </header>

      {/* TAB NAVIGATION */}
      <div className="users-tabs">
        <button className={`u-tab ${activeTab === 'all' ? 'active' : ''}`} onClick={() => setActiveTab('all')}>
          All Users <span className="u-badge">{users.length}</span>
        </button>
        <button className={`u-tab ${activeTab === 'instructors' ? 'active' : ''}`} onClick={() => setActiveTab('instructors')}>
          Instructors <span className="u-badge">{users.filter(u =>
            (u.role === 'Instructor' || u.roleName === 'ROLE_INSTRUCTOR')
          ).length}</span>
        </button>
        <button className={`u-tab ${activeTab === 'logs' ? 'active' : ''}`} onClick={() => setActiveTab('logs')}>
          Activity Logs
        </button>
      </div>

      {/* CONTENT AREA */}
      <div className="users-content">
        {activeTab === 'all' && (
          <UserList
            users={users}
            setUsers={setUsers}
            onDelete={handleDeleteUser}
            onToggleStatus={handleToggleStatus}
            onEdit={handleEditUser}
            batches={allBatchesList}
          />
        )}
        {activeTab === 'instructors' && (
          <UserList
            users={users.filter(u => u.role === 'Instructor')}
            setUsers={setUsers}
            onDelete={handleDeleteUser}
            onToggleStatus={handleToggleStatus}
            onEdit={handleEditUser}
            hideRoleFilter={true}
            batches={allBatchesList}
          />
        )}
        {activeTab === 'logs' && <UserActivityLogs />}
      </div>

      {/* ADD/EDIT USER MODAL */}
      {isModalOpen && (
        <AddUserModal
          setIsModalOpen={(val) => {
            setIsModalOpen(val);
            if (!val) setEditingUser(null);
          }}
          onAddUser={handleSaveUser}
          initialUser={editingUser}
        />
      )}
    </div>
  );
};

export default Users;
