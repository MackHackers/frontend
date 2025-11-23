import React, { useState } from 'react';

interface PasswordRecoveryProps {
    onBackToLogin: () => void;
}

const PasswordRecovery: React.FC<PasswordRecoveryProps> = ({ onBackToLogin }) => {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [code, setCode] = useState(['', '', '', '', '', '']);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSendCode = (e: React.FormEvent) => {
        e.preventDefault();
        //todo отправка кода
        console.log('Sending code to:', email);
        setStep(2);
    };

    const handleVerifyCode = (e: React.FormEvent) => {
        e.preventDefault();
        const verificationCode = code.join('');
        console.log('Verifying code:', verificationCode);
        // todo проверка кода
        setStep(3);
    };

    const handleResetPassword = (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            alert('Пароли не совпадают');
            return;
        }
        console.log('Resetting password for:', email);
        //todo логика сброса пароля
        alert('Пароль успешно изменен!');
        onBackToLogin();
    };

    const handleCodeChange = (index: number, value: string) => {
        if (value.length <= 1 && /^\d*$/.test(value)) {
            const newCode = [...code];
            newCode[index] = value;
            setCode(newCode);
            if (value !== '' && index < 5) {
                const nextInput = document.getElementById(`code-${index + 1}`);
                if (nextInput) nextInput.focus();
            }
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === 'Backspace' && code[index] === '' && index > 0) {
            const prevInput = document.getElementById(`code-${index - 1}`);
            if (prevInput) prevInput.focus();
        }
    };

    if (step === 1) {
        return (
            <div className="recovery-form">
                <h2>Восстановление пароля</h2>
                <form onSubmit={handleSendCode}>
                    <div className="input-group">
                        <span className="input-icon email-icon"></span>
                        <input
                            type="email"
                            placeholder="Введите ваш email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="recovery-button">
                        Выслать код
                    </button>
                </form>
                <p className="back-link" onClick={onBackToLogin}>
                    ← Назад к входу
                </p>
            </div>
        );
    }

    if (step === 2) {
        return (
            <div className="recovery-form">
                <h2>Введите код подтверждения</h2>
                <p className="recovery-info">
                    Мы отправили 6-значный код на email: {email}
                </p>
                <form onSubmit={handleVerifyCode}>
                    <div className="code-inputs">
                        {code.map((digit, index) => (
                            <input
                                key={index}
                                id={`code-${index}`}
                                type="text"
                                maxLength={1}
                                value={digit}
                                onChange={(e) => handleCodeChange(index, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                className="code-input"
                            />
                        ))}
                    </div>
                    <button type="submit" className="recovery-button">
                        Подтвердить код
                    </button>
                </form>
                <p className="resend-code">
                    Не получили код? <a href="#">Отправить снова</a>
                </p>
                <p className="back-link" onClick={() => setStep(1)}>
                    ← Изменить email
                </p>
            </div>
        );
    }

    return (
        <div className="recovery-form">
            <h2>Создайте новый пароль</h2>
            <form onSubmit={handleResetPassword}>
                <div className="input-group">
                    <span className="input-icon lock-icon"></span>
                    <input
                        type="password"
                        placeholder="Новый пароль"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                    />
                </div>
                <div className="input-group">
                    <span className="input-icon lock-icon"></span>
                    <input
                        type="password"
                        placeholder="Повторите пароль"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="recovery-button">
                    Сохранить пароль
                </button>
            </form>
            <p className="back-link" onClick={() => setStep(2)}>
                ← Назад к вводу кода
            </p>
        </div>
    );
};

export default PasswordRecovery;