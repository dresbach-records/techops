"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from 'next/navigation';
import { SidebarProvider, Sidebar, SidebarHeader, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import { 
    LayoutDashboard, Users, ClipboardCheck, Briefcase, Columns, Cpu, Server, CircleDollarSign, FileText, Shield, Settings, PanelLeft 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserNav } from "@/components/layout/UserNav";
import React from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const navItems = [
    { href: "/admin", label: "Visão Geral", icon: <LayoutDashboard /> },
    { href: "/admin/clientes", label: "Clientes", icon: <Users /> },
    { href: "/admin/diagnosticos", label: "Diagnósticos", icon: <ClipboardCheck /> },
    { href: "/admin/consultorias", label: "Consultorias", icon: <Briefcase /> },
    { href: "/admin/paineis-clientes", label: "Painéis dos Clientes", icon: <Columns /> },
    { href: "/admin/ia-automacao", label: "IA & Automação", icon: <Cpu /> },
    { href: "/admin/tech-lab", label: "Tech Lab", icon: <Server /> },
    { href: "/admin/financeiro", label: "Financeiro", icon: <CircleDollarSign /> },
    { href: "/admin/conteudo-templates", label: "Conteúdo & Templates", icon: <FileText /> },
    { href: "/admin/usuarios-internos", label: "Usuários Internos", icon: <Shield /> },
    { href: "/admin/configuracoes", label: "Configurações", icon: <Settings /> },
];

function AdminDashboardLayoutContent({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    const sidebarContent = (
         <>
            <SidebarHeader>
                <Link href="/admin" className="flex items-center justify-center p-2">
                    <Image src="/logotech.png" alt="Tech Lab Logo" width={500} height={500} className="size-20" />
                </Link>
            </SidebarHeader>
            <SidebarContent>
                <SidebarMenu>
                    {navItems.map((item) => (
                        <SidebarMenuItem key={item.href}>
                            <SidebarMenuButton
                                asChild
                                isActive={pathname === item.href}
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
        </>
    );

    return (
        <SidebarProvider>
            <Sidebar collapsible="icon" className="hidden md:flex">
               {sidebarContent}
            </Sidebar>

            <div className="flex-1 flex flex-col">
                <header className="sticky top-0 z-40 flex h-14 items-center gap-4 border-b bg-background px-4 md:px-6">
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
                    <div className="w-full flex-1">
                       <h1 className="font-semibold text-lg">Painel Administrativo Tech Lab</h1>
                    </div>
                    <UserNav />
                </header>
                <main className="flex-1 p-4 md:p-6 lg:p-8 bg-muted/40">
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
