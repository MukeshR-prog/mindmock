"use client";

import { Button } from "@heroui/button";
import { Avatar } from "@heroui/avatar";

type SaaSDashboardTopbarProps = {
  userName: string;
  userPhotoUrl?: string | null;
  onOpenSidebar: () => void;
};

export default function SaaSDashboardTopbar({
  userName,
  userPhotoUrl,
  onOpenSidebar,
}: SaaSDashboardTopbarProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-divider bg-background/85 backdrop-blur-lg">
      <div className="flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <Button isIconOnly variant="flat" className="lg:hidden" onPress={onOpenSidebar}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </Button>

          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-foreground/50">Dashboard</p>
            <h1 className="text-xl font-semibold sm:text-2xl">Welcome back, {userName}</h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <p className="hidden text-sm text-foreground/60 sm:block">
            {new Date().toLocaleDateString(undefined, {
              weekday: "short",
              month: "short",
              day: "numeric",
            })}
          </p>
          <Avatar name={userName} src={userPhotoUrl || undefined} size="sm" />
        </div>
      </div>
    </header>
  );
}