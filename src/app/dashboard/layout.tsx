"use client";

import Link from "next/link";
import { usePathname } from 'next/navigation';
import { LayoutDashboard, ClipboardCheck, GitFork, FileText, Briefcase, Menu, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserNav } from "@/components/layout/UserNav";
import React, { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DashboardLayoutBaseProps {
    children: React.ReactNode;
    sidebarContent: React.ReactNode;
    headerRightContent: React.ReactNode;
    logoLink: string;
    logoText: string;
}

export function DashboardLayoutBase({
    children,
    sidebarContent,
    headerRightContent,
    logoLink,
    logoText,
}: DashboardLayoutBaseProps) {
    return (
        <div className="relative min-h-screen">
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 flex h-16 items-center justify-between border-b bg-white px-6 z-30">
                 <div className="flex items-center gap-4">
                    <Link href={logoLink} className="flex items-center gap-2 font-semibold">
                        <Image src="/logotech.png" alt="Tech Lab Logo" width={36} height={36} className="h-9 w-auto" />
                    </Link>
                    <div className="md:hidden">
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="outline" size="icon" className="shrink-0">
                                    <Menu className="h-5 w-5" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left" className="flex flex-col p-0 w-64 bg-white">
                               <div className="flex h-16 shrink-0 items-center border-b px-6">
                                    <Link href={logoLink} className="flex items-center gap-2 font-semibold">
                                        <Image src="/logotech.png" alt="Tech Lab Logo" width={32} height={32} className="h-8 w-auto" />
                                        <span className="font-headline text-lg">{logoText}</span>
                                    </Link>
                                </div>
                               <div className="flex-1 overflow-y-auto py-4">
                                    {sidebarContent}
                               </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
                {headerRightContent}
            </header>
            
            {/* Sidebar */}
            <aside className="fixed top-16 bottom-12 left-0 z-20 hidden w-60 flex-col border-r bg-white md:flex">
                 <div className="h-full overflow-y-auto py-4">
                    {sidebarContent}
                </div>
            </aside>
            
            {/* Main Content */}
            <div className="md:pl-60">
                 <main className="pt-16 pb-12">
                     <div className="p-6 bg-gray-50/50 min-h-[calc(100vh-8rem)]">
                        {children}
                    </div>
                </main>
            </div>

            {/* Footer */}
            <footer className="fixed bottom-0 left-0 right-0 flex h-12 items-center justify-center border-t bg-white z-30">
                 <p className="text-center text-sm text-muted-foreground">TECH LAB © 2026</p>
            </footer>
        </div>
    );
}

const navItems = [
    { href: "/dashboard", label: "Visão Geral", icon: <LayoutDashboard /> },
    { href: "/dashboard/diagnostico", label: "Diagnóstico Técnico", icon: <ClipboardCheck /> },
    { href: "/dashboard/roadmap", label: "Roadmap", icon: <GitFork /> },
    { href: "/dashboard/consultoria", label: "Consultoria", icon: <Briefcase /> },
    { href: "/dashboard/documentos", label: "Documentos", icon: <FileText /> },
];

function ClientSidebarNav() {
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
                    {React.cloneElement(item.icon, { className: "h-4 w-4" })}
                    {item.label}
                </Link>
            ))}
        </nav>
    );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const { user } = useAuth();
    const [hasNotification, setHasNotification] = useState(false);
    const [playSound, setPlaySound] = useState(false);

    useEffect(() => {
        if (user?.payment_pending_boleto) {
            setHasNotification(true);
            setPlaySound(true); 
        }
    }, [user]);

    useEffect(() => {
        if (playSound) {
            const audio = new Audio('/notification.mp3'); // Assumes file is in /public/notification.mp3
            audio.play().catch(e => console.error("Error playing sound:", e));
            setPlaySound(false); // Play only once
        }
    }, [playSound]);

    const headerRightContent = (
        <div className="flex items-center gap-2">
             <span className="text-sm font-medium hidden sm:block">Bem-vindo, {user?.name}</span>
             <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 relative">
                        <Bell className="h-4 w-4" />
                        {hasNotification && (
                            <span className="absolute top-1 right-1 flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                            </span>
                        )}
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                    <DropdownMenuLabel>Notificações</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {user?.payment_pending_boleto ? (
                        <DropdownMenuItem className="flex-col items-start gap-1 cursor-pointer">
                            <p className="font-semibold">Pagamento Pendente</p>
                            <p className="text-xs text-muted-foreground">Você tem um boleto para pagar.</p>
                            <Button size="sm" className="mt-2 w-full" asChild><Link href="/pagamento">Pagar agora</Link></Button>
                        </DropdownMenuItem>
                    ) : (
                         <DropdownMenuItem>
                            <p className="text-sm text-muted-foreground p-4 text-center w-full">Nenhuma notificação nova.</p>
                        </DropdownMenuItem>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>
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
