import React from 'react';

interface LoginFormProps {
    onToggle: () => void;
    onShowRecovery: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onToggle, onShowRecovery }) => {
    return (
        <div className="login-form">
            <form>
                <div className="input-group">
                    <span className="input-icon user-icon-small"></span>
                    <input type="text" placeholder="Email" />
                </div>
                <div className="input-group">
                    <span className="input-icon lock-icon"></span>
                    <input type="password" placeholder="Введите пароль" />
                </div>
                <button type="submit" className="login-button">LOGIN</button>
            </form>
            <div className="options">
                <a href="#" onClick={onShowRecovery}>Забыли пароль?</a>
            </div>
            <hr className="divider" />
            <p className="toggle-text" onClick={onToggle}>Зарегистрироваться</p>
        </div>
    );
};

export default LoginForm;