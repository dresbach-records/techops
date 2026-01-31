"use client";

import Link from "next/link";
import { usePathname } from 'next/navigation';
import { SidebarProvider, useSidebar, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
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


function ClientSidebarContent() {
    const pathname = usePathname();
    return (
        <SidebarContent className="pt-6">
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
    );
}


function DashboardLayoutContent({ children }: { children: React.ReactNode }) {
    const { open } = useSidebar();
    const state = open ? 'expanded' : 'collapsed';

    return (
         <div className="flex flex-col h-screen bg-background">
             <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-4 border-b bg-background px-4 md:px-6">
                <Link href="/" className="mr-4 flex items-center gap-2">
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
                            <ClientSidebarContent />
                        </div>
                    </SheetContent>
                </Sheet>

                <div className="w-full flex-1 flex items-center justify-end gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Bell className="h-4 w-4" />
                    </Button>
                    <UserNav />
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden">
                 <aside 
                    data-state={state} 
                    data-collapsible={"icon"}
                    className={cn(
                        "hidden md:flex flex-col bg-muted border-r transition-[width] duration-300 group overflow-y-auto",
                        state === 'expanded' ? 'w-64' : 'w-[60px]'
                    )}
                >
                    <ClientSidebarContent />
                </aside>

                <main className="flex-1 p-4 md:p-6 lg:p-8 bg-muted/40 overflow-y-auto">
                    {children}
                </main>
            </div>
            
            <footer className="h-12 border-t p-4 flex items-center justify-center text-sm text-muted-foreground bg-background shrink-0">
                TECH LAB © 2026
            </footer>
        </div>
    );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        // <AuthGuard access="paid">
            <SidebarProvider defaultOpen={false}>
                <DashboardLayoutContent>{children}</DashboardLayoutContent>
            </SidebarProvider>
        // </AuthGuard>
    );
}
