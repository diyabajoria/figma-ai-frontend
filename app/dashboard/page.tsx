import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../../lib/auth";
import SignOutButton from "../../components/SignOutButton";

export const metadata = {
  title: "Dashboard | MONO AI",
};

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <main className="dashboard-page">
      <header className="site-header dashboard-header">
        <a className="brand" href="/">
          <span className="brand-mark" aria-hidden="true" />
          <span>MONO AI</span>
        </a>
        <nav>
          <a href="/#workflow">Workflow</a>
          <a href="/#contact">Contact</a>
        </nav>
        <SignOutButton />
      </header>

      <section className="dashboard-hero">
        <p className="pill">JWT session active</p>
        <h1>
          Welcome, <em>{session.user.name ?? "creator"}</em>
        </h1>
        <p>Your authenticated workspace is ready for the next build step.</p>
      </section>
    </main>
  );
}
