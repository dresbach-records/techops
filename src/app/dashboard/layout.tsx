"use client";

import Link from "next/link";
import { usePathname } from 'next/navigation';
import { AuthGuard } from "@/components/auth/AuthGuard";
import { SidebarProvider, Sidebar, SidebarHeader, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, useSidebar } from "@/components/ui/sidebar";
import { LayoutDashboard, ClipboardCheck, GitFork, FileText, Briefcase, PanelLeft, Menu, Bell, HelpCircle, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserNav } from "@/components/layout/UserNav";
import React from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const navItems = [
    { href: "/dashboard", label: "Visão Geral", icon: <LayoutDashboard /> },
    { href: "/dashboard/diagnostico", label: "Diagnóstico Técnico", icon: <ClipboardCheck /> },
    { href: "/dashboard/roadmap", label: "Roadmap", icon: <GitFork /> },
    { href: "/dashboard/consultoria", label: "Consultoria", icon: <Briefcase /> },
    { href: "/dashboard/documentos", label: "Documentos", icon: <FileText /> },
];

function DashboardLayoutContent({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const { open, setOpen } = useSidebar();
    const state = open ? 'expanded' : 'collapsed';

    const sidebarContent = (
         <>
            <SidebarHeader className="group-data-[state=collapsed]:hidden justify-between">
                <Link href="/" className="flex items-center gap-3 p-4">
                    <div className="bg-primary h-8 w-8 rounded-md flex items-center justify-center">
                       <Shield className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <span className="font-headline text-lg font-semibold text-primary-foreground">Tech Lab</span>
                </Link>
            </SidebarHeader>
            <SidebarContent>
                <SidebarMenu>
                    {navItems.map((item) => (
                        <SidebarMenuItem key={item.href}>
                            <SidebarMenuButton
                                asChild
                                isActive={pathname === item.href}
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
             <footer className="mt-auto border-t border-sidebar-border p-4 group-data-[state=collapsed]:hidden">
                <div className="text-center text-xs text-muted-foreground">
                    <p>© 2024 Tech Lab</p>
                </div>
            </footer>
        </>
    );

    return (
        <>
            <aside 
                data-state={state} 
                data-collapsible={"icon"}
                className={cn(
                    "hidden md:flex flex-col bg-sidebar border-r transition-[width] duration-300 group overflow-y-auto",
                    state === 'expanded' ? 'w-64' : 'w-[60px]'
                )}
            >
                {sidebarContent}
            </aside>

            <div className="flex-1 flex flex-col min-h-screen">
                <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
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
                        <SheetContent side="left" className="flex flex-col p-0 bg-sidebar">
                           <div className="flex h-full flex-col group" data-state="expanded">
                                {sidebarContent}
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
                         <Button variant="ghost" size="icon" className="h-8 w-8">
                            <HelpCircle className="h-4 w-4" />
                        </Button>
                        <UserNav />
                    </div>
                </header>
                <main className="flex-1 p-4 md:p-6 lg:p-8 bg-muted/40 overflow-y-auto">
                    {children}
                </main>
                 <footer className="p-4 border-t text-center text-xs text-muted-foreground bg-background">
                    © 2024 Tech Lab | <Link href="/privacidade" className="hover:underline">Política de Privacidade</Link> | <Link href="/termos-de-servico" className="hover:underline">Termos de Serviço</Link> | <Link href="/privacidade" className="hover:underline">Exclusão de Dados do Usuário</Link>
                </footer>
            </div>
        </>
    );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        // <AuthGuard access="paid">
            <SidebarProvider>
                <div className="flex min-h-screen">
                    <DashboardLayoutContent>{children}</DashboardLayoutContent>
                </div>
            </SidebarProvider>
        // </AuthGuard>
    );
}
