import React from 'react';

interface RegisterFormProps {
    onToggle: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onToggle }) => {
    return (
        <div className="register-form">
            <form>
                <div className="input-group">
                    <span className="input-icon user-icon-small"></span>
                    <input type="text" placeholder="Email" />
                </div>
                <div className="input-group">
                    <span className="input-icon lock-icon"></span>
                    <input type="password" placeholder="Придумайте пароль" />
                </div>
                <button type="submit" className="register-button">REGISTER</button>
            </form>
            <hr className="divider" />
            <p className="toggle-text" onClick={onToggle}>Уже зарегистрированы? Войти</p>
        </div>
    );
};

export default RegisterForm;