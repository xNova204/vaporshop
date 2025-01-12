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
            // Ensure error is properly typed
            if (error instanceof Error) {
                setError(
                    error.code === 'auth/user-not-found'
                        ? 'No account found with this email. Please sign up.'
                        : error.message
                );
            } else {
                setError('An unknown error occurred.');
            }
        }
    };

    return (
        <div>
            <h2>{isSignUp ? 'Sign Up' : 'Login'}</h2>
            <div>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </div>
            <div>
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </div>
            <div>
                <label>
                    <input
                        type="radio"
                        value="customer"
                        checked={role === 'customer'}
                        onChange={() => setRole('customer')}
                    />
                    Customer
                </label>
                <label>
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
            <button onClick={handleLoginOrSignUp}>
                {isSignUp ? 'Sign Up' : 'Login'}
            </button>
            <button
                style={{ marginLeft: '10px' }}
                onClick={() => {
                    setIsSignUp(!isSignUp);
                    setError('');
                }}
            >
                {isSignUp ? 'Already have an account? Log In' : "Don't have an account? Sign Up"}
            </button>
        </div>
    );
};

export default Login;
