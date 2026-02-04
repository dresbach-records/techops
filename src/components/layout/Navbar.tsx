"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Rocket } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { UserNav } from "./UserNav";

const navLinks = [
  { href: "/como-funciona", label: "Como Funciona" },
  { href: "/planos", label: "Planos" },
];

export function Navbar() {
  const { isAuthenticated, loading } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-20 items-center">
        <div className="mr-4 flex items-center">
          <Link href="/" className="flex items-center gap-2">
            <Rocket className="h-8 w-8 text-primary" />
            <span className="font-headline text-2xl font-bold">Tech Lab</span>
          </Link>
        </div>
        <nav className="hidden items-center space-x-6 text-sm font-medium md:flex flex-1 justify-center">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center justify-end space-x-2">
          <div className="hidden md:flex items-center space-x-2">
            {loading ? null : isAuthenticated ? (
                <>
                    <Button variant="outline" asChild>
                        <Link href="/flow">Dashboard</Link>
                    </Button>
                    <UserNav />
                </>
            ) : (
              <>
                <Button asChild>
                  <Link href="/login">Login</Link>
                </Button>
              </>
            )}
          </div>
        </div>
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <div className="flex flex-col space-y-4 p-4">
                <Link href="/" className="flex items-center gap-2 mb-4">
                     <Rocket className="h-8 w-8 text-primary" />
                     <span className="font-headline text-2xl font-bold">Tech Lab</span>
                </Link>
                {navLinks.map((link) => (
                    <Link
                    key={link.href}
                    href={link.href}
                    className="text-lg font-medium"
                    >
                    {link.label}
                    </Link>
                ))}
                 <div className="border-t pt-4">
                    {loading ? null : isAuthenticated ? (
                        <div className="flex flex-col space-y-2">
                            <Button variant="outline" asChild><Link href="/flow">Dashboard</Link></Button>
                            <UserNav />
                        </div>
                    ) : (
                    <div className="flex flex-col space-y-2">
                        <Button asChild>
                            <Link href="/login">Login</Link>
                        </Button>
                    </div>
                    )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
