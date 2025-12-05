import RegisterForm from "./components/LoginForm.tsx";
import backgroundSvg from '../../icons/logo+module.svg';

export default function Auth() {
    return (
        <div className="min-h-screen w-full flex items-center justify-center p-6 relative">
            <div
                className="absolute inset-0 bg-no-repeat bg-[position:20px_40px]"
                style={{
                    backgroundImage: `url(${backgroundSvg})`,
                    backgroundSize: '40%',
                    opacity: 0.9,
                }}
            />
            <div className="relative z-10">
                <RegisterForm />
            </div>
        </div>
    );
}