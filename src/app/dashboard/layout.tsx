"use client";

import Link from "next/link";
import { usePathname } from 'next/navigation';
import { 
    LayoutDashboard, ClipboardCheck, GitFork, FileText, Briefcase, Menu, Bell,
    DraftingCompass, Server, Cpu, Shield, HelpCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserNav } from "@/components/layout/UserNav";
import React, { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import { DashboardProvider, useDashboard } from "@/contexts/DashboardContext";
import { Skeleton } from "@/components/ui/skeleton";

interface DashboardLayoutBaseProps {
    children: React.ReactNode;
    sidebarContent: React.ReactNode;
    headerRightContent: React.ReactNode;
    logoLink: string;
    logoText: string; // This prop is now unused as per the roadmap.
}

export function DashboardLayoutBase({
    children,
    sidebarContent,
    headerRightContent,
    logoLink,
}: DashboardLayoutBaseProps) {
    return (
       <div className="flex h-screen">
            {/* Desktop Sidebar */}
            <aside className="hidden w-64 flex-col border-r bg-white md:flex">
                <div className="flex h-16 items-center border-b px-6">
                    <Link href={logoLink}>
                        <Image src="/logotech.png" alt="Tech Lab Logo" width={36} height={36} className="h-9 w-auto" />
                    </Link>
                </div>
                <div className="flex-1 overflow-y-auto py-4">
                    {sidebarContent}
                </div>
            </aside>

            {/* Main content area */}
            <div className="flex flex-1 flex-col">
                {/* Header */}
                <header className="flex h-16 shrink-0 items-center justify-between gap-4 border-b bg-white px-6">
                    <div className="md:hidden">
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="outline" size="icon" className="shrink-0">
                                    <Menu className="h-5 w-5" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left" className="flex flex-col p-0 w-64 bg-white">
                                {/* Mobile sidebar content */}
                                <div className="flex h-16 items-center border-b px-6">
                                    <Link href={logoLink}>
                                        <Image src="/logotech.png" alt="Tech Lab Logo" width={36} height={36} className="h-9 w-auto" />
                                    </Link>
                                </div>
                                <div className="flex-1 overflow-y-auto py-4">
                                    {sidebarContent}
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                    {/* Spacer for mobile */}
                    <div className="flex-1 md:hidden" />
                    {headerRightContent}
                </header>
                
                {/* Main + Footer scrollable area */}
                <div className="flex-1 overflow-y-auto">
                    <main className="p-6 bg-gray-50/50 min-h-[calc(100vh-8rem)]">
                        {children}
                    </main>
                    <footer className="flex h-12 items-center justify-center border-t bg-white">
                        <p className="text-center text-sm text-muted-foreground">TECH LAB © 2026</p>
                    </footer>
                </div>
            </div>
        </div>
    );
}

// All available nav items map
const ALL_NAV_ITEMS: { [key: string]: { href: string; label: string; icon: React.ReactNode } } = {
    'visao-geral': { href: "/dashboard", label: "Visão Geral", icon: <LayoutDashboard /> },
    'diagnostico': { href: "/dashboard/diagnostico", label: "Diagnóstico Técnico", icon: <ClipboardCheck /> },
    'roadmap': { href: "/dashboard/roadmap", label: "Roadmap", icon: <GitFork /> },
    'arquitetura': { href: "/dashboard/arquitetura", label: "Arquitetura", icon: <DraftingCompass /> },
    'tech-ops': { href: "/dashboard/tech-ops", label: "Tech Ops", icon: <Server /> },
    'ia': { href: "/dashboard/ia", label: "IA e Automação", icon: <Cpu /> },
    'seguranca': { href: "/dashboard/seguranca", label: "Segurança", icon: <Shield /> },
    'consultoria': { href: "/dashboard/consultoria", label: "Consultoria", icon: <Briefcase /> },
    'documentos': { href: "/dashboard/documentos", label: "Documentos", icon: <FileText /> },
    'suporte': { href: "/dashboard/suporte", label: "Suporte", icon: <HelpCircle /> },
};


function ClientSidebarNav() {
    const pathname = usePathname();
    const { dashboardData, loading } = useDashboard();

    if (loading) {
        return (
            <div className="grid items-start px-4 text-sm font-medium gap-1">
                {[...Array(6)].map((_, i) => (
                    <Skeleton key={i} className="h-10 w-full" />
                ))}
            </div>
        );
    }
    
    const navItems = dashboardData?.modules
        ?.map(key => ALL_NAV_ITEMS[key])
        .filter(Boolean) ?? [];

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
                    {React.cloneElement(item.icon as React.ReactElement, { className: "h-4 w-4" })}
                    {item.label}
                </Link>
            ))}
        </nav>
    );
}

function DashboardLayoutContent({ children }: { children: React.ReactNode }) {
    const { user } = useAuth();

    const headerRightContent = (
        <div className="flex items-center gap-2">
             <span className="text-sm font-medium hidden sm:block">Bem-vindo, {user?.name}</span>
            <UserNav />
        </div>
    );

    return (
        <DashboardLayoutBase
            logoLink="/"
            logoText="Tech Lab"
            sidebarContent={<ClientSidebarNav />}
            headerRightContent={headerRightContent}
        >
            {children}
        </DashboardLayoutBase>
    );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <DashboardProvider>
            <DashboardLayoutContent>{children}</DashboardLayoutContent>
        </DashboardProvider>
    )
}
