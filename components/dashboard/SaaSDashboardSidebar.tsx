"use client";

import { Button } from "@heroui/button";
import { Avatar } from "@heroui/avatar";
import { Divider } from "@heroui/divider";

import {
  ChartIcon,
  MicrophoneIcon,
  ResumeIcon,
  UserIcon,
  ArrowLeftIcon,
} from "@/components/icons";

type NavItem = {
  label: string;
  href: string;
  icon: React.ReactNode;
};

type SaaSDashboardSidebarProps = {
  pathname: string;
  isOpen: boolean;
  userName: string;
  userEmail: string;
  userPhotoUrl?: string | null;
  onNavigate: (href: string) => void;
  onLogout: () => void;
  onCloseMobile: () => void;
};

const navItems: NavItem[] = [
  { label: "Overview", href: "/dashboard", icon: <ChartIcon size={17} /> },
  { label: "Mock Interview", href: "/interviews/setup", icon: <MicrophoneIcon size={17} /> },
  { label: "Interview History", href: "/interviews/history", icon: <ChartIcon size={17} /> },
  { label: "Resume Analyzer", href: "/resume-analyzer", icon: <ResumeIcon size={17} /> },
  { label: "Resume History", href: "/resume-analyzer/history", icon: <ResumeIcon size={17} /> },
];

export default function SaaSDashboardSidebar({
  pathname,
  isOpen,
  userName,
  userEmail,
  userPhotoUrl,
  onNavigate,
  onLogout,
  onCloseMobile,
}: SaaSDashboardSidebarProps) {
  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity lg:hidden ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onCloseMobile}
      />

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 border-r border-divider bg-content1/95 p-4 backdrop-blur-lg transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="mb-6 flex items-center justify-between lg:justify-start">
          <button
            className="flex items-center gap-2"
            onClick={() => onNavigate("/dashboard")}
            type="button"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary text-white">
              M
            </div>
            <p className="text-xl font-semibold">
              Mind<span className="text-primary">Mock</span>
            </p>
          </button>

          <Button isIconOnly variant="light" className="lg:hidden" onPress={onCloseMobile}>
            <ArrowLeftIcon size={18} />
          </Button>
        </div>

        <div className="mb-5 rounded-2xl border border-divider bg-content2/40 p-3">
          <div className="mb-2 flex items-center gap-3">
            <Avatar name={userName} src={userPhotoUrl || undefined} size="sm" />
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{userName}</p>
              <p className="truncate text-xs text-foreground/60">{userEmail}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-content1 px-2 py-1 text-xs text-foreground/65">
            <UserIcon size={14} />
            Pro Candidate Workspace
          </div>
        </div>

        <div className="space-y-1">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <button
                key={item.href}
                type="button"
                onClick={() => {
                  onNavigate(item.href);
                  onCloseMobile();
                }}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm transition-colors ${
                  active
                    ? "bg-primary/15 text-primary"
                    : "text-foreground/70 hover:bg-content2/70 hover:text-foreground"
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        <Divider className="my-5" />

        <Button color="danger" variant="flat" className="w-full" onPress={onLogout}>
          Log Out
        </Button>
      </aside>
    </>
  );
}