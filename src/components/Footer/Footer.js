import { Link } from "react-router-dom";
import "./Footer.css";

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
        <div className="footerBrand">
          <div className="footerLogo">
            <img src="/logo_light.svg" alt="Треш НМТ" />
          </div>

          <p className="footerBrandName">Треш НМТ</p>

          <p className="footerTagline">
            Твій шлях до високого бала без стресу та хаосу. Підготовка, що
            працює на результат.
          </p>
        </div>

        <nav className="footerNav" aria-label="Навігація">
          <p className="footerColHeading">Навігація</p>

          <ul className="footerNavList">
            {NAVIGATION.map((item) => (
              <li key={item.href}>
                <Link to={item.href} className="footerNavLink">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="footerContacts">
          <p className="footerColHeading">Контакти</p>

          <a href={`mailto:${CONTACT_EMAIL}`} className="footerEmail">
            {CONTACT_EMAIL}
          </a>
        </div>

        <div className="footerSocials">
          <p className="footerColHeading">Соціальні мережі</p>

          <ul className="footerSocialList">
            {SOCIALS.map((social) => (
              <li key={social.icon}>
                <a
                  href={social.href}
                  className="footerSocialLink"
                  aria-label={social.label}
                  target="_blank"
                  rel="noreferrer"
                >
                  <SocialIcon name={social.icon} />
                </a>
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
      return <img src="/tiktok.svg" alt="" />;
    case "telegram":
      return <img src="/telegram.svg" alt="" />;
    case "instagram":
      return <img src="/instagram.svg" alt="" />;
    case "youtube":
      return <img src="/youtube.svg" alt="" />;
    default:
      return null;
  }
}