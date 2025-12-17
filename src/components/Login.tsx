import React, { useState } from 'react';
import {
    getAuth,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
} from 'firebase/auth';

interface LoginProps {
    onLogin: (userId: string, email: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSignUp, setIsSignUp] = useState(false);
    const [error, setError] = useState<string>('');
    const auth = getAuth();

    const handleLoginOrSignUp = async () => {
        if (!email || !password) {
            setError('Please provide both email and password.');
            return;
        }

        try {
            let userCredential;

            if (isSignUp) {
                userCredential = await createUserWithEmailAndPassword(
                    auth,
                    email,
                    password
                );
            } else {
                userCredential = await signInWithEmailAndPassword(
                    auth,
                    email,
                    password
                );
            }

            // 🔒 Role is determined server-side (Firestore), not here
            onLogin(userCredential.user.uid, email);
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message || 'An unknown error occurred.');
            } else {
                setError('An unknown error occurred.');
            }
        }
    };

    const styles = {
        container: {
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            background: 'linear-gradient(135deg, #8e44ad, #c39bd3)',
        },
        card: {
            padding: '40px',
            backgroundColor: '#6c3483',
            borderRadius: '12px',
            boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
            width: '360px',
            textAlign: 'center' as const,
            boxSizing: 'border-box' as const,
            color: '#fff',
        },
        input: {
            width: '100%',
            padding: '12px',
            margin: '12px 0',
            borderRadius: '8px',
            border: '1px solid #ccc',
            fontSize: '15px',
            boxSizing: 'border-box' as const,
        },
        button: {
            width: '100%',
            padding: '12px',
            marginTop: '15px',
            backgroundColor: '#9b59b6',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            cursor: 'pointer',
        },
        toggleButton: {
            width: '100%',
            padding: '12px',
            marginTop: '10px',
            backgroundColor: '#8e44ad',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '15px',
            cursor: 'pointer',
        },
        error: {
            color: 'red',
            marginTop: '5px',
            fontSize: '14px',
        },
    } as const;

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2 style={{ marginBottom: '20px' }}>
                    {isSignUp ? 'Create an Account' : 'Welcome Back'}
                </h2>

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={styles.input}
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={styles.input}
                />

                {error && <p style={styles.error}>{error}</p>}

                <button style={styles.button} onClick={handleLoginOrSignUp}>
                    {isSignUp ? 'Sign Up' : 'Log In'}
                </button>

                <button
                    style={styles.toggleButton}
                    onClick={() => {
                        setIsSignUp(!isSignUp);
                        setError('');
                    }}
                >
                    {isSignUp
                        ? 'Already have an account? Log In'
                        : "Don't have an account? Sign Up"}
                </button>
            </div>
        </div>
    );
};

export default Login;
