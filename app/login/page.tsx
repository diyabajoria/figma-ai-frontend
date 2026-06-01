import AuthForm from "../../components/AuthForm";
import { Suspense } from "react";

export const metadata = {
  title: "Sign in | MONO AI",
};

export default function LoginPage() {
  return (
    <main className="auth-page">
      <Suspense fallback={null}>
        <AuthForm mode="login" />
      </Suspense>
      <div className="auth-visual" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
    </main>
  );
}
