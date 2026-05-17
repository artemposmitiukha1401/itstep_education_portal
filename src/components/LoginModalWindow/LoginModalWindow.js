import { useState } from "react";
import "./LoginModalWindow.css";

const VALIDATORS = {
  email: (v) => {
    if (!v.trim()) return "Email є обов'язковим";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return "Введіть коректний email";
    return null;
  },
  password: (v) => {
    if (!v) return "Пароль є обов'язковим";
    if (v.length < 6) return "Пароль має містити щонайменше 6 символів";
    return null;
  },
};

function useField(name) {
  const [value, setValue] = useState("");
  const [touched, setTouched] = useState(false);
  const error = touched ? VALIDATORS[name](value) : null;

  return {
    value,
    error,
    isValid: VALIDATORS[name](value) === null,
    onChange: (e) => setValue(e.target.value),
    onBlur: () => setTouched(true),
    touch: () => setTouched(true),
  };
}

export default function LoginModalWindow({
  onClose,
  onGuestContinue,
  onLogin,
  onRegisterClick,
}){
  const email = useField("email");
  const password = useField("password");
  const [showPassword, setShowPassword] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    email.touch();
    password.touch();
    if (!email.isValid || !password.isValid) return;
    onLogin?.({ email: email.value, password: password.value });
  }

  return (
    <div
      className="loginOverlay"
      onClick={(e) => e.target === e.currentTarget && onClose?.()}
    >
      <div
        className="loginModal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="loginTitle"
      >
        <button className="loginClose" onClick={onClose} aria-label="Закрити">
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M18 6L6 18M6 6L18 18"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>

        <h2 id="loginTitle" className="loginTitle">
          Увійдіть у свій акаунт
        </h2>
        <p className="loginSubtitle">
          Продовжте свій шлях до високих балів на НМТ
        </p>

        <button className="loginGuestBtn" onClick={onGuestContinue}>
          <span className="loginGuestBtnText">Продовжити як гість</span>

          <svg
            className="loginGuestBtnIcon"
            width="100%"
            height="100%"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M19 21L22 18M22 18L19 15M22 18H16M12 15.5H7.5C6.10444 15.5 5.40665 15.5 4.83886 15.6722C3.56045 16.06 2.56004 17.0605 2.17224 18.3389C2 18.9067 2 19.6044 2 21M14.5 7.5C14.5 9.98528 12.4853 12 10 12C7.51472 12 5.5 9.98528 5.5 7.5C5.5 5.01472 7.51472 3 10 3C12.4853 3 14.5 5.01472 14.5 7.5Z"
              stroke="#103058"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>

        <div className="loginDivider">
          <span>Або</span>
        </div>

        <form onSubmit={handleSubmit} className="loginForm" noValidate>
          <div className="loginField">
            <input
              type="email"
              placeholder="Email"
              value={email.value}
              onChange={email.onChange}
              onBlur={email.onBlur}
              autoComplete="email"
              className={email.error ? "inputError" : ""}
              aria-invalid={!!email.error}
              aria-describedby={email.error ? "email-error" : undefined}
            />
            {email.error && (
              <span className="fieldError" id="email-error" role="alert">
                {email.error}
              </span>
            )}
          </div>

          <div className="loginField loginFieldPassword">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Пароль"
              value={password.value}
              onChange={password.onChange}
              onBlur={password.onBlur}
              autoComplete="current-password"
              className={password.error ? "inputError" : ""}
              aria-invalid={!!password.error}
              aria-describedby={password.error ? "password-error" : undefined}
            />
            <button
              type="button"
              className="loginPasswordToggle"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Сховати пароль" : "Показати пароль"}
            >
              {showPassword ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  />
                  <circle
                    cx="12"
                    cy="12"
                    r="3"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  />
                  <path
                    d="M3 3l18 18"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  />
                  <circle
                    cx="12"
                    cy="12"
                    r="3"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  />
                </svg>
              )}
            </button>
            {password.error && (
              <span className="fieldError" id="password-error" role="alert">
                {password.error}
              </span>
            )}
          </div>

          <button type="submit" className="loginSubmitBtn">
            <span className="loginSubmitBtnText">Увійти</span>

            <svg
              className="loginSubmitBtnIcon"
              width="100%"
              height="100%"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M15 3H16.2C17.8802 3 18.7202 3 19.362 3.32698C19.9265 3.6146 20.3854 4.07354 20.673 4.63803C21 5.27976 21 6.11985 21 7.8V16.2C21 17.8802 21 18.7202 20.673 19.362C20.3854 19.9265 19.9265 20.3854 19.362 20.673C18.7202 21 17.8802 21 16.2 21H15M10 7L15 12M15 12L10 17M15 12L3 12"
                stroke="white"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>
        </form>

        <div className="loginDivider">
          <span>Або увійти за допомогою</span>
        </div>

        <div className="loginSocial">
          <button className="loginSocialBtn" aria-label="Увійти через Apple">
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
            </svg>
          </button>
          <button className="loginSocialBtn" aria-label="Увійти через Google">
            <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
          </button>
        </div>

        <p className="loginFooter">
  Немає акаунту?{" "}
  <a
    href="#register"
    onClick={(event) => {
      event.preventDefault();
      onRegisterClick?.();
    }}
  >
    Зареєструватись
  </a>
</p>
      </div>
    </div>
  );
}
