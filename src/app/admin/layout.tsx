"use client";

import Link from "next/link";
import React from "react";
import { usePathname } from 'next/navigation';
import { 
    LayoutDashboard, Users, ClipboardCheck, Briefcase, Columns, Cpu, Server, AreaChart, FileText, Shield, Menu, Bell, HelpCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdminUserNav } from "@/components/layout/AdminUserNav";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import Image from "next/image";

const navItems = [
    { href: "/admin", label: "Visão Geral", icon: <LayoutDashboard /> },
    { href: "/admin/clientes", label: "Clientes", icon: <Users /> },
    { href: "/admin/diagnosticos", label: "Diagnósticos", icon: <ClipboardCheck /> },
    { href: "/admin/consultorias", label: "Consultorias", icon: <Briefcase /> },
    { href: "/admin/paineis-clientes", label: "Painéis dos Clientes", icon: <Columns /> },
    { href: "/admin/ia-automacao", label: "IA & Automação", icon: <Cpu /> },
    { href: "/admin/tech-lab", label: "Tech Lab", icon: <Server /> },
    { href: "/admin/financeiro", label: "Financeiro", icon: <AreaChart /> },
    { href: "/admin/conteudo-templates", label: "Conteúdo & Templates", icon: <FileText /> },
    { href: "/admin/usuarios-internos", label: "Usuários Internos", icon: <Shield /> },
];

function AdminSidebarNav() {
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
                    {React.cloneElement(item.icon, { className: "h-4 w-4"})}
                    {item.label}
                </Link>
            ))}
        </nav>
    );
}

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="grid min-h-screen w-full md:grid-cols-[240px_1fr]">
            <aside className="hidden border-r bg-muted/40 md:block">
                <div className="flex h-full max-h-screen flex-col gap-2">
                    <div className="flex h-16 items-center border-b px-6">
                        <Link href="/admin" className="flex items-center gap-2 font-semibold">
                            <Image src="/logotech.png" alt="Tech Lab Logo" width={36} height={36} className="h-9 w-auto" />
                        </Link>
                    </div>
                    <div className="flex-1 overflow-auto py-4">
                        <AdminSidebarNav />
                    </div>
                </div>
            </aside>
            <div className="flex flex-col">
                <header className="flex h-16 items-center gap-4 border-b bg-background px-6 sticky top-0 z-10">
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
                        <SheetContent side="left" className="flex flex-col p-0 w-64">
                           <div className="flex h-16 shrink-0 items-center border-b px-6">
                                <Link href="/admin" className="flex items-center gap-2">
                                    <Image src="/logotech.png" alt="Tech Lab Logo" width={36} height={36} className="h-9 w-auto" />
                                </Link>
                            </div>
                           <div className="flex-1 overflow-y-auto py-4">
                                <AdminSidebarNav />
                           </div>
                        </SheetContent>
                    </Sheet>

                    <div className="w-full flex-1" />

                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
                            <Bell className="h-4 w-4" />
                            <span className="sr-only">Toggle notifications</span>
                        </Button>
                        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
                            <HelpCircle className="h-4 w-4" />
                            <span className="sr-only">Help</span>
                        </Button>
                        <AdminUserNav />
                    </div>
                </header>
                <div className="flex flex-1 flex-col overflow-hidden">
                    <main className="flex-1 overflow-y-auto p-6 bg-gray-50/50">
                        {children}
                    </main>
                </div>
                <footer className="h-12 border-t p-4 flex items-center justify-center text-sm text-muted-foreground bg-background shrink-0">
                    TECH LAB © 2026
                </footer>
            </div>
        </div>
    );
}
