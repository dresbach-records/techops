"use client";

import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t bg-card">
      <div className="container py-6">
        <div className="flex flex-col items-center gap-4">
          <p className="text-muted-foreground text-sm">
            © 2026 Tech Lab
          </p>
          <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-2 text-sm">
            <Link href="/privacidade" className="text-muted-foreground hover:text-primary text-center">
              Política de Privacidade
            </Link>
            <span className="text-muted-foreground hidden sm:inline">|</span>
            <Link href="/termos-de-servico" className="text-muted-foreground hover:text-primary text-center">
              Termos de Serviço
            </Link>
            <span className="text-muted-foreground hidden sm:inline">|</span>
            <Link href="/privacidade" className="text-muted-foreground hover:text-primary text-center">
              Exclusão de Dados do Usuário
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
