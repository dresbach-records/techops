"use client";

import Link from "next/link";
import React from "react";
import { usePathname } from 'next/navigation';
import { 
    LayoutDashboard, Users, ClipboardCheck, Briefcase, Columns, Cpu, Server, AreaChart, FileText, Shield, Bell, HelpCircle
} from "lucide-react";
import { AdminUserNav } from "@/components/layout/AdminUserNav";
import { DashboardLayoutBase } from "@/app/dashboard/layout";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

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
    const headerRightContent = (
        <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
                <Bell className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
                <HelpCircle className="h-4 w-4" />
            </Button>
            <AdminUserNav />
        </div>
    );
    
    return (
        <DashboardLayoutBase
            logoLink="/admin"
            logoText="Tech Lab"
            sidebarContent={<AdminSidebarNav />}
            headerRightContent={headerRightContent}
        >
            {children}
        </DashboardLayoutBase>
    );
}
