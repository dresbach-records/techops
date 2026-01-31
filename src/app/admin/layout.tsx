"use client";

import Link from "next/link";
import React from "react";
import { usePathname } from 'next/navigation';
import { 
    SidebarProvider, 
    useSidebar,
    SidebarContent, 
    SidebarMenu, 
    SidebarMenuItem, 
    SidebarMenuButton, 
    SidebarFooter 
} from "@/components/ui/sidebar";
import { 
    LayoutDashboard, Users, ClipboardCheck, Briefcase, Columns, Cpu, Server, AreaChart, FileText, Shield, PanelLeft, Menu, Bell
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

function AdminSidebarContent() {
    const pathname = usePathname();
    
    return (
        <>
            <SidebarContent className="pt-6">
                <SidebarMenu>
                    {navItems.map((item) => (
                        <SidebarMenuItem key={item.href}>
                            <SidebarMenuButton
                                asChild
                                isActive={pathname === item.href}
                                className="justify-start"
                                tooltip={{children: item.label}}
                            >
                                <Link href={item.href}>
                                    {item.icon}
                                    <span className="group-data-[state=collapsed]:hidden">{item.label}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarContent>
        </>
    )
}

function AdminDashboardLayoutContent({ children }: { children: React.ReactNode }) {
    const { open, setOpen } = useSidebar();
    const state = open ? 'expanded' : 'collapsed';

    return (
        <div className="flex flex-col h-screen bg-background">
            <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-4 border-b bg-background px-4 md:px-6">
                 <Link href="/admin" className="mr-4 flex items-center gap-2">
                    <Image src="/logotech.png" alt="Tech Lab Logo" width={36} height={36} className="hidden h-9 w-auto md:block" />
                    <Image src="/logotech.png" alt="Tech Lab Logo" width={30} height={30} className="block h-[30px] w-auto md:hidden" />
                </Link>

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
                    <SheetContent side="left" className="flex flex-col p-0 bg-muted">
                        <div className="flex h-full flex-col group" data-state="expanded">
                           <AdminSidebarContent />
                        </div>
                    </SheetContent>
                </Sheet>
                 <Button
                    variant="ghost"
                    size="icon"
                    className="hidden md:flex"
                    onClick={() => setOpen(!open)}
                >
                    <PanelLeft className="h-5 w-5" />
                </Button>
                <div className="w-full flex-1 flex items-center justify-end gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Bell className="h-4 w-4" />
                    </Button>
                    <AdminUserNav />
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden">
                <aside 
                    data-state={state} 
                    data-collapsible={state === "collapsed" ? "icon" : undefined}
                    className={cn(
                        "hidden md:flex flex-col bg-muted border-r transition-[width] duration-300 group overflow-y-auto",
                        state === 'expanded' ? 'w-64' : 'w-[60px]'
                    )}
                >
                    <AdminSidebarContent />
                </aside>

                <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto">
                    {children}
                </main>
            </div>

            <footer className="h-12 border-t p-4 flex items-center justify-center text-sm text-muted-foreground bg-background shrink-0">
                TECH LAB © 2026
            </footer>
        </div>
    );
}

// Wrapper to provide context, so useSidebar can be used in AdminDashboardLayoutContent
export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
    // For now, we allow access to the admin dashboard to facilitate development.
    // A real app would have a dedicated AuthGuard for admins.
    return (
        <SidebarProvider>
            <AdminDashboardLayoutContent>{children}</AdminDashboardLayoutContent>
        </SidebarProvider>
    );
}
