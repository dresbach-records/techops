"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from 'next/navigation';
import { AuthGuard } from "@/components/auth/AuthGuard";
import { SidebarProvider, Sidebar, SidebarHeader, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import { LayoutDashboard, ClipboardCheck, GitFork, FileText, MessageSquare, PanelLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserNav } from "@/components/layout/UserNav";
import { ChatWidget } from "@/components/layout/ChatWidget";
import React from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const navItems = [
    { href: "/dashboard", label: "Visão Geral", icon: <LayoutDashboard /> },
    { href: "/dashboard/diagnostico", label: "Diagnóstico", icon: <ClipboardCheck /> },
    { href: "/dashboard/roadmap", label: "Roadmap", icon: <GitFork /> },
    { href: "/dashboard/documentos", label: "Documentos", icon: <FileText /> },
    { href: "/dashboard/suporte", label: "Suporte", icon: <MessageSquare /> },
];

function DashboardLayoutContent({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    const sidebarContent = (
         <>
            <SidebarHeader>
                <Link href="/" className="flex items-center justify-center p-2">
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
                        {/* Can add breadcrumbs or search here */}
                    </div>
                    <UserNav />
                </header>
                <main className="flex-1 p-4 md:p-6 lg:p-8 bg-muted/40">
                    {children}
                </main>
            </div>
            <ChatWidget />
        </SidebarProvider>
    );
}

// The AuthGuard will be re-enabled once the new authentication flow is complete.
// For now, we allow access to the dashboard to facilitate development.
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        // <AuthGuard access="paid">
            <DashboardLayoutContent>{children}</DashboardLayoutContent>
        // </AuthGuard>
    );
}
