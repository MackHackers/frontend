import React from 'react';

const LoginForm: React.FC = () => {
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
        </div>
    );
};

export default LoginForm;