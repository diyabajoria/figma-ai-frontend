"use client";

import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useMemo, useState } from "react";

type AuthFormProps = {
  mode: "login" | "signup";
  onModeChange?: (mode: "login" | "signup") => void;
};

function GoogleIcon() {
  return (
    <svg aria-hidden="true" className="oauth-icon" viewBox="0 0 24 24">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285f4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.15v2.84C3.96 20.53 7.68 23 12 23z"
        fill="#34a853"
      />
      <path
        d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.15C1.4 8.55 1 10.22 1 12s.4 3.45 1.15 4.94l3.69-2.84z"
        fill="#fbbc05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.68 1 3.96 3.47 2.15 7.06l3.69 2.84C6.71 7.3 9.14 5.38 12 5.38z"
        fill="#ea4335"
      />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg aria-hidden="true" className="oauth-icon" viewBox="0 0 24 24">
      <path
        d="M12 .5C5.65.5.5 5.65.5 12c0 5.09 3.29 9.4 7.86 10.92.58.1.79-.25.79-.56v-2.15c-3.2.7-3.87-1.36-3.87-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.05-.72.08-.71.08-.71 1.16.08 1.77 1.19 1.77 1.19 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.54-2.55-.29-5.23-1.28-5.23-5.68 0-1.25.45-2.28 1.18-3.08-.12-.29-.51-1.46.11-3.04 0 0 .97-.31 3.16 1.18A10.9 10.9 0 0 1 12 6.06c.98 0 1.95.13 2.87.39 2.19-1.49 3.15-1.18 3.15-1.18.63 1.58.24 2.75.12 3.04.74.8 1.18 1.83 1.18 3.08 0 4.41-2.69 5.38-5.25 5.67.41.36.78 1.06.78 2.13v3.17c0 .31.21.67.79.56A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5z"
        fill="currentColor"
      />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg aria-hidden="true" className="oauth-icon oauth-icon-apple" viewBox="0 0 24 24">
      <path
        d="M17.05 12.66c-.02-2.05 1.68-3.04 1.76-3.09-.96-1.4-2.45-1.59-2.97-1.61-1.25-.13-2.46.75-3.09.75-.65 0-1.62-.73-2.67-.71-1.35.02-2.62.81-3.31 2.04-1.43 2.48-.36 6.12 1.01 8.12.69.98 1.49 2.08 2.54 2.04 1.03-.04 1.42-.65 2.67-.65 1.24 0 1.6.65 2.68.63 1.11-.02 1.81-.98 2.48-1.97.79-1.12 1.1-2.23 1.11-2.29-.03-.01-2.18-.84-2.21-3.26zM15.02 6.63c.56-.7.94-1.64.84-2.59-.81.04-1.82.56-2.4 1.24-.52.61-.99 1.59-.87 2.51.91.07 1.84-.47 2.43-1.16z"
        fill="currentColor"
      />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg aria-hidden="true" className="oauth-icon" viewBox="0 0 24 24">
      <path
        d="M23 12.07C23 5.95 18.07 1 12 1S1 5.95 1 12.07C1 17.6 5.02 22.18 10.28 23v-7.73H7.49v-3.2h2.79V9.63c0-2.77 1.64-4.3 4.15-4.3 1.2 0 2.46.22 2.46.22v2.72h-1.38c-1.36 0-1.79.85-1.79 1.72v2.08h3.04l-.49 3.2h-2.55V23C18.98 22.18 23 17.6 23 12.07z"
        fill="currentColor"
      />
    </svg>
  );
}

export default function AuthForm({ mode, onModeChange }: AuthFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<"options" | "email">(mode === "login" ? "email" : "options");
  const [showPassword, setShowPassword] = useState(false);

  const callbackUrl = useMemo(() => searchParams.get("callbackUrl") ?? "/", [searchParams]);
  const isSignup = mode === "signup";
  const alternateMode = isSignup ? "login" : "signup";

  function switchMode() {
    setError("");
    setStep("email");
    onModeChange?.(alternateMode);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");
    const name = String(formData.get("name") ?? "");

    if (isSignup) {
      const signupResponse = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      if (!signupResponse.ok) {
        const payload = (await signupResponse.json().catch(() => null)) as { error?: string } | null;
        setError(payload?.error ?? "Could not create your account. Please try again.");
        setIsLoading(false);
        return;
      }
    }

    const loginResponse = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl,
    });

    setIsLoading(false);

    if (loginResponse?.error) {
      setError(isSignup ? "Account created, but automatic sign in failed." : "Invalid email or password.");
      return;
    }

    router.push(loginResponse?.url ?? callbackUrl);
    router.refresh();
  }

  function handleOAuth(provider: "apple" | "facebook" | "github" | "google") {
    void signIn(provider, { callbackUrl });
  }

  return (
    <div className="auth-card">
      <div className="auth-pattern" aria-hidden="true" />
      <div className="auth-heading">
        <h1>Turn Figma designs</h1>
        <p>into real websites in minutes</p>
      </div>

      {step === "options" ? (
        <div className="auth-options">
          <button className="oauth-primary" type="button" onClick={() => handleOAuth("google")}>
            <GoogleIcon />
            Continue with Google
          </button>

          <div className="oauth-secondary">
            <button type="button" aria-label="Continue with GitHub" onClick={() => handleOAuth("github")}>
              <GitHubIcon />
            </button>
            <button type="button" aria-label="Continue with Apple" onClick={() => handleOAuth("apple")}>
              <AppleIcon />
            </button>
            <button type="button" aria-label="Continue with Facebook" onClick={() => handleOAuth("facebook")}>
              <FacebookIcon />
            </button>
          </div>

          <button className="email-option" type="button" onClick={() => setStep("email")}>
            <Icon type="email" />
            Continue with Email
          </button>
        </div>
      ) : (
        <>
          <p className="auth-inline-switch">
            {isSignup ? "Already have an account?" : "New to MONO AI?"}{" "}
            {onModeChange ? (
              <button type="button" onClick={switchMode}>
                {isSignup ? "Sign in" : "Create an account"}
              </button>
            ) : (
              <Link href={isSignup ? "/login" : "/signup"}>{isSignup ? "Sign in" : "Create an account"}</Link>
            )}
          </p>

          <form className="auth-form" onSubmit={handleSubmit}>
            {isSignup && (
              <label className="auth-field">
                <Icon type="user" />
                <input autoComplete="name" name="name" placeholder="Enter your name" required type="text" />
              </label>
            )}
            <label className="auth-field">
              <Icon type="email" />
              <input autoComplete="email" name="email" placeholder="Enter your email" required type="email" />
            </label>
            <label className="auth-field">
              <Icon type="lock" />
              <input
                autoComplete={isSignup ? "new-password" : "current-password"}
                minLength={8}
                name="password"
                placeholder="Enter your password"
                required
                type={showPassword ? "text" : "password"}
              />
              <button
                className="password-toggle"
                type="button"
                aria-label={showPassword ? "Hide password" : "Show password"}
                onClick={() => setShowPassword((value) => !value)}
              >
                <Icon type="eye" />
              </button>
            </label>

            {error && <p className="auth-error">{error}</p>}

            <button className="auth-submit" disabled={isLoading} type="submit">
              {isLoading ? "Please wait..." : isSignup ? "Get Started" : "Sign in"}
              <Icon type="arrow" />
            </button>

            <button className="auth-back" type="button" onClick={() => setStep("options")}>
              <Icon type="chevron" />
              Go Back
            </button>
          </form>
        </>
      )}

      <p className="auth-terms">
        By continuing, you agree to our <a href="#">Terms of Service</a>
        <br />
        and <a href="#">Privacy Policy</a>.
      </p>
    </div>
  );
}

function Icon({ type }: { type: "arrow" | "chevron" | "email" | "eye" | "lock" | "user" }) {
  const paths = {
    arrow: <path d="M5 12h13m-5-5 5 5-5 5" />,
    chevron: <path d="m14 7-5 5 5 5" />,
    email: <path d="M4 7h16v10H4z M4 8l8 6 8-6" />,
    eye: <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6z M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />,
    lock: <path d="M7 11V8a5 5 0 0 1 10 0v3 M6 11h12v9H6z M12 15v2" />,
    user: <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M5 21a7 7 0 0 1 14 0" />,
  };

  return (
    <svg aria-hidden="true" className="auth-icon" viewBox="0 0 24 24">
      {paths[type]}
    </svg>
  );
}
