import React, { useState } from 'react';
import { useAuth } from '../Library/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            await login(email, password);
            navigate('/dashboard');
        } catch (err) {
            console.error(err);
            setError('Invalid credentials or server error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
            <div className="card shadow p-4" style={{ maxWidth: '400px', width: '100%' }}>
                <h3 className="text-center mb-4">Admin Login</h3>

                {error && <div className="alert alert-danger">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Email Address</label>
                        <input
                            type="email"
                            className="form-control"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="admin@gmail.com"
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Password</label>
                        <input
                            type="password"
                            className="form-control"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="*******"
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary w-100"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Signing In...' : 'Sign In'}
                    </button>

                    <div className="mt-3 text-center">
                        <small className="text-muted">LMS Admin Portal</small>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
