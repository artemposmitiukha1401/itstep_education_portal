import { useState } from "react";
import "./AboutPage.css";
import {Link} from "react-router-dom";

const SERVICES = [
    {
        id: 1,
        icon: "/list_icon.svg",
        title: "Пробні та тренувальні тести НМТ",
        description: "Готуйтесь до іспитів ефективно з нашими пробними та тренувальними тестами НМТ (ЗНО), які є основним інструментом підготовки до вступу. Завдання у форматі реального іспиту з таймером та детальним аналізом помилок.",
        features: [
            "Пробні тести НМТ з усіх предметів",
            "Тренувальні тести у форматі реального іспиту",
            "Детальний аналіз помилок після проходження",
        ],
    },
    {
        id: 2,
        icon: "/books_icon.svg",
        title: "Інтенсивні онлайн-курси",
        description: "Опановуйте складні теми легко разом із нашими експертами. Ми розібрали програму НМТ на прості модулі, щоб ви засвоїли максимум матеріалу за мінімум часу без зубріння.",
        features: [
            "Живі лекції та записи занять",
            "Авторські конспекти до кожної теми",
            "Підтримка менторів у чаті 24/7",
        ],
    },
];

const FAQS = [
    { id: 1, question: "Що таке онлайн-тести НМТ і як вони працюють?", answer: "Онлайн-тести НМТ — це інтерактивні завдання у форматі реального іспиту з таймером та автоматичною перевіркою відповідей." },
    { id: 2, question: "Які предмети є обов'язковими, а які можна обрати?", answer: "Обов'язкові предмети: українська мова та математика. Додатково можна обрати один предмет за вибором залежно від спеціальності." },
    { id: 3, question: "Як нараховуються бали та який прохідний мінімум?", answer: "Бали нараховуються за шкалою від 100 до 200. Мінімальний прохідний бал встановлюється МОН щороку." },
    { id: 4, question: "Чи можна користуватися допоміжними матеріалами під час тесту?", answer: "Ні, використання будь-яких допоміжних матеріалів під час реального НМТ заборонено." },
    { id: 5, question: "Що робити, якщо під час тестування почалася повітряна тривога?", answer: "Тестування зупиняється, всі учасники переходять до укриття. Сесія буде відновлена після відбою тривоги." },
    { id: 6, question: "Як зареєструватися на НМТ та які документи потрібні?", answer: "Реєстрація проходить на сайті УЦОЯО. Потрібні: паспорт або свідоцтво про народження та атестат." },
    { id: 7, question: "Коли та де я отримаю свої офіційні результати?", answer: "Результати публікуються на сайті УЦОЯО приблизно через 2–3 тижні після складання тесту." },
    { id: 8, question: "Чи можна перескласти тест, якщо результат мене не влаштовує?", answer: "Так, НМТ можна скласти двічі на рік. Зараховується кращий результат." },
    { id: 9, question: "Як підготуватися до НМТ за короткий термін з вашою платформою?", answer: "Рекомендуємо почати з діагностичного тесту, потім проходити тематичні модулі та щодня розв'язувати по 20–30 завдань." },
];

function CheckIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
            <polyline points="22 4 12 14.01 9 11.01"/>
        </svg>
    );
}
function FaqItem({ question, answer }) {
    const [open, setOpen] = useState(false);
    return (
        <div className={`aboutFaqItem ${open ? "open" : ""}`} onClick={() => setOpen(!open)}>
            <div className="aboutFaqQuestion">
                <span>{question}</span>
                <img
                    src="/open_question.svg"
                    width="20" height="20"
                    style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.25s" }}
                />
            </div>
            <div className="aboutFaqAnswer">
                <p>{answer}</p>
            </div>
        </div>
    );
}

export default function AboutPage() {
    return (
        <main className="aboutPage">
            <Link to="/home" className="back-btn" aria-label="Назад до предметів">
                <span className="btn-text">Предмети</span>
                <svg className="btn-arrow" width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="#103058" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </Link>
            <h1 className="aboutTitle">Про нас</h1>
            <section className="aboutIntro">
                <p className="aboutDescription">
                    Ми <strong>замінили</strong> хаос перед НМТ на <strong>покрокову стратегію.</strong> Використовуємо <strong>сучасні технології,</strong> щоб ви отримали <strong>омріяний бал</strong> без вигорання. З нами вступ — це математично точний <strong>розрахунок.</strong>
                </p>
            </section>

            <section className="aboutServices">
                {SERVICES.map((s) => (
                    <div key={s.id} className="aboutServiceCard">
                        <div className="aboutServiceHeader">
                            <img src={s.icon}/>
                            <h2 className="aboutServiceTitle">{s.title}</h2>
                        </div>
                        <p className="aboutServiceDesc">{s.description}</p>
                        <ul className="aboutFeatureList">
                            {s.features.map((f) => (
                                <li key={f} className="aboutFeatureItem">
                                    <span className="aboutCheckIcon"><CheckIcon /></span>
                                    {f}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </section>

            <section className="aboutFaq">
                <h2 className="aboutFaqTitle">Поширені запитання про НМТ</h2>
                <div className="aboutFaqList">
                    {FAQS.map((f) => (
                        <FaqItem key={f.id} question={f.question} answer={f.answer} />
                    ))}
                </div>
            </section>

        </main>
    );
}