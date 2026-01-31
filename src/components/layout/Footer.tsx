"use client";

import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t bg-card">
      <div className="container py-6">
        <div className="flex flex-col sm:flex-row justify-between items-center">
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} Tech Lab
          </p>
          <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-2 mt-4 sm:mt-0 text-sm">
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
