"use client";

import Link from "next/link";
import { usePathname } from 'next/navigation';
import { LayoutDashboard, ClipboardCheck, GitFork, FileText, Briefcase, Menu, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserNav } from "@/components/layout/UserNav";
import React from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import Image from "next/image";

const navItems = [
    { href: "/dashboard", label: "Visão Geral", icon: <LayoutDashboard /> },
    { href: "/dashboard/diagnostico", label: "Diagnóstico Técnico", icon: <ClipboardCheck /> },
    { href: "/dashboard/roadmap", label: "Roadmap", icon: <GitFork /> },
    { href: "/dashboard/consultoria", label: "Consultoria", icon: <Briefcase /> },
    { href: "/dashboard/documentos", label: "Documentos", icon: <FileText /> },
];

function ClientSidebarNav() {
    const pathname = usePathname();
    return (
       <nav className="flex flex-col gap-2 p-4">
            {navItems.map((item) => (
                <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-all hover:bg-muted hover:text-primary",
                        pathname === item.href && "bg-muted text-primary"
                    )}
                >
                    {React.cloneElement(item.icon, { className: "h-5 w-5" })}
                    {item.label}
                </Link>
            ))}
        </nav>
    );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
         <div className="flex flex-col min-h-screen">
             <header className="flex h-16 items-center border-b bg-background px-4 md:px-6 shrink-0">
                <Sheet>
                    <SheetTrigger asChild>
                        <Button
                            variant="outline"
                            size="icon"
                            className="shrink-0 md:hidden"
                        >
                            <Menu className="h-5 w-5" />
                            <span className="sr-only">Toggle navigation menu</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="flex flex-col p-0">
                       <ClientSidebarNav />
                    </SheetContent>
                </Sheet>
                 <div className="hidden md:block">
                     <Link href="/" className="flex items-center gap-2">
                        <Image src="/logotech.png" alt="Tech Lab Logo" width={36} height={36} className="h-9 w-auto" />
                    </Link>
                </div>

                <div className="ml-auto flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Bell className="h-4 w-4" />
                    </Button>
                    <UserNav />
                </div>
            </header>

            <div className="flex flex-1">
                 <aside className="hidden w-64 border-r bg-muted md:block">
                    <ClientSidebarNav />
                </aside>

                <main className="flex-1 p-6 bg-gray-50">
                    {children}
                </main>
            </div>
            
            <footer className="h-12 border-t p-4 flex items-center justify-center text-sm text-muted-foreground bg-background shrink-0">
                TECH LAB © 2026
            </footer>
        </div>
    );
}
