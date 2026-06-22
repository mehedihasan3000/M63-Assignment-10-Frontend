'use client'

import {
    Bell,
    House,
    LayoutSideContentLeft,
    Magnifier,
    Person,
    Persons,
    PersonPencil,
    ListCheckLock
} from "@gravity-ui/icons";
import { Button, Drawer } from "@heroui/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SideBar({ user }) {
    const donor = [
        { icon: House, href: "/dashboard", label: "Dashboard" },
        { icon: Magnifier, href: "/dashboard/my-donation-requests", label: "My Donation Requests" },
        { icon: PersonPencil, href: "/dashboard/create-donation-request", label: "Create Donation Request" },
        { icon: Person, href: "/dashboard/profile", label: "Profile" },
    ];

    const admin = [
        { icon: House, href: "/dashboard", label: "Dashboard" },
        { icon: Magnifier, href: "/dashboard/my-donation-requests", label: "My Donation Requests" },
        { icon: PersonPencil, href: "/dashboard/create-donation-request", label: "Create Donation Request" },
        { icon: Person, href: "/dashboard/profile", label: "Profile" },
        { icon: Persons, href: "/dashboard/all-users", label: "All Users" },
        { icon: ListCheckLock, href: "/dashboard/all-blood-donation-requests", label: "All Donation Requests" },
    ];

    const volunteer = [
        { icon: House, href: "/dashboard", label: "Dashboard" },
        { icon: Magnifier, href: "/dashboard/my-donation-requests", label: "My Donation Requests" },
        { icon: Bell, href: "/dashboard/create-donation-request", label: "Create Donation Request" },
        { icon: Person, href: "/dashboard/profile", label: "Profile" },
        { icon: ListCheckLock, href: "/dashboard/all-blood-donation-requests", label: "All Donation Requests" },
    ];

    const pathname = usePathname();

    let navItems = [];

    if (user) {
        if (user.role === "donor") {
            navItems = donor;
        } else if (user.role === "admin") {
            navItems = admin;
        } else if (user.role === "volunteer") {
            navItems = volunteer;
        }
    }

    const navContent = (
        <nav className="flex flex-col gap-1">
            {navItems.map((item) => {
                const isActive =
                    pathname === item.href;

                return (
                    <Link
                        key={item.label}
                        href={item.href}
                        className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all duration-200 ${
                            isActive
                                ? "bg-red-100 text-red-600 font-semibold dark:bg-red-900/20 dark:text-red-400"
                                : "text-foreground hover:bg-default"
                        }`}
                    >
                        <item.icon
                            className={`size-5 ${
                                isActive
                                    ? "text-red-600 dark:text-red-400"
                                    : "text-default-500"
                            }`}
                        />
                        {item.label}
                    </Link>
                );
            })}
        </nav>
    );

    return (
        <>
            {/* Desktop Sidebar */}
            <aside className="hidden w-64 shrink-0 border-r border-default p-4 lg:block">
                {navContent}
            </aside>

            {/* Mobile Sidebar */}
            <Drawer>
                <Button variant="secondary" className="lg:hidden">
                    <LayoutSideContentLeft />
                    SideBar
                </Button>

                <Drawer.Backdrop>
                    <Drawer.Content placement="left">
                        <Drawer.Dialog>
                            <Drawer.CloseTrigger />

                            <Drawer.Header>
                                <Drawer.Heading>
                                    Navigation
                                </Drawer.Heading>
                            </Drawer.Header>

                            <Drawer.Body>
                                {navContent}
                            </Drawer.Body>
                        </Drawer.Dialog>
                    </Drawer.Content>
                </Drawer.Backdrop>
            </Drawer>
        </>
    );
}