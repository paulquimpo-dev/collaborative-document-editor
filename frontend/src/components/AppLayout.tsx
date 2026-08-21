import type { ReactNode } from "react";

interface AppLayoutProps {
  sidebar: ReactNode;
  header: ReactNode;
  children: ReactNode;
}

export function AppLayout({ sidebar, header, children }: AppLayoutProps) {
  return (
    <div className="app-layout">
      {sidebar}
      <main className="workspace">
        <header className="workspace-header">{header}</header>
        <section className="workspace-content" aria-label="Document workspace">
          {children}
        </section>
      </main>
    </div>
  );
}
