import { Link } from "react-router-dom";
import "./Footer.css"

const NAVIGATION = [
    { label: "Про нас", href: "/about" },
    { label: "Тренувальні тести", href: "/tests" },
    { label: "Курси", href: "/courses" },
    { label: "FAQ", href: "/faq" },
];

const SOCIALS = [
    { label: "TikTok", href: "https://tiktok.com", icon: "tiktok" },
    { label: "Telegram", href: "https://t.me", icon: "telegram" },
    { label: "Instagram", href: "https://instagram.com", icon: "instagram" },
    { label: "YouTube", href: "https://youtube.com", icon: "youtube" },
];

const CONTACT_EMAIL = "nmt.tresh@gmail.com";

export default function Footer() {
    return (
        <footer className="footer">
            <div className="footerInner">

                <div className="brand">
                    <div className="logo">
                        <img src="/logo_light.svg" alt="logo" />
                    </div>
                    <p className="brandName">Треш НМТ</p>
                    <p className="tagline">
                        Твій шлях до високого бала без стресу та хаосу. Підготовка, що
                        працює на результат.
                    </p>
                </div>

                <nav className="nav" aria-label="Навігація">
                    <p className="colHeading">Навігація</p>
                    <ul className="navList">
                        {NAVIGATION.map((item) => (
                            <li key={item.href}>
                                <Link to={item.href} className="navLink">
                                    {item.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>

                <div className="contacts">
                    <p className="colHeading">Контакти</p>
                    <a href={`mailto:${CONTACT_EMAIL}`} className="email">
                        {CONTACT_EMAIL}
                    </a>
                </div>

                <div className="socials">
                    <p className="colHeading">Соціальні мережі</p>
                    <ul className="socialList">
                        {SOCIALS.map((s) => (
                            <li key={s.icon}
                                href={s.href}
                                className="socialLink"
                                aria-label={s.label}
                                >
                                <SocialIcon name={s.icon} />

                            </li>
                            ))}
                    </ul>
                </div>

            </div>
        </footer>
    );
}

function SocialIcon({ name }) {
    switch (name) {
        case "tiktok":
            return (
                <img src="/tiktok.svg" alt=""/>
            );
        case "telegram":
            return (
                <img src="/telegram.svg" alt=""/>
            );
        case "instagram":
            return (
                <img src="/instagram.svg" alt=""/>
            );
        case "youtube":
            return (
                <img src="/youtube.svg" alt=""/>
            );
        default:
            return null;
    }
}