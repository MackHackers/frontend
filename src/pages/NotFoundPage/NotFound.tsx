import { Link } from "react-router";

export default function NotFound() {
    return (

            <div className="flex flex-col items-center justify-center flex-1 text-center px-4">
                <h1 className="text-7xl font-bold text-primary mb-4">404</h1>
                <h2 className="text-2xl font-semibold mb-2">Страница не найдена</h2>
                <p className="text-gray-500 max-w-md mb-8">
                    Похоже, вы перешли по адресу, которого не существует. Возможно, страница была перемещена или удалена.
                </p>

                <Link to="/main" className="btn btn-primary btn-lg rounded-xl px-8">
                    Вернуться на главную
                </Link>
            </div>

    );
}