"use client";

import * as React from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { HeroUIProvider } from "@heroui/system";

import { auth } from "@/config/firebase";
import { useAuthStore } from "@/store/authStore";

import type { ThemeProviderProps } from "next-themes";

/* ---------- Types ---------- */
interface ProvidersProps {
  children: React.ReactNode;
  themeProps?: ThemeProviderProps;
}

/* ---------- Module augmentation (Hero UI + Next Router) ---------- */
declare module "@react-types/shared" {
  interface RouterConfig {
    routerOptions: NonNullable<
      Parameters<ReturnType<typeof useRouter>["push"]>[1]
    >;
  }
}

/* ---------- Provider ---------- */
export default function Providers({
  children,
  themeProps,
}: ProvidersProps) {
  const router = useRouter();
  const { setUser, setLoading } = useAuthStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);

      // 🔐 Create user in DB on first login
      if (user) {
        (async () => {
          try {
            await fetch("/api/users", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                firebaseUid: user.uid,
                email: user.email,
                name: user.displayName,
                provider: user.providerData[0]?.providerId,
              }),
            });
          } catch (error) {
            console.error("Failed to sync user:", error);
          }
        })();
      }
    });

    return () => unsubscribe();
  }, [setUser, setLoading]);

  return (
    <HeroUIProvider navigate={router.push}>
      <NextThemesProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        {...themeProps}
      >
        {children}
      </NextThemesProvider>
    </HeroUIProvider>
  );
}
