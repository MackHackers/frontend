import React, { useState } from 'react';
import LoginForm from "../../components/Login/LoginForm.tsx";
import RegisterForm from "../../components/Login/RegisterForm.tsx";
import PasswordRecovery from "../../components/Login/PasswordRecovery.tsx";

const Auth: React.FC = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [showRecovery, setShowRecovery] = useState(false);

    const toggleForm = () => {
        setIsLogin(!isLogin);
        setShowRecovery(false);
    };

    const showPasswordRecovery = () => {
        setShowRecovery(true);
    };

    const backToLogin = () => {
        setShowRecovery(false);
    };

    return (
        <div className="auth">
            <div className="auth-container">
                {showRecovery ? (
                    <PasswordRecovery onBackToLogin={backToLogin} />
                ) : isLogin ? (
                    <LoginForm onToggle={toggleForm} onShowRecovery={showPasswordRecovery} />
                ) : (
                    <RegisterForm onToggle={toggleForm} />
                )}
            </div>
        </div>
    );
};

export default Auth;