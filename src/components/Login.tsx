import React, { useState } from 'react';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';

interface LoginProps {
    onLogin: (role: 'customer' | 'employee', userId: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState<'customer' | 'employee'>('customer');
    const [isSignUp, setIsSignUp] = useState(false); // Toggle between login and sign-up
    const [error, setError] = useState<string>(''); // Specify type as string

    const auth = getAuth();

    const handleLoginOrSignUp = async () => {
        if (!email || !password) {
            setError('Please provide both email and password.');
            return;
        }

        try {
            if (isSignUp) {
                // Create a new account
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const userId = userCredential.user.uid; // Get the user's unique ID
                console.log('New account created:', { email, role, userId });
                onLogin(role, userId);
            } else {
                // Log in with existing account
                const userCredential = await signInWithEmailAndPassword(auth, email, password);
                const userId = userCredential.user.uid; // Get the user's unique ID
                console.log('Logged in successfully:', { email, role, userId });
                onLogin(role, userId);
            }
        } catch (error: unknown) {
            console.error(error);

            // Handle the error type correctly without using `any`
            if (error instanceof Error) {
                if (error.message.includes('user-not-found')) {
                    setError('No account found with this email. Please sign up.');
                } else if (error.message.includes('wrong-password')) {
                    setError('Incorrect password. Please try again.');
                } else {
                    setError(error.message || 'An unknown error occurred.');
                }
            } else {
                setError('An unknown error occurred.');
            }
        }
    };

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            backgroundColor: '#f0f0f0'
        }}>
            <div style={{
                padding: '20px',
                backgroundColor: 'white',
                borderRadius: '8px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                width: '300px',
                textAlign: 'center' // Optional: Center text inside the form
            }}>
                <h2>{isSignUp ? 'Sign Up' : 'Login'}</h2>
                <div>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={{ width: '100%', padding: '10px', margin: '10px 0', borderRadius: '4px', border: '1px solid #ddd' }}
                    />
                </div>
                <div>
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={{ width: '100%', padding: '10px', margin: '10px 0', borderRadius: '4px', border: '1px solid #ddd' }}
                    />
                </div>
                <div>
                    <label style={{ marginRight: '10px', color: '#333' }}> {/* Set label color */}
                        <input
                            type="radio"
                            value="customer"
                            checked={role === 'customer'}
                            onChange={() => setRole('customer')}
                        />
                        Customer
                    </label>
                    <label style={{ color: '#333' }}> {/* Set label color */}
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
                    onClick={handleLoginOrSignUp}
                    style={{ width: '100%', padding: '10px', marginTop: '10px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px' }}
                >
                    {isSignUp ? 'Sign Up' : 'Login'}
                </button>
                <button
                    style={{
                        width: '100%',
                        padding: '10px',
                        marginTop: '10px',
                        backgroundColor: '#f44336',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px'
                    }}
                    onClick={() => {
                        setIsSignUp(!isSignUp);
                        setError('');
                    }}
                >
                    {isSignUp ? 'Already have an account? Log In' : "Don't have an account? Sign Up"}
                </button>
            </div>
        </div>
    );
};

export default Login;
