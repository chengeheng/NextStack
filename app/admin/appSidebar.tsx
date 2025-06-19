"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { UserAvatar } from "@/app/admin/userAvatar";

const examples = [
  {
    name: "Setting",
    href: "/admin/setting",
    hidden: false,
  },
];

export function ExamplesNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const pathname = usePathname();

  return (
    <div className="relative flex items-center justify-between w-full">
      <ScrollArea className="max-w-[600px] lg:max-w-none">
        <div className={cn("flex items-center", className)} {...props}>
          <ExampleLink
            example={{ name: "Home", href: "/admin", hidden: false }}
            isActive={pathname === "/admin"}
          />
          {examples.map((example) => (
            <ExampleLink
              key={example.href}
              example={example}
              isActive={pathname?.startsWith(example.href) ?? false}
            />
          ))}
        </div>
        <ScrollBar orientation="horizontal" className="invisible" />
      </ScrollArea>
      <div className="flex items-center">
        <UserAvatar />
      </div>
    </div>
  );
}

function ExampleLink({
  example,
  isActive,
}: {
  example: (typeof examples)[number];
  isActive: boolean;
}) {
  if (example.hidden) {
    return null;
  }

  return (
    <Link
      href={example.href}
      key={example.href}
      className="flex h-7 items-center justify-center rounded-full px-4 text-center text-sm font-medium text-muted-foreground transition-colors hover:text-primary data-[active=true]:bg-muted data-[active=true]:text-primary"
      data-active={isActive}
    >
      {example.name}
    </Link>
  );
}
