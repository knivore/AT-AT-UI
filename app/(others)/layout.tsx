'use client';

import {FileCog, Globe, LayoutDashboard, LogOut, Mail, Menu, ShieldCheck} from 'lucide-react';
import {Sheet, SheetContent, SheetTrigger} from '@/components/ui/sheet';
import {Analytics} from '@vercel/analytics/react';
import {TooltipProvider} from '@/components/ui/tooltip';
import {NavItem} from '@/components/ui/nav_item';
import {SearchInput} from './dashboard/search';
import React, {useEffect, useState} from "react";
import {Spinner} from "@/components/ui/icons";
import {getSession} from "next-auth/react";
import {useRouter} from "next/navigation";
import {User} from "@/app/(others)/user";
import {handleLogout} from "@/app/(others)/logout";

export default function AppLayout({children}: {
    children: React.ReactNode;
}) {
    const [isNavOpen, setIsNavOpen] = useState(true);
    const [session, setSession] = useState(null);
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const checkSession = async () => {
            const session = await getSession();
            if (session) {
                setIsAuthenticated(true);
                setSession(session);
            } else {
                router.push("/api/auth/signin");
            }
        };

        checkSession().then(r => r);
    }, [router]);

    // Handle loading state
    if (!isAuthenticated) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Spinner/>
            </div>
        );
    }

    const toggleNav = () => {
        setIsNavOpen(!isNavOpen);
    };

    return (
        <TooltipProvider>
            <main className="flex min-h-[calc(100vh-100px)] w-full flex-col bg-muted/40">
                <DesktopNav isOpen={isNavOpen} toggleNav={toggleNav}/>
                <div className={`flex flex-col sm:pl-14 transition-all duration-300 ease-in-out
                    ${isNavOpen ? 'sm:ml-52' : 'ml-0'}`}>
                    <header
                        className="sticky top-0 z-30 flex sm:py-4 h-14 items-center justify-between border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
                        <div className="flex items-center gap-4">
                            <img
                                src="/images/project_mata.png"
                                alt="Project MATA"
                                className="h-10 w-10"
                            />
                            <div className="text-base sm:text-lg md:text-xl lg:text-4xl font-semibold text-primary">
                                Project MATA
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <SearchInput/>

                            <div className="hidden sm:flex">
                                <User/>
                            </div>
                            <MobileNav/>
                        </div>
                    </header>
                    <main className="grid flex-1 items-start gap-2 p-4 sm:px-6 sm:py-0 md:gap-4 bg-muted/40">
                        {children}
                    </main>
                </div>
                <Analytics/>
            </main>
        </TooltipProvider>
    );
}


function DesktopNav({isOpen, toggleNav}) {
    return (
        <aside
            className={`fixed inset-y-0 left-0 z-20 hidden flex-col border-r bg-background transition-all duration-300
                ${isOpen ? 'w-64' : 'w-16'} sm:flex`}>
            <nav className="flex flex-col items-start gap-4 px-4 py-6 pt-14">
                <NavItem href="/dashboard" label="Dashboard" isDrawerOpen={isOpen}>
                    <LayoutDashboard className="h-6 w-6 text-primary"/>
                </NavItem>

                <NavItem href="/test_execution" label="Test Execution" isDrawerOpen={isOpen}>
                    <FileCog className="h-6 w-6 text-primary"/>
                </NavItem>

                <NavItem href="/web_scraper" label="Web Scraper" isDrawerOpen={isOpen}>
                    <Globe className="h-6 w-6 text-primary"/>
                </NavItem>

                <NavItem href="/pen_test" label="Penetration Test" isDrawerOpen={isOpen}>
                    <ShieldCheck className="h-6 w-6 text-primary"/>
                </NavItem>
            </nav>

            <nav className="mt-auto flex flex-col items-end gap-4 px-4 py-6">
                <button onClick={toggleNav}
                        className="flex w-full justify-end p-2 rounded hover:bg-muted">
                    <span className="sr-only">{isOpen ? "Collapse" : "Expand"} Drawer</span>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={`h-6 w-6 transition-transform ${isOpen ? "" : "rotate-180"}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
                    </svg>
                </button>
            </nav>
        </aside>
    );
}

function MobileNav() {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const toggleDrawer = () => setIsDrawerOpen((prev) => !prev);
    const router = useRouter();

    return (
        <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
            <SheetTrigger asChild>
                <button onClick={toggleDrawer}
                        className="sm:hidden flex items-center justify-center p-2 rounded hover:bg-muted">
                    <Menu className="h-5 w-5"/>
                    <span className="sr-only">Toggle Menu</span>
                </button>
            </SheetTrigger>

            <SheetContent side="left" hideCloseButton
                          className={`sm:max-w-xs p-0 ${isDrawerOpen ? "w-52" : "w-16"} transition-all`}>
                <nav className="flex flex-col gap-6 h-full px-3 pt-10" onClick={toggleDrawer}>
                    <div className="flex flex-col gap-3">
                        <NavItem href="/dashboard" label="Dashboard" isDrawerOpen={isDrawerOpen}>
                            <LayoutDashboard className="h-6 w-6 text-primary"/>
                        </NavItem>

                        <NavItem href="/test_execution" label="Test Execution" isDrawerOpen={isDrawerOpen}>
                            <FileCog className="h-6 w-6 text-primary"/>
                        </NavItem>

                        <NavItem href="/web_scraper" label="Web Scraper" isDrawerOpen={isDrawerOpen}>
                            <Globe className="h-6 w-6 text-primary"/>
                        </NavItem>

                        <NavItem href="/pen_test" label="Penetration Test" isDrawerOpen={isDrawerOpen}>
                            <ShieldCheck className="h-6 w-6 text-primary"/>
                        </NavItem>
                    </div>

                    <div className="mt-auto flex flex-col">
                        <NavItem href="mailto:cpf-cds-cdwp@cpf.gov.sg" label="" isDrawerOpen={isDrawerOpen}>
                            <div className="flex items-center gap-2 text-sm text-red-600 hover:text-red-800">
                                <Mail className="h-4 w-4"/>
                                <span>Email Support</span>
                            </div>
                        </NavItem>

                        <NavItem href="#" label="" isDrawerOpen={isDrawerOpen}>
                            <button onClick={() => handleLogout(router)}
                                    className="flex items-center gap-2 w-full text-left text-sm text-red-600 hover:text-red-800">
                                <LogOut className="h-4 w-4"/>
                                <span>Logout</span>
                            </button>
                        </NavItem>
                    </div>
                </nav>
            </SheetContent>
        </Sheet>
    );
}
