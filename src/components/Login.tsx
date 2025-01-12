// components/Login.tsx
import React, { useState } from "react";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/firebase";

interface LoginProps {
    onLogin: (role: "customer" | "employee") => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState<"customer" | "employee">("customer");
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async () => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
            onLogin(role);
        } catch {
            setError("Login failed. Please check your email and password.");
        }
    };

    const handleSignUp = async () => {
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            onLogin(role);
        } catch {
            setError("Sign-up failed. Please try again.");
        }
    };


    return (
        <div>
            <h2>Login</h2>
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <select
                value={role}
                onChange={(e) => setRole(e.target.value as "customer" | "employee")}
            >
                <option value="customer">Customer</option>
                <option value="employee">Employee</option>
            </select>
            <button onClick={handleLogin}>Login</button>
            <button onClick={handleSignUp}>Sign Up</button>
            {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
    );
};

export default Login;