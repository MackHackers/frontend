import RegisterForm from "./components/LoginForm.tsx";

const Auth: React.FC = () => {
    return (
        <div className="auth">
            <div className="auth-container">
                <RegisterForm/>
            </div>
        </div>
    );
};

export default Auth;