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
import { useAuth } from "@/contexts/AuthContext";

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
       <nav className="grid items-start px-4 text-sm font-medium">
            {navItems.map((item) => (
                <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                        pathname === item.href && "bg-muted text-primary"
                    )}
                >
                    {React.cloneElement(item.icon, { className: "h-4 w-4" })}
                    {item.label}
                </Link>
            ))}
        </nav>
    );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const { user } = useAuth();
    return (
        <div className="min-h-screen bg-background">
            <header className="fixed top-0 left-0 right-0 flex h-16 shrink-0 items-center justify-between border-b bg-background px-6 z-50">
                 <div className="flex items-center gap-4">
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
                         <SheetContent side="left" className="flex flex-col p-0 w-64 bg-muted/40">
                            <div className="flex h-16 shrink-0 items-center border-b px-6">
                                <Link href="/">
                                    <Image src="/logotech.png" alt="Tech Lab Logo" width={32} height={32} className="h-8 w-auto" />
                                </Link>
                            </div>
                           <div className="flex-1 overflow-y-auto py-4">
                                <ClientSidebarNav />
                           </div>
                        </SheetContent>
                    </Sheet>
                     <Link href="/" className="flex items-center gap-2 font-semibold">
                        <Image src="/logotech.png" alt="Tech Lab Logo" width={36} height={36} className="h-9 w-auto" />
                    </Link>
                </div>
                
                <div className="flex items-center gap-2">
                     <span className="text-sm font-medium hidden sm:block">Bem-vindo, {user?.name}</span>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Bell className="h-4 w-4" />
                    </Button>
                    <UserNav />
                </div>
            </header>
            
            <aside className="fixed top-16 bottom-0 left-0 z-40 hidden w-60 flex-col border-r bg-muted/40 md:flex">
                <div className="flex-1 overflow-y-auto py-4">
                    <ClientSidebarNav />
                </div>
            </aside>
            
            <main className="md:pl-60 pt-16 pb-12">
                <div className="p-6 bg-gray-50/50">
                    {children}
                </div>
            </main>

            <footer className="fixed bottom-0 left-0 right-0 flex h-12 items-center justify-center border-t bg-background text-center text-sm text-muted-foreground z-50">
                TECH LAB © 2026
            </footer>
        </div>
    );
}