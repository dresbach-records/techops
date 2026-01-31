"use client";

import Link from "next/link";
import React from "react";
import { usePathname } from 'next/navigation';
import { SidebarProvider, Sidebar, SidebarHeader, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarFooter } from "@/components/ui/sidebar";
import { 
    LayoutDashboard, Users, ClipboardCheck, Briefcase, Columns, Cpu, Server, AreaChart, FileText, Shield, PanelLeft, Menu, Bell, HelpCircle, Power
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdminUserNav } from "@/components/layout/AdminUserNav";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

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

function AdminDashboardLayoutContent({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    const sidebarContent = (
         <>
            <SidebarHeader>
                <Link href="/admin" className="flex items-center gap-2 p-4">
                    <Menu className="h-6 w-6" />
                    <h1 className="text-xl font-bold text-primary font-headline">TECH LAB</h1>
                </Link>
            </SidebarHeader>
            <SidebarContent>
                <SidebarMenu>
                    {navItems.map((item) => (
                        <SidebarMenuItem key={item.href}>
                            <SidebarMenuButton
                                asChild
                                isActive={pathname === item.href}
                                className="justify-start"
                            >
                                <Link href={item.href}>
                                    {item.icon}
                                    <span>{item.label}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarContent>
            <SidebarFooter>
                <div className="text-xs text-sidebar-foreground/50 p-4">
                    TECH LAB © 2024
                </div>
            </SidebarFooter>
        </>
    );

    return (
        <SidebarProvider>
            <Sidebar collapsible="icon" className="hidden md:flex">
               {sidebarContent}
            </Sidebar>

            <div className="flex-1 flex flex-col">
                <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button
                                variant="outline"
                                size="icon"
                                className="shrink-0 md:hidden"
                            >
                                <PanelLeft className="h-5 w-5" />
                                <span className="sr-only">Toggle navigation menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="flex flex-col p-0">
                           <Sidebar className="flex h-full">
                                {sidebarContent}
                           </Sidebar>
                        </SheetContent>
                    </Sheet>
                    <div className="w-full flex-1 flex items-center justify-end gap-4">
                        <Button variant="ghost" size="sm" className="gap-2">
                            <Bell className="h-4 w-4" />
                            Notificações
                        </Button>
                        <Button variant="ghost" size="sm" className="gap-2">
                           <HelpCircle className="h-4 w-4" />
                           Ajuda
                        </Button>
                        <AdminUserNav />
                    </div>
                </header>
                <main className="flex-1 p-4 md:p-6 lg:p-8 bg-muted">
                    {children}
                </main>
            </div>
        </SidebarProvider>
    );
}

// For now, we allow access to the admin dashboard to facilitate development.
// A real app would have a dedicated AuthGuard for admins.
export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <AdminDashboardLayoutContent>{children}</AdminDashboardLayoutContent>
    );
}
