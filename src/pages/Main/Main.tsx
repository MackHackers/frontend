import { Link } from "react-router";

export default function News() {
  return (
    <>
      {/* MAIN TITLE */}
      <section className="w-full flex  items-center justify-center text-center py-10 gap-3">
        <div className="w-[70%] flex flex-col items-center gap-6">
          <h1 className="text-3xl font-bold">База знаний SetlGroup</h1>
          <p className="mt-2 text-gray-500">
            Здесь собраны все статьи по работе с системами SetlGroup, <br />{" "}
            разбитые по разделам и категориям для вашего удобства
          </p>

          <Link
            to="/articles"
            className="btn btn-primary w-[60%] h-20 text-lg flex items-center justify-center shadow-lg"
          >
            Поиск →
          </Link>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="w-full px-10">
        <h2 className="text-2xl font-semibold mb-4">Разделы</h2>
        <div className="grid grid-cols-3 gap-4">
          <Link
            to="/articles"
            className="btn btn-primary w-full h-20 text-lg flex items-center justify-center shadow-lg"
          >
            Статьи →
          </Link>
          <Link
            to="/learning"
            className="btn btn-primary w-full h-20 text-lg flex items-center justify-center shadow-lg"
          >
            Обучение →
          </Link>
          <Link
            to="/news"
            className="btn btn-primary w-full h-20 text-lg flex items-center justify-center shadow-lg"
          >
            Новости →
          </Link>
        </div>
      </section>

      {/* FAQ BLOCK */}
      <section className="px-10 py-10">
        <div className="bg-base-100 shadow-md rounded-xl p-8 grid grid-cols-3 gap-6">
          <div className="flex flex-col gap-6">
            <h2 className="text-2xl font-semibold mb-4">FAQ</h2>
            <p>
              Здесь вы сможете найти ответы на вопросы, которые чаще всего
              интересуют пользователей базы знаний
            </p>
            <img src="/faq_figure.png" className="rounded-xl" />
          </div>

          <div className="col-span-2 space-y-2">
            <div className="collapse collapse-plus">
              <input type="checkbox" />
              <div className="collapse-title font-medium">
                Это вопрос, который интересует пользователей?
              </div>
              <div className="collapse-content">Текст ответа</div>
            </div>

            <div className="divider"></div>

            <div className="collapse collapse-plus">
              <input type="checkbox" />
              <div className="collapse-title font-medium">
                Вопрос менее важный, но тут?
              </div>
              <div className="collapse-content">Текст ответа</div>
            </div>

            <div className="divider"></div>

            <div className="collapse collapse-plus">
              <input type="checkbox" />
              <div className="collapse-title font-medium">
                Тоже какой-то вопрос
              </div>
              <div className="collapse-content">Текст ответа</div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
