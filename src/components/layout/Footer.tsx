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
          <div className="flex space-x-4 mt-4 sm:mt-0 text-sm">
            <Link href="/privacidade" className="text-muted-foreground hover:text-primary">
              Privacidade
            </Link>
            <span className="text-muted-foreground">|</span>
            <Link href="#" className="text-muted-foreground hover:text-primary">
              Termos
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
