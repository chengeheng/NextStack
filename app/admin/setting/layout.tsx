import { Metadata } from "next";
import Image from "next/image";

// import { Separator } from "@/registry/new-york/ui/separator";
import { SidebarNav } from "@/app/admin/setting/sidebarNav";

export const metadata: Metadata = {
  title: "Forms",
  description: "Advanced form example using react-hook-form and Zod.",
};

const sidebarNavItems = [
  {
    title: "Profile",
    href: "/admin/setting/profile",
  },
  {
    title: "Account",
    href: "/admin/setting/account",
  },
];

interface SettingsLayoutProps {
  children: React.ReactNode;
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  return (
    <>
      <div className="hidden space-y-6 p-10 pb-16 md:block">
        <div className="space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
          <p className="text-muted-foreground">
            Manage your account settings and set e-mail preferences.
          </p>
        </div>
        {/* <Separator className="my-6" /> */}
        <div className="flex flex-col lg:flex-row gap-[20px]">
          <aside className="lg:w-1/5">
            <SidebarNav items={sidebarNavItems} />
          </aside>
          <div className="flex-1">{children}</div>
        </div>
      </div>
    </>
  );
}
