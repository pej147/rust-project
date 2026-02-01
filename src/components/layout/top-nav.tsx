"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { cn } from "@/lib/utils";
import { isAdmin } from "@/lib/is-admin";

const navItems = [
  { href: "/map", label: "MAP" },
  { href: "/teams", label: "TEAMS" },
  { href: "/profile", label: "PROFILE" },
];

const adminNavItem = { href: "/admin", label: "ADMIN" };

export function TopNav() {
  const pathname = usePathname();
  const { data: session } = useSession();

  const items = isAdmin(session?.user?.role)
    ? [...navItems, adminNavItem]
    : navItems;

  return (
    <nav className="sticky top-0 z-50 border-b border-rust-border bg-rust-bg">
      <div className="flex items-center justify-center">
        {items.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "px-6 py-3 text-sm font-semibold tracking-widest transition-colors",
                isActive
                  ? "border-b-2 border-rust-primary text-rust-text"
                  : "text-rust-text-secondary hover:text-rust-text"
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
