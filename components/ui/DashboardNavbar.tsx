"use client";

import { Button } from "@heroui/button";
import { Avatar } from "@heroui/avatar";
import { Link } from "@heroui/link";
import { Switch } from "@heroui/switch";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/dropdown";
import { useRouter, usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { signOut } from "firebase/auth";
import { useTheme } from "next-themes";
import { auth } from "@/config/firebase";
import { useAuthStore } from "@/store/authStore";

import {
  ChartIcon,
  MicrophoneIcon,
  MoonIcon,
  ResumeIcon,
  SunIcon,
  UserIcon,
} from "@/components/icons";

const navItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: <ChartIcon size={18} />,
  },
  {
    label: "Resume Analyzer",
    href: "/resume-analyzer",
    icon: <ResumeIcon size={18} />,
  },
  {
    label: "Mock Interview",
    href: "/interviews/setup",
    icon: <MicrophoneIcon size={18} />,
  },
];

export default function DashboardNavbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuthStore();
  const { theme, setTheme } = useTheme();

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/");
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-divider"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-xl md:text-2xl font-bold text-foreground hover:opacity-80 transition-opacity"
          >
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <span className="text-white text-sm md:text-lg font-bold">M</span>
            </div>
            <span className="hidden sm:inline">
              Mind<span className="text-primary">Mock</span>
            </span>
          </Link>

          {/* Navigation Links - Desktop */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200 ${
                    isActive
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-foreground/70 hover:text-foreground hover:bg-content2"
                  }`}
                >
                  {item.icon}
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* Right Side - Theme Toggle & User Menu */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-content2 hover:bg-content3 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <SunIcon size={20} />
              ) : (
                <MoonIcon size={20} />
              )}
            </motion.button>

            {/* Mobile Navigation */}
            <div className="flex md:hidden">
              <Dropdown placement="bottom-end">
                <DropdownTrigger>
                  <Button variant="light" isIconOnly size="sm">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="3" y1="12" x2="21" y2="12" />
                      <line x1="3" y1="6" x2="21" y2="6" />
                      <line x1="3" y1="18" x2="21" y2="18" />
                    </svg>
                  </Button>
                </DropdownTrigger>
                <DropdownMenu aria-label="Navigation">
                  {navItems.map((item) => (
                    <DropdownItem
                      key={item.href}
                      startContent={item.icon}
                      onPress={() => router.push(item.href)}
                    >
                      {item.label}
                    </DropdownItem>
                  ))}
                </DropdownMenu>
              </Dropdown>
            </div>

            {/* User Dropdown */}
            <Dropdown placement="bottom-end">
              <DropdownTrigger>
                <Avatar
                  as="button"
                  size="sm"
                  name={user?.displayName || user?.email || "User"}
                  src={user?.photoURL || undefined}
                  className="ring-2 ring-primary/20 transition-transform hover:scale-105"
                />
              </DropdownTrigger>
              <DropdownMenu aria-label="User Actions">
                <DropdownItem
                  key="profile"
                  className="h-14 gap-2"
                  textValue="Profile"
                >
                  <p className="font-semibold">Signed in as</p>
                  <p className="text-sm text-foreground/60">
                    {user?.email || "user@example.com"}
                  </p>
                </DropdownItem>
                <DropdownItem
                  key="dashboard"
                  startContent={<ChartIcon size={16} />}
                  onPress={() => router.push("/dashboard")}
                >
                  Dashboard
                </DropdownItem>
                <DropdownItem
                  key="interviews"
                  startContent={<MicrophoneIcon size={16} />}
                  onPress={() => router.push("/interviews/history")}
                >
                  Interview History
                </DropdownItem>
                <DropdownItem
                  key="resumes"
                  startContent={<ResumeIcon size={16} />}
                  onPress={() => router.push("/resume-analyzer/history")}
                >
                  Resume History
                </DropdownItem>
                <DropdownItem
                  key="theme"
                  startContent={theme === "dark" ? <SunIcon size={16} /> : <MoonIcon size={16} />}
                  onPress={toggleTheme}
                >
                  {theme === "dark" ? "Light Mode" : "Dark Mode"}
                </DropdownItem>
                <DropdownItem
                  key="logout"
                  color="danger"
                  className="text-danger"
                  onPress={handleLogout}
                >
                  Log Out
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
