
"use client";

import Link from "next/link";
import { usePathname } from 'next/navigation';
import { 
    LayoutDashboard, ClipboardCheck, GitFork, FileText, Briefcase, Menu,
    DraftingCompass, Server, Cpu, Shield, HelpCircle, Rocket
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserNav } from "@/components/layout/UserNav";
import React from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { DashboardProvider, useDashboard } from "@/contexts/DashboardContext";
import { Skeleton } from "@/components/ui/skeleton";

interface DashboardLayoutBaseProps {
    children: React.ReactNode;
    sidebarContent: React.ReactNode;
    headerRightContent: React.ReactNode;
    logoLink: string;
}

export function DashboardLayoutBase({
    children,
    sidebarContent,
    headerRightContent,
    logoLink,
}: DashboardLayoutBaseProps) {
    return (
       <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
            <div className="hidden border-r bg-muted/40 md:block">
                <div className="flex h-full max-h-screen flex-col gap-2">
                    <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
                        <Link href={logoLink} className="flex items-center gap-2 font-semibold">
                            <Rocket className="h-8 w-8 text-primary" />
                            <span className="font-headline text-lg">Tech Lab</span>
                        </Link>
                    </div>
                    <div className="flex-1">
                        {sidebarContent}
                    </div>
                </div>
            </div>
             <div className="flex flex-col">
                <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
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
                        <SheetContent side="left" className="flex flex-col">
                            {sidebarContent}
                        </SheetContent>
                    </Sheet>
                    <div className="w-full flex-1" />
                    {headerRightContent}
                </header>
                <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-gray-50/50">
                   {children}
                </main>
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
            <div className="grid items-start px-2 text-sm font-medium lg:px-4 gap-1">
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
       <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
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
             <span className="text-sm font-medium hidden sm:block">Bem-vindo, {user?.nome}</span>
            <UserNav />
        </div>
    );

    return (
        <DashboardLayoutBase
            logoLink="/"
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
