import React, { useState } from "react";
import logoImage from '../public/login_logo.png';

const Login = () => {
const [username, setUsername] = useState("");
const [password, setPassword] = useState("");
const [error, setError] = useState("");

const logoImageUrl = logoImage.src.toString();

const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
};

const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
};

const handleLoginSuccess = (token: string, expiresIn: number) => {    
    setUsername('');
    setPassword('');
    const expirationTimestamp = Date.now() + expiresIn * 1000;
    localStorage.setItem('token', token);
    localStorage.setItem('expirationTimestamp', expirationTimestamp.toString());
    window.location.href = '../';
};

const handleLoginFailure = () => {
    setError('Login failed. Please check your credentials.');
};

const isTokenExpired = () => {
    const expirationTimestamp = localStorage.getItem('expirationTimestamp');
    return expirationTimestamp && Date.now() > parseInt(expirationTimestamp);
};

const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();

    if (!username || !password) {
        setError("Please enter both username and password");
        return;
    }

    setError("");

    const encodedUname = btoa(`${username}`);
    const encodedPwd = btoa(`${password}`);
    const padding = ":::";

    const concatCred = encodedUname + padding + encodedPwd;    
    const encodedCred = btoa(`${concatCred}`);

    const token = btoa(btoa(`${username}`));
    const expiresIn = 600;

    const API_URL = "https://prod-123.westus.logic.azure.com:443/workflows/dc62c43309734ead8babe7d1a4e9e5d6/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=y2H4R2KzdYhDTtGjR9RdA-Nk46fi3FyPocP3bBvv0XU";

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ "user": encodedCred }),
        });
    
        if (response.ok) {
            // console.log(response);
            // return;
            handleLoginSuccess(token, expiresIn);            
        } else {
            handleLoginFailure();
        }
    } catch (error) {
        handleLoginFailure();
    }

};

return (
    <div className="form-frame">
        <div className="form-container">
            <div className="logo-container">                
                <img src={logoImageUrl} alt="Logo" className="logo" style={{ width: '150px', height: 'auto'}} />
            </div>
            <h2 className="login-heading">Login</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <input
                    type="text"
                    id="username"
                    className="input-field"
                    value={username}
                    onChange={handleUsernameChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                    type="password"
                    id="password"
                    className="input-field"
                    value={password}
                    onChange={handlePasswordChange}
                    />
                </div>
                {error && <div className="error-message">{error}</div>}
                <button type="submit" className="login-button">
                    Login
                </button>
            </form>
        </div>
        <style jsx>{`
            .form-frame {
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
            }
            .form-container {
                width: 400px;
                padding: 20px;
                border: 1px solid #ccc;
                border-radius: 4px;
                background-color: #FFFFFF;
            }
            .login-heading {
                text-align: center;
            }
            .form-group {
                margin-bottom: 16px;
            }
            .input-field {
                width: 100%;
                padding: 8px;
                border: 1px solid #ccc;
                border-radius: 4px;
            }
            .login-button {
                width: 100%;
                padding: 8px 16px;
                background-color: #1890ff;
                color: #fff;
                border: none;
                border-radius: 4px;
                cursor: pointer;
            }
            .error-message {
                color: red;
                font-size: 14px;
                margin-top: 8px;
            }
            .logo-container {
                display: flex;
                justify-content: center;
            }            
            .logo {
                width: 150px;
                height: auto;
            }
        `}</style>
    </div>
);
};

export default Login;
