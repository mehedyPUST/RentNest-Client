

import { Bars, Bell, Envelope, Gear, House, Magnifier, Person } from "@gravity-ui/icons";
import { Button, Drawer } from "@heroui/react";
import { LayoutSideContentLeft } from '@gravity-ui/icons';
import Link from "next/link";
import { Briefcase } from "lucide-react";

export function DashboardSidebar() {
    const navItems = [
        { icon: House, href: '/dashboard/recruiter', label: "Home" },
        { icon: Magnifier, href: '/dashboard/owner/property', label: "Properties" },
        { icon: Bell, href: '/dashboard/owner/property/add-property', label: "Add a New Property" },
        { icon: Briefcase, href: '/dashboard/recruiter/company', label: "Company Profile" },
        { icon: Envelope, href: '#', label: "Messages" },
        { icon: Person, href: '#', label: "Profile" },
        { icon: Gear, href: '#', label: "Settings" },
    ];

    const navContent = <nav className="flex flex-col gap-1">
        {navItems.map((item) => (
            <Link
                href={item.href}
                key={item.label}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-foreground transition-colors hover:bg-default"

            >
                <item.icon className="size-5 text-muted md:hidden" />
                {item.label}
            </Link>
        ))}
    </nav>


    return (
        <>
            <aside className="hidden w-64 shrink-0 border-r border-default p-4 lg:block">
                {navContent}
            </aside>
            <Drawer>
                <Button className='md:hidden' variant="secondary">
                    <LayoutSideContentLeft />
                    Sidebar
                </Button>
                <Drawer.Backdrop>
                    <Drawer.Content placement="left">
                        <Drawer.Dialog>
                            <Drawer.CloseTrigger />
                            <Drawer.Header>
                                <Drawer.Heading>Navigation</Drawer.Heading>
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