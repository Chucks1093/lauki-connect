import type { ReactNode } from 'react';

type AppShellProps = {
  title: string;
  subtitle: string;
  children: ReactNode;
};

export default function AppShell({ title, subtitle, children }: AppShellProps) {
  return (
    <main className="shell">
      <section className="hero">
        <p className="eyebrow">Lauki Connect</p>
        <h1>{title}</h1>
        <p className="subtitle">{subtitle}</p>
      </section>
      <section className="panel">{children}</section>
    </main>
  );
}
