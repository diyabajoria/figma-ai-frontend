import AuthForm from "../../components/AuthForm";
import { Suspense } from "react";

export const metadata = {
  title: "Create account | MONO AI",
};

export default function SignupPage() {
  return (
    <main className="auth-page">
      <Suspense fallback={null}>
        <AuthForm mode="signup" />
      </Suspense>
      <div className="auth-visual" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
    </main>
  );
}
