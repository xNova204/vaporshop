import React, { useState } from 'react';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';

interface LoginProps {
    onLogin: (role: 'customer' | 'employee', userId: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState<'customer' | 'employee'>('customer');
    const [isSignUp, setIsSignUp] = useState(false);
    const [error, setError] = useState<string>('');
    const auth = getAuth();

    const handleLoginOrSignUp = async () => {
        if (!email || !password) {
            setError('Please provide both email and password.');
            return;
        }

        try {
            if (isSignUp) {
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                onLogin(role, userCredential.user.uid);
            } else {
                const userCredential = await signInWithEmailAndPassword(auth, email, password);
                onLogin(role, userCredential.user.uid);
            }
        } catch (error: unknown) {
            if (error instanceof Error) {
                setError(error.message || 'An unknown error occurred.');
            } else {
                setError('An unknown error occurred.');
            }
        }
    };

    return (
        <div
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                background: "linear-gradient(135deg, #e3e3e3, #ffffff)",
                zIndex: 9999
            }}
        >
            <div
                style={{
                    padding: "40px",
                    backgroundColor: "white",
                    borderRadius: "12px",
                    boxShadow: "0 8px 20px rgba(0, 0, 0, 0.15)",
                    width: "360px",
                    textAlign: "center",
                    boxSizing: "border-box",
                }}
            >

                <h2 style={{ marginBottom: "20px", color: "#333" }}>
                    {isSignUp ? "Create an Account" : "Welcome Back"}
                </h2>

                {/* Email */}
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{
                        width: "100%",
                        padding: "12px",
                        margin: "12px 0",
                        borderRadius: "8px",
                        border: "1px solid #ccc",
                        fontSize: "15px",
                        boxSizing: "border-box",
                    }}
                />

                {/* Password */}
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{
                        width: "100%",
                        padding: "12px",
                        margin: "12px 0",
                        borderRadius: "8px",
                        border: "1px solid #ccc",
                        fontSize: "15px",
                        boxSizing: "border-box",
                    }}
                />

                <div style={{ marginTop: "10px", marginBottom: "10px", color: "#444" }}>
                    <label style={{ marginRight: "15px" }}>
                        <input
                            type="radio"
                            value="customer"
                            checked={role === "customer"}
                            onChange={() => setRole("customer")}
                            style={{ marginRight: "4px" }}
                        />
                        Customer
                    </label>

                    <label>
                        <input
                            type="radio"
                            value="employee"
                            checked={role === "employee"}
                            onChange={() => setRole("employee")}
                            style={{ marginRight: "4px" }}
                        />
                        Employee
                    </label>
                </div>

                {error && (
                    <p style={{ color: "red", marginTop: "5px", fontSize: "14px" }}>{error}</p>
                )}

                <button
                    onClick={handleLoginOrSignUp}
                    style={{
                        width: "100%",
                        padding: "12px",
                        marginTop: "15px",
                        backgroundColor: "#4CAF50",
                        color: "white",
                        border: "none",
                        borderRadius: "8px",
                        fontSize: "16px",
                        cursor: "pointer",
                    }}
                >
                    {isSignUp ? "Sign Up" : "Log In"}
                </button>

                <button
                    style={{
                        width: "100%",
                        padding: "12px",
                        marginTop: "10px",
                        backgroundColor: "#1976d2",
                        color: "white",
                        border: "none",
                        borderRadius: "8px",
                        fontSize: "15px",
                        cursor: "pointer",
                    }}
                    onClick={() => {
                        setIsSignUp(!isSignUp);
                        setError("");
                    }}
                >
                    {isSignUp ? "Already have an account? Log In" : "Don't have an account? Sign Up"}
                </button>
            </div>
        </div>
    );
};

export default Login;
