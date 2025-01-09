import React, { useState } from 'react';

interface LoginProps {
    onLogin: (role: 'customer' | 'employee') => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState<'customer' | 'employee'>('customer');
    const [error, setError] = useState('');

    const handleLogin = () => {
        if (!email || !password) {
            setError('Please fill out all fields');
            return;
        }

        // Mock validation (replace with actual authentication logic if needed)
        if (email.includes('@') && password.length >= 4) {
            setError('');
            onLogin(role); // Call the parent function to set the logged-in state
        } else {
            setError('Invalid email or password');
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '50px auto', fontFamily: 'Arial, sans-serif' }}>
            <h1>Login</h1>
            <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>Email</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
                />
            </div>
            <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>Password</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
                />
            </div>
            <div style={{ marginBottom: '20px' }}>
                <label>
                    <input
                        type="radio"
                        value="customer"
                        checked={role === 'customer'}
                        onChange={() => setRole('customer')}
                    />
                    Customer
                </label>
                <label style={{ marginLeft: '20px' }}>
                    <input
                        type="radio"
                        value="employee"
                        checked={role === 'employee'}
                        onChange={() => setRole('employee')}
                    />
                    Employee
                </label>
            </div>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <button
                onClick={handleLogin}
                style={{
                    width: '100%',
                    padding: '10px',
                    backgroundColor: '#4caf50',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer'
                }}
            >
                Log In
            </button>
        </div>
    );
};

export default Login;
